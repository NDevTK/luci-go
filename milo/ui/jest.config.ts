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

import type { Config } from 'jest';

const config: Config = {
  // Use `js-with-babel` instead of `js-with-ts` because
  // 1. `js-with-babel` is significantly faster than `js-with-ts`. This is
  // likely because babel transpiles each file individually while tsc compiles
  // the entire project as a whole.
  // 2. The production build is also transpiled by babel. Using the same
  // transpiler helps ensuring the code under test behaves similar to the code
  // in production. Ideally, we should build testing code with the same
  // toolchain as we build production code (i.e. Vite). However, there's no
  // plugin supporting that yet.
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(test).[jt]s?(x)'],
  // Some modules use `es6` modules, which is not compatible with jest, so we
  // need to transform them.
  transformIgnorePatterns: ['/node_modules/?!(lodash-es|lit)'],
  setupFiles: ['./src/testing_tools/setup_env.ts'],
  moduleNameMapper: {
    '\\.(css|less|svg)$': 'identity-obj-proxy',
    '@/(.*)': '<rootDir>/src/$1',
  },
};

export default config;