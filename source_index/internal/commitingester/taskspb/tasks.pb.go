// Copyright 2024 The LUCI Authors.
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

// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.34.2
// 	protoc        v5.26.1
// source: go.chromium.org/luci/source_index/internal/commitingester/taskspb/tasks.proto

package taskspb

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

// Payload of IngestCommits task.
type IngestCommits struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Required. The gitiles host. Must be a subdomain of `.googlesource.com`
	// (e.g. chromium.googlesource.com).
	Host string `protobuf:"bytes,1,opt,name=host,proto3" json:"host,omitempty"`
	// Required. The Git project (e.g. chromium/src).
	Repository string `protobuf:"bytes,2,opt,name=repository,proto3" json:"repository,omitempty"`
	// Required. The commit to start the ingestion from. This commit and all of
	// its ancestors will all be ingested.
	//
	// In practice, the ingestion will stop
	//  1. when it reaches a commit that is already ingested, or
	//  2. when it reaches the first commit (the commit with no ancestors).
	Commitish string `protobuf:"bytes,3,opt,name=commitish,proto3" json:"commitish,omitempty"`
	// The page token value to use when calling Gitiles.Log.
	//   - For the first task, this should be "".
	//   - For subsequent tasks, this is the next_page_token value returned by the
	//     last call.
	PageToken string `protobuf:"bytes,4,opt,name=page_token,json=pageToken,proto3" json:"page_token,omitempty"`
	// Optional. The task number of IngestCommits task.
	//
	// This is only used for logging/monitoring purpose.
	TaskIndex int64 `protobuf:"varint,5,opt,name=task_index,json=taskIndex,proto3" json:"task_index,omitempty"`
}

func (x *IngestCommits) Reset() {
	*x = IngestCommits{}
	if protoimpl.UnsafeEnabled {
		mi := &file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *IngestCommits) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*IngestCommits) ProtoMessage() {}

