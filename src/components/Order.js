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
    Badge,
    DataTable,
    DataTableAction,
    DataTableItem,
    DataTableCell,
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
        let queryJSON = []
        if(queryToRender){
            queryJSON = JSON.parse(queryToRender)
        }
        console.log(queryJSON[0])
        // brute force approach to get each key value:
        // for(let i=0;i<queryJSON.length;i++){
        //     let testKey = Object.keys(queryJSON[0])
        //     testKey.forEach((k) =>{
        //         console.log(queryJSON[i][k])
        //     })
        // }
        const items = queryJSON.map((line) => {
            let testKey = Object.keys(queryJSON[0])
            let actions = (
              <>
                <DataTableAction onClick={() => alert(`${line['difference_in_calls']} selected!`)}>
                  Copy Row
                </DataTableAction>
              </>
            )
        
            return (
              <DataTableItem
                key={line[testKey[0]]}
                id={line[testKey[0]]}
                onClick={() => alert('Row clicked')}
                actions={actions}
              >
                <DataTableCell>{line[testKey[0]]}</DataTableCell>
                <DataTableCell>{line[testKey[1]]}</DataTableCell>
              </DataTableItem>
            )
          })
        const columns = [
            {
              id: 'id',
              title: 'ID',
              type: 'number',   
            },
            {
              id: 'name',
              title: 'Name',
              type: 'string',
            },
          ]
        
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
                    <Span fontWeight='semibold'>Query output</Span>
                        {queryRunning ? <Spinner /> :  <Badge intent="positive">Complete</Badge>} 
                        <DataTable columns={columns}>
                            {items}
                        </DataTable>
                    </UnorderedList>

            </ComponentsProvider>
        ) 
}

export default Order;