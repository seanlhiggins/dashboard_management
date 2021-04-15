import React, { useContext, useState, useEffect } from 'react';
import Header from './Header'
import Inventory from './Inventory'
import Order from './Order'
import sampledashes from '../sample-dashes'
import DashCard from './DashCard';
import DashboardDisplay from './DashboardDisplay'
import base from '../base';
import firebase from 'firebase'
import { Card, Grid,
    ComponentsProvider, 
    Icon,
    CardContent,
    Heading, 
    Text, 
    List, 
    Flex, 
    FlexItem, 
    Divider, 
    Box, Panel, Panels, ListItem, GridPlaceholder,
    DividerVertical } from '@looker/components'
    import {  ArrowLeft, ArrowRight, ArrowBack, ArrowForward} from '@styled-icons/material'
    import { LogoRings, 
      Explore, 
      DashboardGauge, 
      UserAttributes} from '@looker/icons'
import { 
    ExtensionContext, 
     } from '@looker/extension-sdk-react';

const App = () => {
    const context = useContext(ExtensionContext)
    const sdk = context.core40SDK
    const localStorageSet = async () => {
        try {
          await context.extensionSDK.localStorageSetItem('data', 'blah')
        } catch (error) {
          console.error(error)
        }
      }
    const localStorageGet = async () => {
    try {
        await context.extensionSDK.localStorageGetItem('data', 'blah')
        
    } catch (error) {
        console.error(error)
    }
    }
    useEffect(() => {
        localStorageSet()
    })
    const [dashes, setDashes] = useState({})
    const [orders, setOrder] = useState({})
    const [runtimeChecked, setRuntimeChecked] = useState(true)
    const [sampleQueries, setQueries] = useState({'101':''})
    const [queryRunning, setQueryRunning] = useState(false)
    const [querySelected, setQuerySelected] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [me, setMe] = useState(undefined)

  
    // const title = (
    //   <>
    //     <Icon icon={<ArrowLeft />} m="xsmall" />
    //     Dashboards
    //   </>
    // )
        
    // set the current user so we can look at their ID, avatar etc for comments
    useEffect (() => {
        async function getUser()  {
            await sdk.ok(
                    sdk.me())
                    .then((r) => {
                        console.log(r)
                        setMe(r)
                    })
                }
        
        getUser()
    },[])
              // have to eventually figure out how to sync the state with Firebase. Placeholder from standalone app:
    useEffect(() => {
        firebase.database().ref(`profservices/dashes`).on('value', snapshot => {
            if (snapshot.val()) setDashes(snapshot.val())
        })
    }, []);

    useEffect(() => {
        firebase.database().ref(`profservices/dashes`).update(dashes)
     }, [dashes])

     useEffect(() => {
        firebase.database().ref(`profservices/queries`).on('value', snapshot => {
            if (snapshot.val()) setQueries(snapshot.val())
        })
    }, []);

    useEffect(() => {
        firebase.database().ref(`profservices/queries`).update(sampleQueries)
     }, [sampleQueries])

    // useEffect(()=> {
    //     //using the ID of each dashboard card, run an async query to Looker's System Activity to get some stats
    //     const dashboards = {...dashes}
    //     console.log(dashboards)
    //     var dashesWithRunTimeReturn={};
    //     Object.keys(dashboards).map(key => {
    //     dashesWithRunTimeReturn = getDashboardSAData(dashboards,key)
    //     })
    //     console.log(dashesWithRunTimeReturn)
    //     // IMPORTANT: never setDashes without a dependency array, or each time you re-render, it'll cause an infinite loop.    
    //     setDashes(dashesWithRunTimeReturn)
    // },[])  

    
    async function getDashboardSAData(dashboard) {
        // for each dashboard in state, get some basic stats about it to show the user
        const dashboardId = dashboard['id']
        // make a shallow copy of state
        const dashWithRuntime = {...dashboard}
        //get stats about each dashboard ID
        const req = 
            {"model": "system__activity",
            "view": "dashboard_performance",
            "filters": {"dashboard.id": `${dashboardId}`},
            "fields": ["dashboard.id","dashboard.user_id","dashboard.title","dashboard.description","dashboard.space_id","dashboard_history_stats.avg_runtime"]}

        const response =  await sdk.ok(sdk.run_inline_query({result_format:'json', body:req}))
        const dashRuntime = response[0]['dashboard_history_stats.avg_runtime']
        dashWithRuntime['runtime'] = dashRuntime
        return dashWithRuntime
    }
    
    async function getDashboard(dashboardId) {
        const response = await sdk.ok(sdk.dashboard(dashboardId))
        return response['dashboard_elements'][5]['query']['id']
    }
    const addDash = (dash) => {
        const dashestoadd = {...dashes}
        const dashReference = `dash${Date.now()}`
        dashestoadd[dashReference] = dash;
        getDashboardSAData(dash)
        .then((res) => { dashestoadd[dashReference] = res})

        setDashes(
            dashestoadd
        )

    }
    
    const getFreshMetadata = (index,dashboardid) => {
        //just creating a dummy object because I lazily made the function to accept an object and not an ID
        const dash = {'id':dashboardid}
        getDashboardSAData(dash)
        .then((res) => {
            console.log('139',res)
            const dashestoadd = {...dashes}
            dashestoadd[index].runtime = res.runtime
            console.log('142',dashestoadd)
            setDashes(dashestoadd)
        })
    }
    async function getUser()  {
    const response =  await sdk.ok(sdk.me('display_name, id'))
    return response
}
    const addComment = (index,comment) => {
        var commentDashes = {...dashes}
        getUser().then((userId) => {
            // get the current user ID and whatever comment they make, timestamp it and add it to a new comments object in state
            const display_name = userId['display_name']
            commentDashes[index].comments[`${display_name} - ${Date.now()}`] = comment
            setDashes(commentDashes)
        })
        
      }
    const updateDash = (key, updatedDash) => {
        // create shallow copy of dash state object, use to set new state
        const dash = {...dashes}
        dash[key] = updatedDash;
        setDashes( dash )
    }


    const loadSampleDashes = () => {
        Object.keys(sampledashes).map(dash=>{
            getDashboardSAData(sampledashes[dash])
            .then((res) => {sampledashes[dash] = res})
        })
        setDashes(sampledashes)
    }

    const deleteDash = (key) => {
        const updatedDashes = { ...dashes, [key]: null }
        setDashes(updatedDashes);
    }

    const addToOrder = (key) => {
        const order = {...orders}
        order[key] = order[key] +1 || 1;
        setOrder(order)
    }

    const removeFromOrder = (key) => {
        const order ={ ...orders}
        order[key] = null
        setOrder(order)
    }

    const createNewBoard = () => {
        // TODO: take the dashboard IDs in the order object and create a board for the user
        console.log('New Board Created')
    }
   
    async function runLookerQuery(queryId) {
        const req = {'query_id':queryId, 'result_format':'json'}
        const response = await sdk.ok(sdk.run_query(req))

        return response
    }

    const runQuery = (id) => {
        //DONE: get a sample query from the given dashboard ID and display the results of the vis in the middle console
        setQuerySelected('')
        console.log('Running Query',id)
        
            //tell Extension that a query is now running
        setQueryRunning(true)
        const dashboardQueryId = getDashboard(id)
        .then((dashboardQueryId)=>{ 

            //tell Extension which query is being run so downstream components can match against state and only render one piece
            setQuerySelected(dashboardQueryId)
            const queriesRef ={...sampleQueries}
            const queriesAvailable = Object.keys(queriesRef)
                         .filter((key) => key == dashboardQueryId)
            
                    // if the key of the object in Firebase matches the query ID we retrieved earlier, then just display that,otherwise run a new query. Caching?!
                    if(queriesAvailable[0] == dashboardQueryId){
                        console.log('already have this query',queriesRef)
                        setQueryRunning(false)

                    } else {
                        runLookerQuery(dashboardQueryId)
                        .then((res) => { 
                            setQueryRunning(false)
                            console.log('Running Fresh Query')
                            console.log('result of query',res)
                            
                            const queriesRef = {...sampleQueries}
                            queriesRef[dashboardQueryId] = JSON.stringify(res)
                            console.log('queriesRef 189', queriesRef)
                            setQueries(queriesRef)
                            return
                        })
                    }   
                })
    }

    return (

        <ComponentsProvider globalStyle={false}>

                <Heading>Centre of Excellence</Heading>
                <Divider/>
                    <Flex justifyContent='space-evenly'>

                        <Panels>
                                <Panel defaultOpen={true} content={
                                    <Box margin='medium' bg="keyAccent"
                                    border="2px solid black"
                                    borderRadius="4px" backgroundColor='white'>
                                        <Flex flexDirection="column">
                                        {Object.keys(dashes)
                                        .filter(key =>  dashes[key]!=null) //everytime we Remove, we set state to null, so rerender only those that are not null
                                        .map(key =>
                                            <FlexItem key={key}>
                                                <Flex>
                                                    <DashCard
                                                    key={key} // each element in a list or anything that's a child must have it's own unique key identifier so React knows what to re-render efficiently
                                                    index={key} // you can't use the key as a prop downstream, so if you need that ...key... you need to assign it to some other prop name
                                                    details={dashes[key]}
                                                    addToOrder={addToOrder}
                                                    runQuery={runQuery}
                                                    addComment={addComment}
                                                    me={me}
                                                    />
                                                </Flex>
                                                <Divider/>
                                            </FlexItem>
                                        )}
                                        </Flex>
                                    </Box>
                                    } direction="left" title="Dashboards">
                                    <ListItem icon={<ArrowForward />} >Dashboards</ListItem>
                                    <DividerVertical stretch/>
                                </Panel>
                    </Panels>

                    <Panels>
                        <Panel content={
                            <Box padding='10px'   bg="keyAccent"
                            border="2px solid black"
                            borderRadius="4px" backgroundColor='white'>
                                <Order 
                                dashes={dashes}
                                orders={orders}
                                createNewBoard={createNewBoard}
                                removeFromOrder={removeFromOrder}
                                sampleQueries={sampleQueries}
                                queryRunning={queryRunning}
                                querySelected={querySelected}
                                />
                            
                            </Box>
                        } direction="left" title="Boards">
                            <ListItem icon={<ArrowForward />} >Boards</ListItem>
                        </Panel>
                    </Panels>
                    

                    <Panels >
                        <Panel content={
                            <Box padding='10px'   bg="keyAccent"
                            border="2px solid black"
                            borderRadius="4px" backgroundColor='white'>
                                <Inventory 
                                    getFreshMetadata={getFreshMetadata}
                                    addDash={addDash} 
                                    updateDash={updateDash} 
                                    loadSampleDashes={loadSampleDashes} 
                                    deleteDash={deleteDash}
                                    dashes={dashes}
                                    setRuntimeChecked={setRuntimeChecked}
                                    />
                            </Box>
                            } direction="left" title="Management">
                            <ListItem icon={<ArrowForward />}>Management</ListItem>
                        </Panel>
                    </Panels>
                    <DividerVertical stretch/>
                </Flex>

                <Box height='100%' width='100%' >
                    <DashboardDisplay
                        dashboard={'67'}
                        setIsLoading={setIsLoading}
                    />
                </Box>
            </ComponentsProvider>
    )
}

export default App;