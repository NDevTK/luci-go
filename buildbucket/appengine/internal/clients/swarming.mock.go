// Code generated by MockGen. DO NOT EDIT.
// Source: swarming.go

package clients

import (
	context "context"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
	apipb "go.chromium.org/luci/swarming/proto/api_v2"
)

// MockSwarmingClient is a mock of SwarmingClient interface.
type MockSwarmingClient struct {
	ctrl     *gomock.Controller
	recorder *MockSwarmingClientMockRecorder
}

// MockSwarmingClientMockRecorder is the mock recorder for MockSwarmingClient.
type MockSwarmingClientMockRecorder struct {
	mock *MockSwarmingClient
}

// NewMockSwarmingClient creates a new mock instance.
func NewMockSwarmingClient(ctrl *gomock.Controller) *MockSwarmingClient {
	mock := &MockSwarmingClient{ctrl: ctrl}
	mock.recorder = &MockSwarmingClientMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockSwarmingClient) EXPECT() *MockSwarmingClientMockRecorder {
	return m.recorder
}

// CancelTask mocks base method.
func (m *MockSwarmingClient) CancelTask(ctx context.Context, req *apipb.TaskCancelRequest) (*apipb.CancelResponse, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CancelTask", ctx, req)
	ret0, _ := ret[0].(*apipb.CancelResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CancelTask indicates an expected call of CancelTask.
func (mr *MockSwarmingClientMockRecorder) CancelTask(ctx, req interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CancelTask", reflect.TypeOf((*MockSwarmingClient)(nil).CancelTask), ctx, req)
}

// CreateTask mocks base method.
func (m *MockSwarmingClient) CreateTask(ctx context.Context, createTaskReq *apipb.NewTaskRequest) (*apipb.TaskRequestMetadataResponse, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateTask", ctx, createTaskReq)
	ret0, _ := ret[0].(*apipb.TaskRequestMetadataResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateTask indicates an expected call of CreateTask.
func (mr *MockSwarmingClientMockRecorder) CreateTask(ctx, createTaskReq interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateTask", reflect.TypeOf((*MockSwarmingClient)(nil).CreateTask), ctx, createTaskReq)
}

// GetTaskResult mocks base method.
func (m *MockSwarmingClient) GetTaskResult(ctx context.Context, taskID string) (*apipb.TaskResultResponse, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetTaskResult", ctx, taskID)
	ret0, _ := ret[0].(*apipb.TaskResultResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetTaskResult indicates an expected call of GetTaskResult.
func (mr *MockSwarmingClientMockRecorder) GetTaskResult(ctx, taskID interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetTaskResult", reflect.TypeOf((*MockSwarmingClient)(nil).GetTaskResult), ctx, taskID)
}
