import React from 'react'
import { formatPrice } from '../helpers';
import { ComponentsProvider, Button, Box, FieldCheckbox, Flex, FlexItem, Select, InputText, Divider, SpaceVertical, TextArea }  from '@looker/components'

const EditDashForm = ({updateDash, deleteDash, index, dashes}) =>{
    const handleChange = (e) => {
        // update that dash
        const updatedDash = {...dashes, [e.currentTarget.name]: e.currentTarget.value};
        updateDash(index,updatedDash)
    }
    const handleCheck = (e) => {
        // update that dash
        const updatedDash = {...dashes, [e.currentTarget.name]: e.currentTarget.checked};
        updateDash(index,updatedDash)
    }
        return ( 
        <ComponentsProvider globalStyle={false}>
            <Box border='1px' padding='4px'>
            <SpaceVertical>
            <Flex margin='medium' flexDirection='column' justifyContent='space-between'>
                <Flex justifyContent='space-between'>
                <InputText
                    name='name' onChange={handleChange} 
                    value={dashes.name} />
                <InputText 
                    name='owner' onChange={handleChange} 
                    value={dashes.owner} />
                <InputText  
                    name='id' onChange={handleChange} 
                    value={dashes.id} />
                <InputText  
                    name='runtime' onChange={handleChange} 
                    value={dashes.runtime} />
                <Select 
                    name='status' onChange={handleChange} 
                    value={dashes.status} 
                        options={[
                            {value:'available', label:'Available'},
                            {value:'unavailable', label:'Deprecated'}]} 
                />
                </Flex>
            <Flex>
                <InputText 
                    name='desc'
                    onChange={handleChange} 
                    value={dashes.desc} />
            </Flex>
            <Flex>
                <InputText 
                    onChange={handleChange} 
                    value={dashes.image} name='image' />
            </Flex>
            <Flex justifyContent='space-evenly'>
                <FlexItem><Button size='small' onClick={()=>{deleteDash(index)}}>Remove Dashboard</Button></FlexItem>
                <FlexItem> <FieldCheckbox id="showRuntime"
                                    onChange={handleCheck}
                                    name='showRuntime'
                                    label="Show Runtime"
                                    value={dashes.showRuntime}/></FlexItem>
                <FlexItem> <FieldCheckbox id="showExplore"
                                    name='showExplore'
                                    onChange={handleCheck}
                                    checked={dashes.showExplore}
                                    defaultChecked={false}
                                    label="Allow Sample Query"/></FlexItem>
                <FlexItem> <FieldCheckbox id="showOwner"
                                    name='showOwner'
                                    onChange={handleCheck}
                                    defaultChecked={false}
                                    checked={dashes.showOwner}
                                    label="Owner"/></FlexItem>
            </Flex>
        </Flex>
        <Divider size="3px" customColor='#4285f4'/>
        </SpaceVertical>

        </Box>
        </ComponentsProvider>

        )
}

export default EditDashForm;