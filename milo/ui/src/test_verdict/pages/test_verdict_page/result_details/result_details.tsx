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

import Grid from '@mui/material/Grid';

import { useSelectedResultIndex, useTestVariant } from '../context';

import { ResultBasicInfo } from './result_basic_info';
import { ResultTags } from './result_tags';

export function ResultDetails() {
  const selectedResultIndex = useSelectedResultIndex();
  const variant = useTestVariant();

  const result = variant.results![selectedResultIndex];
  return (
    <Grid item container flexDirection="column">
      <ResultBasicInfo result={result.result} />
      {result.result.tags && <ResultTags tags={result.result.tags} />}
    </Grid>
  );
}