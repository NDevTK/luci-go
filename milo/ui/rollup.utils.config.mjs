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

import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

/** @type {import('rollup').RollupOptions[]} */
const options = [
  {
    input: 'src/testing_tools/resultdb_reporter/index.ts',
    output: {
      file: 'generated/resultdb_reporter.cjs',
      // Jest's ES module support is experimental as of 2024-09-23.
      // https://jestjs.io/docs/ecmascript-modules
      //
      // Use commonjs module instead.
      format: 'commonjs',
    },
    plugins: [
      json(),
      commonjs(),
      nodeResolve({ exportConditions: ['node'] }),
      typescript({ outDir: 'generated', sourceMap: false }),
    ],
  },
];

export default options;
