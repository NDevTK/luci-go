// Copyright 2023 The LUCI Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package remote

import (
	"context"
	"net/http"
	"net/url"

	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	"golang.org/x/sync/errgroup"
	"google.golang.org/genproto/protobuf/field_mask"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/encoding/gzip"

	"go.chromium.org/luci/common/errors"
	pb "go.chromium.org/luci/config_service/proto"
	"go.chromium.org/luci/grpc/grpcmon"
	"go.chromium.org/luci/grpc/grpcutil"
	"go.chromium.org/luci/server/auth"

	"go.chromium.org/luci/config"
)

// retryPolicy is the default grpc retry policy for this Luci-config client.
const retryPolicy = `{
	"methodConfig": [{
		"name": [{ "service": "config.service.v2.Configs" }],
		"timeout": "60s",
		"retryPolicy": {
		  "maxAttempts": 5,
		  "initialBackoff": "1s",
		  "maxBackoff": "10s",
		  "backoffMultiplier": 1.5,
		  "retryableStatusCodes": ["UNAVAILABLE", "INTERNAL", "UNKNOWN"]
		}
	}]
}`

// NewV2 returns an implementation of the config Interface which talks to the
// real Luci-config service v2.
func NewV2(ctx context.Context, host string) (config.Interface, error) {
	creds, err := auth.GetPerRPCCredentials(ctx,
		auth.AsSelf,
		auth.WithIDTokenAudience("https://"+host),
	)
	if err != nil {
		return nil, errors.Annotate(err, "failed to get credentials to access %s", host).Err()
	}
	conn, err := grpc.DialContext(ctx, host+":443",
		grpc.WithTransportCredentials(credentials.NewTLS(nil)),
		grpc.WithPerRPCCredentials(creds),
		grpc.WithStatsHandler(&grpcmon.ClientRPCStatsMonitor{}),
		grpc.WithUnaryInterceptor(otelgrpc.UnaryClientInterceptor()),
		grpc.WithStreamInterceptor(otelgrpc.StreamClientInterceptor()),
		grpc.WithDefaultServiceConfig(retryPolicy),
	)
	if err != nil {
		return nil, errors.Annotate(err, "cannot dial to %s", host).Err()
	}

	t, err := auth.GetRPCTransport(ctx, auth.NoAuth)
	if err != nil {
		return nil, errors.Annotate(err, "failed to create a transport").Err()
	}

	return &remoteV2Impl{
		conn:       conn,
		grpcClient: pb.NewConfigsClient(conn),
		httpClient: &http.Client{Transport: t},
	}, nil
}

var _ config.Interface = &remoteV2Impl{}

// remoteV2Impl implements config.Interface and will make gRPC calls to Config
// Service V2.
type remoteV2Impl struct {
	conn       *grpc.ClientConn
	grpcClient pb.ConfigsClient
	// A http client with no additional authentication. Only used for downloading from signed urls.
	httpClient *http.Client
}

func (r *remoteV2Impl) GetConfig(ctx context.Context, configSet config.Set, path string, metaOnly bool) (*config.Config, error) {
	if err := r.checkInitialized(); err != nil {
		return nil, err
	}
	req := &pb.GetConfigRequest{
		ConfigSet: string(configSet),
		Path:      path,
	}
	if metaOnly {
		req.Fields = &field_mask.FieldMask{
			Paths: []string{"config_set", "path", "content_sha256", "revision", "url"},
		}
	}

	res, err := r.grpcClient.GetConfig(ctx, req)
	switch {
	case grpcutil.Code(err) == codes.NotFound:
		return nil, config.ErrNoConfig
	case err != nil:
		return nil, err
	}

	cfg := toConfig(res)
	if res.GetSignedUrl() != "" {
		content, err := config.DownloadConfigFromSignedURL(ctx, r.httpClient, res.GetSignedUrl())
		if err != nil {
			return nil, err
		}
		cfg.Content = string(content)
	}

	return cfg, nil
}

func (r *remoteV2Impl) GetProjectConfigs(ctx context.Context, path string, metaOnly bool) ([]config.Config, error) {
	if err := r.checkInitialized(); err != nil {
		return nil, err
	}
	req := &pb.GetProjectConfigsRequest{Path: path}
	if metaOnly {
		req.Fields = &field_mask.FieldMask{
			Paths: []string{"config_set", "path", "content_sha256", "revision", "url"},
		}
	}

	// This rpc response is usually larger than others. So instruct the Server to
	// return a compressed response to allow data transfer faster.
	res, err := r.grpcClient.GetProjectConfigs(ctx, req, grpc.UseCompressor(gzip.Name))
	if err != nil {
		return nil, err
	}

	eg, ectx := errgroup.WithContext(ctx)
	eg.SetLimit(8)
	configs := make([]config.Config, len(res.Configs))
	for i, cfg := range res.Configs {
		configs[i] = *toConfig(cfg)
		if cfg.GetSignedUrl() != "" {
			i := i
			signedURL := cfg.GetSignedUrl()
			eg.Go(func() error {
				content, err := config.DownloadConfigFromSignedURL(ectx, r.httpClient, signedURL)
				if err != nil {
					return errors.Annotate(err, "For file(%s) in config_set(%s)", configs[i].Path, configs[i].ConfigSet).Err()
				}
				configs[i].Content = string(content)
				return nil
			})
		}
	}

	if err := eg.Wait(); err != nil {
		return nil, err
	}
	return configs, nil
}

func (r *remoteV2Impl) GetProjects(ctx context.Context) ([]config.Project, error) {
	if err := r.checkInitialized(); err != nil {
		return nil, err
	}

	res, err := r.grpcClient.ListConfigSets(ctx, &pb.ListConfigSetsRequest{Domain: pb.ListConfigSetsRequest_PROJECT})
	if err != nil {
		return nil, err
	}

	projects := make([]config.Project, len(res.ConfigSets))
	for i, cs := range res.ConfigSets {
		projectID := config.Set(cs.Name).Project()
		parsedURL, err := url.Parse(cs.Url)
		if err != nil {
			return nil, errors.Annotate(err, "failed to parse repo url %s in project %s", cs.Url, projectID).Err()
		}
		projects[i] = config.Project{
			ID:       projectID,
			Name:     projectID,
			RepoURL:  parsedURL,
			RepoType: config.GitilesRepo,
		}
	}

	return projects, nil
}

func (r *remoteV2Impl) ListFiles(ctx context.Context, configSet config.Set) ([]string, error) {
	if err := r.checkInitialized(); err != nil {
		return nil, err
	}

	res, err := r.grpcClient.GetConfigSet(ctx, &pb.GetConfigSetRequest{
		ConfigSet: string(configSet),
		Fields: &field_mask.FieldMask{
			Paths: []string{"file_paths"},
		},
	})
	if err != nil {
		return nil, err
	}
	return res.FilePaths, nil
}

func (r *remoteV2Impl) Close() error {
	if r == nil || r.conn == nil {
		return nil
	}
	return r.conn.Close()
}

func (r *remoteV2Impl) checkInitialized() error {
	if r == nil || r.grpcClient == nil || r.httpClient == nil {
		return errors.New("The Luci-config client is not initialized")
	}
	return nil
}

func toConfig(configPb *pb.Config) *config.Config {
	return &config.Config{
		Meta: config.Meta{
			ConfigSet:   config.Set(configPb.ConfigSet),
			Path:        configPb.Path,
			ContentHash: configPb.ContentSha256,
			Revision:    configPb.Revision,
			ViewURL:     configPb.Url,
		},
		Content: string(configPb.GetRawContent()),
	}
}