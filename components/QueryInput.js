import React from 'react';
import { FormControl, InputLabel, Select, MenuItem,
          ListItemText, OutlinedInput} from '@mui/material';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        maxWidth: 380,
        maxHeight: 200
      },
    },
  };

const QueryInput = (props) => {
    const {queryName, options, field} = props;

    return (
        <FormControl sx={{ m: 1, width: 250, marginTop: 2}} size="small">
            <InputLabel id="demo-multiple-checkbox-label">{queryName}</InputLabel>
            <Select
                value={field && field.value}
                onChange={(e) => field.onChange(e)}
                input={<OutlinedInput label={queryName} />}
                MenuProps={MenuProps}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        <ListItemText primary={option.label} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl> 
    )
}

export default QueryInput;