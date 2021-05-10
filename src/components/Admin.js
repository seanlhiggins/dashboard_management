import { ComponentsProvider, Button, SpaceVertical, Heading, Badge, Flex, Divider } from '@looker/components';
import React from 'react';
import AddDashForm from './AddDashForm';
import EditDashForm from './EditDashForm';


const Admin = ({dashes,addDash,deleteDash, getFreshMetadata,updateDash,getSampleDashesFromSA}) => {
        return (
            <>
                <Heading fontWeight='bold'>Admin Console <Badge intent="critical" size='small'>Admin Users Only</Badge></Heading>
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
                <Button customColor='#4285f4' color='critical' onClick={getSampleDashesFromSA}>Load New Sample Dashes (top 10). Warning! This will clear all metadata and comments from the dashboards list. You probably don't want to do this as this button is mostly here for demos. Tom. Don't press this. Please.</Button>
                </SpaceVertical>
            </>
        ) 
}

export default Admin;