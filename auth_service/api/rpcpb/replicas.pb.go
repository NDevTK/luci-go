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
// 	protoc-gen-go v1.33.0
// 	protoc        v5.26.1
// source: go.chromium.org/luci/auth_service/api/rpcpb/replicas.proto

package rpcpb

import (
	protocol "go.chromium.org/luci/server/auth/service/protocol"
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
	timestamppb "google.golang.org/protobuf/types/known/timestamppb"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

// The status of a push attempt to a replica.
type ReplicaPushStatus int32

const (
	ReplicaPushStatus_PUSH_STATUS_UNSPECIFIED ReplicaPushStatus = 0
	ReplicaPushStatus_SUCCESS                 ReplicaPushStatus = 1
	ReplicaPushStatus_TRANSIENT_ERROR         ReplicaPushStatus = 2
	ReplicaPushStatus_FATAL_ERROR             ReplicaPushStatus = 3
)

// Enum value maps for ReplicaPushStatus.
var (
	ReplicaPushStatus_name = map[int32]string{
		0: "PUSH_STATUS_UNSPECIFIED",
		1: "SUCCESS",
		2: "TRANSIENT_ERROR",
		3: "FATAL_ERROR",
	}
	ReplicaPushStatus_value = map[string]int32{
		"PUSH_STATUS_UNSPECIFIED": 0,
		"SUCCESS":                 1,
		"TRANSIENT_ERROR":         2,
		"FATAL_ERROR":             3,
	}
)

func (x ReplicaPushStatus) Enum() *ReplicaPushStatus {
	p := new(ReplicaPushStatus)
	*p = x
	return p
}

func (x ReplicaPushStatus) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (ReplicaPushStatus) Descriptor() protoreflect.EnumDescriptor {
	return file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_enumTypes[0].Descriptor()
}

func (ReplicaPushStatus) Type() protoreflect.EnumType {
	return &file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_enumTypes[0]
}

func (x ReplicaPushStatus) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use ReplicaPushStatus.Descriptor instead.
func (ReplicaPushStatus) EnumDescriptor() ([]byte, []int) {
	return file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_rawDescGZIP(), []int{0}
}

type ListReplicasResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// State of Auth Service's latest AuthDB revision.
	PrimaryRevision *protocol.AuthDBRevision `protobuf:"bytes,1,opt,name=primary_revision,json=primaryRevision,proto3" json:"primary_revision,omitempty"`
	// Value of components.auth.version.__version__ used by primary.
	AuthCodeVersion string `protobuf:"bytes,2,opt,name=auth_code_version,json=authCodeVersion,proto3" json:"auth_code_version,omitempty"`
	// All replica services' states that have Auth Service configured as their
	// primary service from which to receive AuthDB replication calls.
	Replicas []*ReplicaState `protobuf:"bytes,3,rep,name=replicas,proto3" json:"replicas,omitempty"`
	// When the ListReplicas request was processed, according to Auth Service's
	// clock.
	ProcessedAt *timestamppb.Timestamp `protobuf:"bytes,4,opt,name=processed_at,json=processedAt,proto3" json:"processed_at,omitempty"`
}

func (x *ListReplicasResponse) Reset() {
	*x = ListReplicasResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ListReplicasResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ListReplicasResponse) ProtoMessage() {}