func (x *IngestCommits) ProtoReflect() protoreflect.Message {
	mi := &file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use IngestCommits.ProtoReflect.Descriptor instead.
func (*IngestCommits) Descriptor() ([]byte, []int) {
	return file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_rawDescGZIP(), []int{0}
}

func (x *IngestCommits) GetHost() string {
	if x != nil {
		return x.Host
	}
	return ""
}

func (x *IngestCommits) GetRepository() string {
	if x != nil {
		return x.Repository
	}
	return ""
}

func (x *IngestCommits) GetCommitish() string {
	if x != nil {
		return x.Commitish
	}
	return ""
}

func (x *IngestCommits) GetPageToken() string {
	if x != nil {
		return x.PageToken
	}
	return ""
}

func (x *IngestCommits) GetTaskIndex() int64 {
	if x != nil {
		return x.TaskIndex
	}
	return 0
}

var File_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto protoreflect.FileDescriptor

var file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_rawDesc = []byte{
	0x0a, 0x4d, 0x67, 0x6f, 0x2e, 0x63, 0x68, 0x72, 0x6f, 0x6d, 0x69, 0x75, 0x6d, 0x2e, 0x6f, 0x72,
	0x67, 0x2f, 0x6c, 0x75, 0x63, 0x69, 0x2f, 0x73, 0x6f, 0x75, 0x72, 0x63, 0x65, 0x5f, 0x69, 0x6e,
	0x64, 0x65, 0x78, 0x2f, 0x69, 0x6e, 0x74, 0x65, 0x72, 0x6e, 0x61, 0x6c, 0x2f, 0x63, 0x6f, 0x6d,
	0x6d, 0x69, 0x74, 0x69, 0x6e, 0x67, 0x65, 0x73, 0x74, 0x65, 0x72, 0x2f, 0x74, 0x61, 0x73, 0x6b,
	0x73, 0x70, 0x62, 0x2f, 0x74, 0x61, 0x73, 0x6b, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12,
	0x2f, 0x6c, 0x75, 0x63, 0x69, 0x2e, 0x73, 0x6f, 0x75, 0x72, 0x63, 0x65, 0x5f, 0x69, 0x6e, 0x64,
	0x65, 0x78, 0x2e, 0x69, 0x6e, 0x74, 0x65, 0x72, 0x6e, 0x61, 0x6c, 0x2e, 0x63, 0x6f, 0x6d, 0x6d,
	0x69, 0x74, 0x69, 0x6e, 0x67, 0x65, 0x73, 0x74, 0x65, 0x72, 0x2e, 0x74, 0x61, 0x73, 0x6b, 0x73,
	0x22, 0x9f, 0x01, 0x0a, 0x0d, 0x49, 0x6e, 0x67, 0x65, 0x73, 0x74, 0x43, 0x6f, 0x6d, 0x6d, 0x69,
	0x74, 0x73, 0x12, 0x12, 0x0a, 0x04, 0x68, 0x6f, 0x73, 0x74, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x04, 0x68, 0x6f, 0x73, 0x74, 0x12, 0x1e, 0x0a, 0x0a, 0x72, 0x65, 0x70, 0x6f, 0x73, 0x69,
	0x74, 0x6f, 0x72, 0x79, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0a, 0x72, 0x65, 0x70, 0x6f,
	0x73, 0x69, 0x74, 0x6f, 0x72, 0x79, 0x12, 0x1c, 0x0a, 0x09, 0x63, 0x6f, 0x6d, 0x6d, 0x69, 0x74,
	0x69, 0x73, 0x68, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x09, 0x63, 0x6f, 0x6d, 0x6d, 0x69,
	0x74, 0x69, 0x73, 0x68, 0x12, 0x1d, 0x0a, 0x0a, 0x70, 0x61, 0x67, 0x65, 0x5f, 0x74, 0x6f, 0x6b,
	0x65, 0x6e, 0x18, 0x04, 0x20, 0x01, 0x28, 0x09, 0x52, 0x09, 0x70, 0x61, 0x67, 0x65, 0x54, 0x6f,
	0x6b, 0x65, 0x6e, 0x12, 0x1d, 0x0a, 0x0a, 0x74, 0x61, 0x73, 0x6b, 0x5f, 0x69, 0x6e, 0x64, 0x65,
	0x78, 0x18, 0x05, 0x20, 0x01, 0x28, 0x03, 0x52, 0x09, 0x74, 0x61, 0x73, 0x6b, 0x49, 0x6e, 0x64,
	0x65, 0x78, 0x42, 0x43, 0x5a, 0x41, 0x67, 0x6f, 0x2e, 0x63, 0x68, 0x72, 0x6f, 0x6d, 0x69, 0x75,
	0x6d, 0x2e, 0x6f, 0x72, 0x67, 0x2f, 0x6c, 0x75, 0x63, 0x69, 0x2f, 0x73, 0x6f, 0x75, 0x72, 0x63,
	0x65, 0x5f, 0x69, 0x6e, 0x64, 0x65, 0x78, 0x2f, 0x69, 0x6e, 0x74, 0x65, 0x72, 0x6e, 0x61, 0x6c,
	0x2f, 0x63, 0x6f, 0x6d, 0x6d, 0x69, 0x74, 0x69, 0x6e, 0x67, 0x65, 0x73, 0x74, 0x65, 0x72, 0x2f,
	0x74, 0x61, 0x73, 0x6b, 0x73, 0x70, 0x62, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_rawDescOnce sync.Once
	file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_rawDescData = file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_rawDesc
)

func file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_rawDescGZIP() []byte {
	file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_rawDescOnce.Do(func() {
		file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_rawDescData = protoimpl.X.CompressGZIP(file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_rawDescData)
	})
	return file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_rawDescData
}

var file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_msgTypes = make([]protoimpl.MessageInfo, 1)
var file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_goTypes = []any{
	(*IngestCommits)(nil), // 0: luci.source_index.internal.commitingester.tasks.IngestCommits
}
var file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_depIdxs = []int32{
	0, // [0:0] is the sub-list for method output_type
	0, // [0:0] is the sub-list for method input_type
	0, // [0:0] is the sub-list for extension type_name
	0, // [0:0] is the sub-list for extension extendee
	0, // [0:0] is the sub-list for field type_name
}

func init() {
	file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_init()
}
func file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_init() {
	if File_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_msgTypes[0].Exporter = func(v any, i int) any {
			switch v := v.(*IngestCommits); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   1,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_goTypes,
		DependencyIndexes: file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_depIdxs,
		MessageInfos:      file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_msgTypes,
	}.Build()
	File_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto = out.File
	file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_rawDesc = nil
	file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_goTypes = nil
	file_go_chromium_org_luci_source_index_internal_commitingester_taskspb_tasks_proto_depIdxs = nil
}