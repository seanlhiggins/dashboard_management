import { ComponentsProvider, Button, SpaceVertical, Heading, Flex, Divider } from '@looker/components';
import React from 'react';
import AddDashForm from './AddDashForm';
import EditDashForm from './EditDashForm';


const Admin = ({dashes,loadSampleDashes,addDash,deleteDash, getFreshMetadata,updateDash}) => {
        return (
            <>
                <Heading fontWeight='bold'>Management</Heading>
                <SpaceVertical>
                {Object.keys(dashes)
                .filter(key => dashes[key]!=null)
                .map(key => (    
                <EditDashForm 
                    getFreshMetadata={getFreshMetadata}
                    key={key}
                    index={key}
                    dashes={dashes[key]}
                    deleteDash={deleteDash}
                    updateDash={updateDash}/>))}
                <AddDashForm 
                    addDash={addDash}/>
                <Button customColor='#4285f4' onClick={loadSampleDashes}>Load Sample Dashes</Button>
                </SpaceVertical>
            </>
        ) 
}

export default Admin;