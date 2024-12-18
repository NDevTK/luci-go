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
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { isGlob, isMember, isSubgroup } from '@/authdb/common/helpers';

import './groups_list.css';

interface GroupsFormListProps {
  // Sets the starting items array. Used on initial GetGroup call from groups_form.
  initialValues: string[];
  // This will be either members, subgroups or globs. Used for header in form and to check validity of added items.
  name: string;
  // Used on UpdateGroup call to backend to update this field's values.
  submitValues: () => void;
}

export interface FormListElement {
  getItems: () => string[];
  changeItems: (items: string[]) => void;
}

type Item = {
  value: string;
  checked: boolean;
};

// Converts string (of item names) array to Item array.
const asItems = (values: string[]) => {
  let items: Item[] = [];
  values.forEach((item) => {
    items.push({
      value: item,
      checked: false,
    });
  })
  return items;
};

const asString = (items: Item[]) => {
  let itemValues: string[] = [];
  items.forEach((item) => {
    itemValues.push(item.value);
  })
  return itemValues;
};

export const GroupsFormList = forwardRef<FormListElement, GroupsFormListProps>(
  (
    { initialValues, name, submitValues }, ref
  ) => {
    const [addingItem, setAddingItem] = useState<boolean>(false);
    const [newItems, setNewItems] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    // The initial form items which reflect the items currently in auth service backend.
    const [savedValues, setSavedValues] = useState<string[]>(initialValues);
    // The current edited item list, including removed & added items.
    const [items, setItems] = useState<Item[]>(asItems(initialValues));
    const [removeDialogVisible, setRemoveDialogVisible] = useState<boolean>();

    const handleRemoveDialogClose = () => {
      setRemoveDialogVisible(false);
    }

    useImperativeHandle(ref, () => ({
      getItems: () => {
        return asString(items);
      },
      changeItems: (newValues: string[]) => {
        if (!valuesEqual(newValues, savedValues)) {
          setItems(asItems(newValues));
          setSavedValues(newValues);
        }
      },
    }))

    const resetTextfield = () => {
      setAddingItem(!addingItem);
      setNewItems("");
      setErrorMessage('');
    };

    const hasValues = (value: string) => {
      for (const item of items) {
        if (item.value == value) {
          return true;
        }
      }
      return false;
    };

    const addToItems = () => {
      // Make sure item added is not a duplicate.
      let newItemsArray = newItems.split(/[\n ]+/).filter((item) => item !== "");
      const duplicateValues = newItemsArray.filter(value => hasValues(value));
      var isValid: (item: string) => boolean;
      switch (name) {
        case 'Members':
          isValid = isMember;
          break;
        case 'Globs':
          isValid = isGlob;
          break;
        case 'Subgroups':
          isValid = isSubgroup;
          break;
        default:
          isValid = () => { return false; };
      }
      const invalidValues = newItemsArray.filter((value) => !isValid(value));
      // Check for errors and update state accordingly.
      if (invalidValues.length > 0 || duplicateValues.length > 0) {
        let allInvalidItems = duplicateValues.concat(invalidValues);
        let errorMessage = `Invalid ${name}: ` + allInvalidItems.join(', ');
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage('');
        let updatedItems = [...items];
        updatedItems.push(...asItems(newItemsArray));
        setItems(updatedItems);
        resetTextfield();
      }
    }

    useEffect(() => {
      // If any items have been added or removed, we submit.
      // This ensure we do not submit values on initial load & on checkbox polarity change.
      if (!valuesEqual(asString(items), savedValues)) {
        submitValues();
      }
    }, [items]);

    const handleChange = (index: number) => {
      const updatedItems = [...items];
      // This is a new item, so just remove.
      if (index >= savedValues.length) {
        updatedItems.splice(index, 1);
      } else {
        updatedItems[index].checked = !updatedItems[index].checked;
      }
      setItems(updatedItems);
    }

    // If there are any checked items. (Used to know if remove button should be visible).
    const hasSelected = () => {
      for (const item of items) {
        if (item.checked) {
          return true;
        }
      }
      return false;
    }

    // Removes checked items from items list.
    const removeItems = () => {
      let updatedItems = [...items];
      for (let i = updatedItems.length - 1; i >= 0; i--) {
        if (updatedItems[i].checked) {
          updatedItems.splice(i, 1);
        }
      }
      setItems(updatedItems);
      setRemoveDialogVisible(false);
    }

    // Converts removed items into string for confirmation dialog.
    const getRemovedMembers = () => {
      let removedItems = [];
      for (const item of items) {
        if (item.checked) {
          removedItems.push(item.value);
        }
      }
      return removedItems.join(', ');
    }

    const valuesEqual = (a: string[], b: string[]) => {
      return(
        a.length === b.length &&
        a.every((val, index) => val === b[index])
      );
    }

    return (
      <TableContainer data-testid='groups-form-list'>
        <Table sx={{ p: 0, pt: '15px', width: '100%' }} data-testid='mouse-enter-table'>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2} sx={{ pb: 0 }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', minHeight: '45px' }}>
                <Typography variant="h6"> {name}</Typography>
                {hasSelected() &&
                  <Button variant="contained" color="error" sx={{ ml: 2 }} startIcon={<RemoveCircleOutlineIcon />} onClick={() => setRemoveDialogVisible(true)} data-testid='remove-button'>Remove</Button>
                }
              </TableCell>
            </TableRow>
            {items && items.map((item, index) =>
              <TableRow key={index} style={{ height: '34px' }} sx={{ borderBottom: '1px solid rgb(224, 224, 224)' }} className='item-row' data-testid={`item-row-${item.value}`}>
                <TableCell sx={{ p: 0, pt: '1px' }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', minHeight: '30px' }}>
                  <Checkbox sx={{ pt: 0, pb: 0 }} checked={item.checked} data-testid={`checkbox-button-${item.value}`} id={`${index}`} onChange={() => { handleChange(index) }} />
                  <Typography variant="body2">{item.value}</Typography>
                </TableCell>
              </TableRow>
            )}
            {addingItem && (
              <>
                <TableRow>
                  <TableCell sx={{ p: 0, pt: '15px', pr: '15px' }} style={{ width: '94%' }}>
                    <TextField multiline placeholder='Add new members, one per line' label='Add new members, one per line' style={{ width: '100%' }} onChange={(e) => setNewItems(e.target.value)} value={newItems} data-testid='add-textfield' error={errorMessage !== ''} helperText={errorMessage}></TextField>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ p: 0 }}>
                    <Button sx={{ mt: '10px', mr: 1.5 }} variant='contained' color='success' onClick={() => { addToItems() }} data-testid='confirm-button'>
                      Confirm
                    </Button>
                    <Button sx={{ mt: '10px' }} variant='contained' color='error' onClick={resetTextfield} data-testid='clear-button'>
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              </>)
            }
            {!addingItem &&
              <TableRow>
                <TableCell>
                  <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={resetTextfield} data-testid='add-button'>
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
        <Dialog
          open={removeDialogVisible || false}
          onClose={handleRemoveDialogClose}
          data-testid="remove-confirm-dialog"
        >
          <DialogTitle>
            {`Are you sure you want to remove the following ${name.toLowerCase()}?`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {getRemovedMembers()}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRemoveDialogClose} disableElevation variant="outlined">Cancel</Button>
            <Button onClick={removeItems} disableElevation variant="contained" color="error" data-testid='remove-confirm-button'>Remove</Button>
          </DialogActions>
        </Dialog>
      </TableContainer>);
  }
);