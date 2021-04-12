import React from 'react';
import { formatPrice,fancyTimeFormat } from '../helpers'
import { Button, 
    ComponentsProvider, 
    IconButton, 
    UnorderedList, 
    Span, 
    ListItem,  
    Divider, 
    Text, 
    Paragraph, 
    Heading, 
    Tooltip,
    Spinner } from '@looker/components'
import { Delete} from '@styled-icons/material'

const Order = ({dashes, orders, createNewBoard, sampleQueries,removeFromOrder, queryRunning, querySelected}) => {
    const renderOrder = (key) => {
        const dash = dashes[key];
        const count = orders[key];
        const isAvailable =  dash && dash.status === 'available';
        console.log(key)
        if(!dash) return null;
        if(!isAvailable) {
            return (
            <ListItem key={key}>
                Sorry {dash ? dash.name : 'dash'} no longer available
            </ListItem>
            )
        }
        return (

        <ListItem key={key}>{count} {dash.name} - {fancyTimeFormat(count * dash.runtime)} 
            <IconButton icon={<Delete />} onClick={() => removeFromOrder(key)} label="Remove from Board" />
            
         </ListItem>
        )
    }   
        const queries =Object.keys(sampleQueries).filter((key)=> key == querySelected);

        const queryToRender = sampleQueries[queries]
        const orderIds = Object.keys(orders);
        const total = orderIds.reduce((prevTotal, key) => {
        const dash = dashes[key];
        const count = orders[key];
        const isAvailable = dash && dash.status === 'available';

            if(isAvailable) {
                return prevTotal + (count * dash.runtime)
            }
            return prevTotal;
        }, 0);

        return (
            <ComponentsProvider globalStyle={false}>
                    
                    <Heading fontWeight='bold'>Board</Heading>
                    <UnorderedList>
                        {orderIds.map(renderOrder)}
                    </UnorderedList>
                    <Tooltip content="This whole section is a WIP. I plan to have the sample queries saved as JSON in a neat box, but to also render
                        the PNG element of the same query. I haven't wired up the Cloud Storage bits for the pngs but the queries at 
                        least save to Firebase and have permanence.
                        I'll also have an area above that allows users to create a new board for themselves from the CoE dashboards for later use.
                        The idea here is that a CoE team specifies the canonical dashboards and users can maintain a content system based on that.">
                        <Button size='small' onClick={createNewBoard}>CREATE NEW BOARD</Button>
                        </Tooltip>
                  
                    <Span>Total Runtime: </Span>
                        <Text>{fancyTimeFormat(total)}</Text>

                        <Divider />

                        <UnorderedList>
                    <Span>Sample Query</Span>
                        <Paragraph>Output of sample query from dashboards.</Paragraph>
                        {queryRunning ? <Spinner /> :<Paragraph>{JSON.stringify(queryToRender)}</Paragraph>} 
                    </UnorderedList>

            </ComponentsProvider>
        ) 
}

export default Order;