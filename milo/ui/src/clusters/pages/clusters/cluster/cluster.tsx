// Copyright 2022 The LUCI Authors.
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

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';

import ClusterAnalysisSection from '@/clusters/components/cluster/cluster_analysis_section/cluster_analysis_section';
import { ClusterContextProvider } from '@/clusters/components/cluster/cluster_context';
import ClusterTopPanel from '@/clusters/components/cluster/cluster_top_panel/cluster_top_panel';
import ErrorAlert from '@/clusters/components/error_alert/error_alert';
import FeedbackSnackbar from '@/clusters/components/error_snackbar/feedback_snackbar';
import { SnackbarContextWrapper } from '@/clusters/context/snackbar_context';
import { RecoverableErrorBoundary } from '@/common/components/error_handling';
import { TrackLeafRoutePageView } from '@/generic_libs/components/google_analytics';

export const ClusterPage = () => {
  const { project, algorithm, id } = useParams();

  if (!project || !algorithm || !id) {
    return (
      <ErrorAlert
        errorTitle="Project or Cluster ID is not specified"
        errorText="Project or Cluster ID not specified in the URL, please make sure you have the correct URL and try again."
        showError
      />
    );
  }

  return (
    <ClusterContextProvider
      project={project}
      clusterAlgorithm={algorithm}
      clusterId={id}
    >
      <Container className="mt-1" maxWidth={false}>
        <Grid sx={{ mt: 1 }} container spacing={2}>
          <Grid item xs={12}>
            <ClusterTopPanel />
          </Grid>
          <Grid item xs={12}>
            <ClusterAnalysisSection />
          </Grid>
        </Grid>
      </Container>
    </ClusterContextProvider>
  );
};

export function Component() {
  return (
    <TrackLeafRoutePageView contentGroup="cluster">
      <RecoverableErrorBoundary
        // See the documentation in `<LoginPage />` to learn why we handle error
        // this way.
        key="cluster"
      >
        <SnackbarContextWrapper>
          <ClusterPage />
          <FeedbackSnackbar />
        </SnackbarContextWrapper>
      </RecoverableErrorBoundary>
    </TrackLeafRoutePageView>
  );
}
