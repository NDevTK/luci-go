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

import type { RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
  {
    index: true,
    lazy: () => import('@/app/pages/search/project_search'),
  },
  {
    path: 'login',
    lazy: () => import('@/app/pages/login_page'),
  },
  {
    path: 'search',
    lazy: () => import('@/app/pages/search/search_redirection_loader'),
  },
  {
    path: 'builder-search',
    lazy: () => import('@/app/pages/search/builder_search'),
  },
  {
    path: 'p/:project/test-search',
    lazy: () => import('@/app/pages/search/test_search'),
  },
  {
    path: 'p/:project/builders',
    lazy: () => import('@/app/pages/builders_page'),
  },
  {
    path: 'p/:project/g/:group/builders',
    lazy: () => import('@/app/pages/builders_page'),
  },
  {
    path: 'p/:project/builders/:bucket/:builder',
    lazy: () => import('@/app/pages/builder_page'),
  },
  {
    path: 'b/:buildId/*?',
    lazy: () => import('@/app/pages/build_page/build_page_short_link'),
  },
  {
    path: 'p/:project/builders/:bucket/:builder/:buildNumOrId',
    lazy: () => import('@/app/pages/build_page'),
    children: [
      {
        index: true,
        lazy: () => import('@/app/pages/build_page/build_default_tab'),
      },
      {
        path: 'overview',
        lazy: () => import('@/app/pages/build_page/overview_tab'),
      },
      {
        path: 'test-results',
        lazy: () => import('@/app/pages/test_results_tab'),
      },
      {
        path: 'steps',
        lazy: () => import('@/app/pages/build_page/steps_tab'),
        children: [
          // Some old systems generate links to a step by
          // appending suffix to /steps/ (crbug/1204954).
          // This allows those links to continue to work.
          { path: '*' },
        ],
      },
      {
        path: 'related-builds',
        lazy: () => import('@/app/pages/build_page/related_builds_tab'),
      },
      {
        path: 'timeline',
        lazy: () => import('@/app/pages/build_page/timeline_tab'),
      },
      {
        path: 'blamelist',
        lazy: () => import('@/app/pages/build_page/blamelist_tab'),
      },
    ],
  },
  {
    path: 'inv/:invId',
    lazy: () => import('@/app/pages/invocation_page'),
    children: [
      {
        index: true,
        lazy: () =>
          import('@/app/pages/invocation_page/invocation_default_tab'),
      },
      {
        path: 'test-results',
        lazy: () => import('@/app/pages/test_results_tab'),
      },
      {
        path: 'invocation-details',
        lazy: () =>
          import('@/app/pages/invocation_page/invocation_details_tab'),
      },
    ],
  },
  {
    path: 'artifact',
    lazy: () => import('@/app/pages/artifact/artifact_page_layout'),
    children: [
      {
        path: 'text-diff/invocations/:invId/artifacts/:artifactId',
        lazy: () => import('@/app/pages/artifact/text_diff_artifact_page'),
      },
      {
        path: 'text-diff/invocations/:invId/tests/:testId/results/:resultId/artifacts/:artifactId',
        lazy: () => import('@/app/pages/artifact/text_diff_artifact_page'),
      },
      {
        path: 'image-diff/invocations/:invId/artifacts/:artifactId',
        lazy: () => import('@/app/pages/artifact/image_diff_artifact_page'),
      },
      {
        path: 'image-diff/invocations/:invId/tests/:testId/results/:resultId/artifacts/:artifactId',
        lazy: () => import('@/app/pages/artifact/image_diff_artifact_page'),
      },
      {
        path: 'raw/invocations/:invId/artifacts/:artifactId',
        lazy: () => import('@/app/pages/artifact/raw_artifact_page'),
      },
      {
        path: 'raw/invocations/:invId/tests/:testId/results/:resultId/artifacts/:artifactId',
        lazy: () => import('@/app/pages/artifact/raw_artifact_page'),
      },
    ],
  },
  {
    path: 'test/:projectOrRealm/:testId',
    lazy: () => import('@/app/pages/test_history_page'),
  },
  {
    path: 'bisection',
    lazy: () => import('@/bisection/layouts/base'),
    children: [
      {
        index: true,
        lazy: () => import('@/bisection/pages/failure_analyses'),
      },
      {
        path: 'analysis/b/:bbid',
        lazy: () => import('@/bisection/pages/analysis_details'),
      },
    ],
  },
  {
    path: 'swarming',
    children: [
      {
        path: 'task/:taskId',
        lazy: () => import('@/swarming/views/swarming_build_page'),
      },
    ],
  },
  {
    path: 'doc/changelog',
    lazy: () => import('@/app/pages/changelog_page'),
  },
];