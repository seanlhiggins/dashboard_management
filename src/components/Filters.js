import { ComponentsProvider, Popover,Tree,Box, FieldSelect } from '@looker/components';

import React, { useState }  from "react"
import { BrowseTable} from '@looker/icons'

const Filters = () => {
    const [value, setValue] = useState()
    const handleButtonClick = () => {
      setValue({ from: new Date('Feb 1, 2020'), to: new Date('Feb 29, 2020') })
    }
    const handleChange = (dateRange) => {
      setValue(dateRange)
    }
    const options = [
        { value: 'cheddar', label: 'Cheddar' },
        { value: 'gouda', label: 'Gouda' },
        { value: 'swiss', label: 'Swiss' },
      ]
      
    return (
        <Tree label="Filters" icon={<BrowseTable />}>
            <FieldSelect  name="someField"
  label="Some Field"
  options={options}
  alignValidationMessage="right"></FieldSelect>
        </Tree>
        )
}

export default Filters;
