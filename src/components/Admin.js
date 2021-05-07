import { ComponentsProvider, Button, SpaceVertical, Heading, Flex, Divider } from '@looker/components';
import React from 'react';
import AddDashForm from './AddDashForm';
import EditDashForm from './EditDashForm';


const Admin = ({dashes,loadSampleDashes,addDash,deleteDash, getFreshMetadata,updateDash,getSampleDashesFromSA}) => {
        return (
            <>
                <Heading fontWeight='bold'>Admin Console</Heading>
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
                <Button customColor='#4285f4' onClick={getSampleDashesFromSA}>Load New Sample Dashes (top 10)</Button>
                </SpaceVertical>
            </>
        ) 
}

export default Admin;