func (x *ListReplicasResponse) ProtoReflect() protoreflect.Message {
	mi := &file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ListReplicasResponse.ProtoReflect.Descriptor instead.
func (*ListReplicasResponse) Descriptor() ([]byte, []int) {
	return file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_rawDescGZIP(), []int{0}
}

func (x *ListReplicasResponse) GetPrimaryRevision() *protocol.AuthDBRevision {
	if x != nil {
		return x.PrimaryRevision
	}
	return nil
}

func (x *ListReplicasResponse) GetAuthCodeVersion() string {
	if x != nil {
		return x.AuthCodeVersion
	}
	return ""
}

func (x *ListReplicasResponse) GetReplicas() []*ReplicaState {
	if x != nil {
		return x.Replicas
	}
	return nil
}

func (x *ListReplicasResponse) GetProcessedAt() *timestamppb.Timestamp {
	if x != nil {
		return x.ProcessedAt
	}
	return nil
}

type ReplicaState struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// The App ID of the replica.
	AppId string `protobuf:"bytes,1,opt,name=app_id,json=appId,proto3" json:"app_id,omitempty"`
	// Base URL of the replica host which can receive AuthDB push updates, e.g.
	// "https://luci-config-dev.appspot.com"
	BaseUrl string `protobuf:"bytes,2,opt,name=base_url,json=baseUrl,proto3" json:"base_url,omitempty"`
	// The replica's current AuthDB revision.
	AuthDbRev int64 `protobuf:"varint,3,opt,name=auth_db_rev,json=authDbRev,proto3" json:"auth_db_rev,omitempty"`
	// Timestamp of when the replica's current AuthDB revision was created (by
	// the primary service's clock).
	RevModified *timestamppb.Timestamp `protobuf:"bytes,4,opt,name=rev_modified,json=revModified,proto3" json:"rev_modified,omitempty"`
	// Value of components.auth.version.__version__ used by the replica.
	AuthCodeVersion string `protobuf:"bytes,5,opt,name=auth_code_version,json=authCodeVersion,proto3" json:"auth_code_version,omitempty"`
	// Timestamp of when the last push attempt started.
	PushStarted *timestamppb.Timestamp `protobuf:"bytes,6,opt,name=push_started,json=pushStarted,proto3" json:"push_started,omitempty"`
	// Timestamp of when the last push attempt finished (regardless of status).
	PushFinished *timestamppb.Timestamp `protobuf:"bytes,7,opt,name=push_finished,json=pushFinished,proto3" json:"push_finished,omitempty"`
	// Status of the last push attempt.
	PushStatus ReplicaPushStatus `protobuf:"varint,8,opt,name=push_status,json=pushStatus,proto3,enum=auth.service.ReplicaPushStatus" json:"push_status,omitempty"`
	// Error message of the last push attempt. If the last push attempt was
	// successful, this will be an empty string.
	PushError string `protobuf:"bytes,9,opt,name=push_error,json=pushError,proto3" json:"push_error,omitempty"`
}

func (x *ReplicaState) Reset() {
	*x = ReplicaState{}
	if protoimpl.UnsafeEnabled {
		mi := &file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ReplicaState) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ReplicaState) ProtoMessage() {}

