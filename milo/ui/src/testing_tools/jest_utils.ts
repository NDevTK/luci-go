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

// We cannot simply export this because this is often used in the module factory
// in a `jest.mock('module-name', () => { /* module factory */ })` call.
// `jest.mock` calls are automatically moved to the beginning of a test file by
// the jest test runner (i.e. before any import statements), making it
// impossible to use imported symbols in the module factory.
self.createSelectiveMockFromModule = function <T = unknown>(
  moduleName: string,
  keysToMock: ReadonlyArray<keyof NoInfer<T>>
): T {
  const actualModule = jest.requireActual(moduleName);
  const mockedModule = jest.createMockFromModule(moduleName) as T;

  return {
    ...actualModule,
    ...Object.fromEntries(keysToMock.map((k) => [k, mockedModule[k]])),
  };
};

// Add an `export` statement to make this a module.
export {};