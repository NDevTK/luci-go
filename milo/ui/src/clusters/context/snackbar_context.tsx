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

import { AlertColor } from '@mui/material/Alert';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

export interface Snack {
  open?: boolean;
  message?: string;
  severity?: AlertColor;
}

export interface SnackbarContextData {
  snack: Snack;
  setSnack: Dispatch<SetStateAction<Snack>>;
}

export const snackContextDefaultState: Snack = {
  open: false,
  message: '',
  severity: 'success',
};

export const SnackbarContext = createContext<SnackbarContextData>({
  snack: snackContextDefaultState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSnack: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const SnackbarContextWrapper = ({ children }: Props) => {
  const [snack, setSnack] = useState<Snack>(snackContextDefaultState);
  return (
    <SnackbarContext.Provider value={{ snack, setSnack }}>
      {children}
    </SnackbarContext.Provider>
  );
};