func (x *ReplicaState) ProtoReflect() protoreflect.Message {
	mi := &file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ReplicaState.ProtoReflect.Descriptor instead.
func (*ReplicaState) Descriptor() ([]byte, []int) {
	return file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_rawDescGZIP(), []int{1}
}

func (x *ReplicaState) GetAppId() string {
	if x != nil {
		return x.AppId
	}
	return ""
}

func (x *ReplicaState) GetBaseUrl() string {
	if x != nil {
		return x.BaseUrl
	}
	return ""
}

func (x *ReplicaState) GetAuthDbRev() int64 {
	if x != nil {
		return x.AuthDbRev
	}
	return 0
}

func (x *ReplicaState) GetRevModified() *timestamppb.Timestamp {
	if x != nil {
		return x.RevModified
	}
	return nil
}

func (x *ReplicaState) GetAuthCodeVersion() string {
	if x != nil {
		return x.AuthCodeVersion
	}
	return ""
}

func (x *ReplicaState) GetPushStarted() *timestamppb.Timestamp {
	if x != nil {
		return x.PushStarted
	}
	return nil
}

func (x *ReplicaState) GetPushFinished() *timestamppb.Timestamp {
	if x != nil {
		return x.PushFinished
	}
	return nil
}

func (x *ReplicaState) GetPushStatus() ReplicaPushStatus {
	if x != nil {
		return x.PushStatus
	}
	return ReplicaPushStatus_PUSH_STATUS_UNSPECIFIED
}

func (x *ReplicaState) GetPushError() string {
	if x != nil {
		return x.PushError
	}
	return ""
}

var File_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto protoreflect.FileDescriptor

var file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_rawDesc = []byte{
	0x0a, 0x3a, 0x67, 0x6f, 0x2e, 0x63, 0x68, 0x72, 0x6f, 0x6d, 0x69, 0x75, 0x6d, 0x2e, 0x6f, 0x72,
	0x67, 0x2f, 0x6c, 0x75, 0x63, 0x69, 0x2f, 0x61, 0x75, 0x74, 0x68, 0x5f, 0x73, 0x65, 0x72, 0x76,
	0x69, 0x63, 0x65, 0x2f, 0x61, 0x70, 0x69, 0x2f, 0x72, 0x70, 0x63, 0x70, 0x62, 0x2f, 0x72, 0x65,
	0x70, 0x6c, 0x69, 0x63, 0x61, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x0c, 0x61, 0x75,
	0x74, 0x68, 0x2e, 0x73, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x1a, 0x1b, 0x67, 0x6f, 0x6f, 0x67,
	0x6c, 0x65, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2f, 0x65, 0x6d, 0x70, 0x74,
	0x79, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a, 0x1f, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f,
	0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2f, 0x74, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61,
	0x6d, 0x70, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a, 0x59, 0x67, 0x6f, 0x2e, 0x63, 0x68, 0x72,
	0x6f, 0x6d, 0x69, 0x75, 0x6d, 0x2e, 0x6f, 0x72, 0x67, 0x2f, 0x6c, 0x75, 0x63, 0x69, 0x2f, 0x73,
	0x65, 0x72, 0x76, 0x65, 0x72, 0x2f, 0x61, 0x75, 0x74, 0x68, 0x2f, 0x73, 0x65, 0x72, 0x76, 0x69,
	0x63, 0x65, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x63, 0x6f, 0x6c, 0x2f, 0x63, 0x6f, 0x6d, 0x70,
	0x6f, 0x6e, 0x65, 0x6e, 0x74, 0x73, 0x2f, 0x61, 0x75, 0x74, 0x68, 0x2f, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x2f, 0x72, 0x65, 0x70, 0x6c, 0x69, 0x63, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x22, 0x85, 0x02, 0x0a, 0x14, 0x4c, 0x69, 0x73, 0x74, 0x52, 0x65, 0x70, 0x6c,
	0x69, 0x63, 0x61, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x4a, 0x0a, 0x10,
	0x70, 0x72, 0x69, 0x6d, 0x61, 0x72, 0x79, 0x5f, 0x72, 0x65, 0x76, 0x69, 0x73, 0x69, 0x6f, 0x6e,
	0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1f, 0x2e, 0x63, 0x6f, 0x6d, 0x70, 0x6f, 0x6e, 0x65,
	0x6e, 0x74, 0x73, 0x2e, 0x61, 0x75, 0x74, 0x68, 0x2e, 0x41, 0x75, 0x74, 0x68, 0x44, 0x42, 0x52,
	0x65, 0x76, 0x69, 0x73, 0x69, 0x6f, 0x6e, 0x52, 0x0f, 0x70, 0x72, 0x69, 0x6d, 0x61, 0x72, 0x79,
	0x52, 0x65, 0x76, 0x69, 0x73, 0x69, 0x6f, 0x6e, 0x12, 0x2a, 0x0a, 0x11, 0x61, 0x75, 0x74, 0x68,
	0x5f, 0x63, 0x6f, 0x64, 0x65, 0x5f, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x18, 0x02, 0x20,
	0x01, 0x28, 0x09, 0x52, 0x0f, 0x61, 0x75, 0x74, 0x68, 0x43, 0x6f, 0x64, 0x65, 0x56, 0x65, 0x72,
	0x73, 0x69, 0x6f, 0x6e, 0x12, 0x36, 0x0a, 0x08, 0x72, 0x65, 0x70, 0x6c, 0x69, 0x63, 0x61, 0x73,
	0x18, 0x03, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x61, 0x75, 0x74, 0x68, 0x2e, 0x73, 0x65,
	0x72, 0x76, 0x69, 0x63, 0x65, 0x2e, 0x52, 0x65, 0x70, 0x6c, 0x69, 0x63, 0x61, 0x53, 0x74, 0x61,
	0x74, 0x65, 0x52, 0x08, 0x72, 0x65, 0x70, 0x6c, 0x69, 0x63, 0x61, 0x73, 0x12, 0x3d, 0x0a, 0x0c,
	0x70, 0x72, 0x6f, 0x63, 0x65, 0x73, 0x73, 0x65, 0x64, 0x5f, 0x61, 0x74, 0x18, 0x04, 0x20, 0x01,
	0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x62, 0x75, 0x66, 0x2e, 0x54, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x52, 0x0b,
	0x70, 0x72, 0x6f, 0x63, 0x65, 0x73, 0x73, 0x65, 0x64, 0x41, 0x74, 0x22, 0xac, 0x03, 0x0a, 0x0c,
	0x52, 0x65, 0x70, 0x6c, 0x69, 0x63, 0x61, 0x53, 0x74, 0x61, 0x74, 0x65, 0x12, 0x15, 0x0a, 0x06,
	0x61, 0x70, 0x70, 0x5f, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x05, 0x61, 0x70,
	0x70, 0x49, 0x64, 0x12, 0x19, 0x0a, 0x08, 0x62, 0x61, 0x73, 0x65, 0x5f, 0x75, 0x72, 0x6c, 0x18,
	0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x62, 0x61, 0x73, 0x65, 0x55, 0x72, 0x6c, 0x12, 0x1e,
	0x0a, 0x0b, 0x61, 0x75, 0x74, 0x68, 0x5f, 0x64, 0x62, 0x5f, 0x72, 0x65, 0x76, 0x18, 0x03, 0x20,
	0x01, 0x28, 0x03, 0x52, 0x09, 0x61, 0x75, 0x74, 0x68, 0x44, 0x62, 0x52, 0x65, 0x76, 0x12, 0x3d,
	0x0a, 0x0c, 0x72, 0x65, 0x76, 0x5f, 0x6d, 0x6f, 0x64, 0x69, 0x66, 0x69, 0x65, 0x64, 0x18, 0x04,
	0x20, 0x01, 0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x54, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70,
	0x52, 0x0b, 0x72, 0x65, 0x76, 0x4d, 0x6f, 0x64, 0x69, 0x66, 0x69, 0x65, 0x64, 0x12, 0x2a, 0x0a,
	0x11, 0x61, 0x75, 0x74, 0x68, 0x5f, 0x63, 0x6f, 0x64, 0x65, 0x5f, 0x76, 0x65, 0x72, 0x73, 0x69,
	0x6f, 0x6e, 0x18, 0x05, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0f, 0x61, 0x75, 0x74, 0x68, 0x43, 0x6f,
	0x64, 0x65, 0x56, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x12, 0x3d, 0x0a, 0x0c, 0x70, 0x75, 0x73,
	0x68, 0x5f, 0x73, 0x74, 0x61, 0x72, 0x74, 0x65, 0x64, 0x18, 0x06, 0x20, 0x01, 0x28, 0x0b, 0x32,
	0x1a, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75,
	0x66, 0x2e, 0x54, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x52, 0x0b, 0x70, 0x75, 0x73,
	0x68, 0x53, 0x74, 0x61, 0x72, 0x74, 0x65, 0x64, 0x12, 0x3f, 0x0a, 0x0d, 0x70, 0x75, 0x73, 0x68,
	0x5f, 0x66, 0x69, 0x6e, 0x69, 0x73, 0x68, 0x65, 0x64, 0x18, 0x07, 0x20, 0x01, 0x28, 0x0b, 0x32,
	0x1a, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75,
	0x66, 0x2e, 0x54, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x52, 0x0c, 0x70, 0x75, 0x73,
	0x68, 0x46, 0x69, 0x6e, 0x69, 0x73, 0x68, 0x65, 0x64, 0x12, 0x40, 0x0a, 0x0b, 0x70, 0x75, 0x73,
	0x68, 0x5f, 0x73, 0x74, 0x61, 0x74, 0x75, 0x73, 0x18, 0x08, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x1f,
	0x2e, 0x61, 0x75, 0x74, 0x68, 0x2e, 0x73, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x2e, 0x52, 0x65,
	0x70, 0x6c, 0x69, 0x63, 0x61, 0x50, 0x75, 0x73, 0x68, 0x53, 0x74, 0x61, 0x74, 0x75, 0x73, 0x52,
	0x0a, 0x70, 0x75, 0x73, 0x68, 0x53, 0x74, 0x61, 0x74, 0x75, 0x73, 0x12, 0x1d, 0x0a, 0x0a, 0x70,
	0x75, 0x73, 0x68, 0x5f, 0x65, 0x72, 0x72, 0x6f, 0x72, 0x18, 0x09, 0x20, 0x01, 0x28, 0x09, 0x52,
	0x09, 0x70, 0x75, 0x73, 0x68, 0x45, 0x72, 0x72, 0x6f, 0x72, 0x2a, 0x63, 0x0a, 0x11, 0x52, 0x65,
	0x70, 0x6c, 0x69, 0x63, 0x61, 0x50, 0x75, 0x73, 0x68, 0x53, 0x74, 0x61, 0x74, 0x75, 0x73, 0x12,
	0x1b, 0x0a, 0x17, 0x50, 0x55, 0x53, 0x48, 0x5f, 0x53, 0x54, 0x41, 0x54, 0x55, 0x53, 0x5f, 0x55,
	0x4e, 0x53, 0x50, 0x45, 0x43, 0x49, 0x46, 0x49, 0x45, 0x44, 0x10, 0x00, 0x12, 0x0b, 0x0a, 0x07,
	0x53, 0x55, 0x43, 0x43, 0x45, 0x53, 0x53, 0x10, 0x01, 0x12, 0x13, 0x0a, 0x0f, 0x54, 0x52, 0x41,
	0x4e, 0x53, 0x49, 0x45, 0x4e, 0x54, 0x5f, 0x45, 0x52, 0x52, 0x4f, 0x52, 0x10, 0x02, 0x12, 0x0f,
	0x0a, 0x0b, 0x46, 0x41, 0x54, 0x41, 0x4c, 0x5f, 0x45, 0x52, 0x52, 0x4f, 0x52, 0x10, 0x03, 0x32,
	0x56, 0x0a, 0x08, 0x52, 0x65, 0x70, 0x6c, 0x69, 0x63, 0x61, 0x73, 0x12, 0x4a, 0x0a, 0x0c, 0x4c,
	0x69, 0x73, 0x74, 0x52, 0x65, 0x70, 0x6c, 0x69, 0x63, 0x61, 0x73, 0x12, 0x16, 0x2e, 0x67, 0x6f,
	0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x45, 0x6d,
	0x70, 0x74, 0x79, 0x1a, 0x22, 0x2e, 0x61, 0x75, 0x74, 0x68, 0x2e, 0x73, 0x65, 0x72, 0x76, 0x69,
	0x63, 0x65, 0x2e, 0x4c, 0x69, 0x73, 0x74, 0x52, 0x65, 0x70, 0x6c, 0x69, 0x63, 0x61, 0x73, 0x52,
	0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x2d, 0x5a, 0x2b, 0x67, 0x6f, 0x2e, 0x63, 0x68,
	0x72, 0x6f, 0x6d, 0x69, 0x75, 0x6d, 0x2e, 0x6f, 0x72, 0x67, 0x2f, 0x6c, 0x75, 0x63, 0x69, 0x2f,
	0x61, 0x75, 0x74, 0x68, 0x5f, 0x73, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x2f, 0x61, 0x70, 0x69,
	0x2f, 0x72, 0x70, 0x63, 0x70, 0x62, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_rawDescOnce sync.Once
	file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_rawDescData = file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_rawDesc
)

func file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_rawDescGZIP() []byte {
	file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_rawDescOnce.Do(func() {
		file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_rawDescData = protoimpl.X.CompressGZIP(file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_rawDescData)
	})
	return file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_rawDescData
}

var file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_enumTypes = make([]protoimpl.EnumInfo, 1)
var file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_goTypes = []interface{}{
	(ReplicaPushStatus)(0),          // 0: auth.service.ReplicaPushStatus
	(*ListReplicasResponse)(nil),    // 1: auth.service.ListReplicasResponse
	(*ReplicaState)(nil),            // 2: auth.service.ReplicaState
	(*protocol.AuthDBRevision)(nil), // 3: components.auth.AuthDBRevision
	(*timestamppb.Timestamp)(nil),   // 4: google.protobuf.Timestamp
	(*emptypb.Empty)(nil),           // 5: google.protobuf.Empty
}
var file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_depIdxs = []int32{
	3, // 0: auth.service.ListReplicasResponse.primary_revision:type_name -> components.auth.AuthDBRevision
	2, // 1: auth.service.ListReplicasResponse.replicas:type_name -> auth.service.ReplicaState
	4, // 2: auth.service.ListReplicasResponse.processed_at:type_name -> google.protobuf.Timestamp
	4, // 3: auth.service.ReplicaState.rev_modified:type_name -> google.protobuf.Timestamp
	4, // 4: auth.service.ReplicaState.push_started:type_name -> google.protobuf.Timestamp
	4, // 5: auth.service.ReplicaState.push_finished:type_name -> google.protobuf.Timestamp
	0, // 6: auth.service.ReplicaState.push_status:type_name -> auth.service.ReplicaPushStatus
	5, // 7: auth.service.Replicas.ListReplicas:input_type -> google.protobuf.Empty
	1, // 8: auth.service.Replicas.ListReplicas:output_type -> auth.service.ListReplicasResponse
	8, // [8:9] is the sub-list for method output_type
	7, // [7:8] is the sub-list for method input_type
	7, // [7:7] is the sub-list for extension type_name
	7, // [7:7] is the sub-list for extension extendee
	0, // [0:7] is the sub-list for field type_name
}

func init() { file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_init() }
func file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_init() {
	if File_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ListReplicasResponse); i {
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
		file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ReplicaState); i {
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
			RawDescriptor: file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_rawDesc,
			NumEnums:      1,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_goTypes,
		DependencyIndexes: file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_depIdxs,
		EnumInfos:         file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_enumTypes,
		MessageInfos:      file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_msgTypes,
	}.Build()
	File_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto = out.File
	file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_rawDesc = nil
	file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_goTypes = nil
	file_go_chromium_org_luci_auth_service_api_rpcpb_replicas_proto_depIdxs = nil
}