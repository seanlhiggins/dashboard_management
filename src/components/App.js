import React, { useContext, useState, useEffect } from 'react';
import Header from './Header'
import Admin from './Admin'
import Order from './Order'
import sampledashes from '../sample-dashes'
import DashCard from './DashCard';
import DashboardDisplay from './DashboardDisplay'
import Filters from './Filters'
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
    Tooltip,  Tree,
    Divider, 
    usePanel, FieldToggleSwitch,InputColor,FieldDateRange,
    Box, Panel, Panels, ListItem,
    ToggleSwitch,Label, 
    DividerVertical } from '@looker/components'

import {  ArrowLeft, ArrowRight, ArrowBack, ArrowForward} from '@styled-icons/material'
import { InfoCircle } from '@styled-icons/bootstrap'
import { LogoRings, 
    Explore, 
    DashboardGauge, 
    UserAttributes,
    Beaker,
    BrowseTable,
    More, TableChart,
    Public} from '@looker/icons'
import { 
    ExtensionContext, 
     } from '@looker/extension-sdk-react';

const App = () => {
    const context = useContext(ExtensionContext)
    const sdk = context.core40SDK

    const [dashes, setDashes] = useState({})
    const [orders, setOrder] = useState({})
    const [sampleQueries, setQueries] = useState({'101':''})
    const [queryRunning, setQueryRunning] = useState(false)
    const [querySelected, setQuerySelected] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [me, setMe] = useState(undefined)
    const [isAdmin, setIsAdmin] = useState(true)
    const [embedDashboard, setEmbedDashboard] = useState('451')
    const [isOpen, setOpen] = useState(true)
    const [on, setOn] = useState(false)
    const handleChange = (event) => setOn(event.target.checked)
        
    // set the current user so we can look at their ID, avatar etc for comments
    useEffect (() => {
        async function getUser()  {
            await sdk.ok(
                    sdk.me())
                    .then((r) => {
                        setMe(r)
                        let isUserAdmin = r.role_ids[0]==2
                        setIsAdmin(isUserAdmin)
                    })
                }
        
        getUser()
    },[])
    
    // sync the dashboards and query states with Firebase. Placeholder from standalone app:
    useEffect(() => {
        firebase.database().ref(`profservices/dashes`). on('value', snapshot => {
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


    useEffect(()=> {
        //using the ID of each dashboard card, run an async query to Looker's System Activity to get some stats
        const dashboards = {...dashes}
        var dashesWithRunTimeReturn={};
        Object.keys(dashboards).map(key => {
        dashesWithRunTimeReturn = getDashboardSAData(dashboards,key)
        })
        // IMPORTANT: never setDashes without a dependency array, or each time you re-render, it'll cause an infinite loop.    
        setDashes(dashesWithRunTimeReturn)
    },[])  

    
    async function getDashboardSAData(dashboard) {
        // for each dashboard in state, get some basic stats about it to show the user
        const dashboardId = dashboard['id']
        // make a shallow copy of state
        const dashWithRuntime = {...dashboard}
        //get stats about each dashboard ID
        const req = 
            {"model": "system_activity",
            "view": "dashboard_performance",
            "filters": {"dashboard.id": `${dashboardId}`},
            "fields": ["dashboard.id","dashboard.user_id","dashboard.title","dashboard.description","dashboard.space_id","dashboard_history_stats.avg_runtime"]}

        const response =  await sdk.ok(sdk.run_inline_query({result_format:'json', body:req}))
        const dashRuntime = response[0]['dashboard_history_stats.avg_runtime']
        dashWithRuntime['runtime'] = dashRuntime

        return dashWithRuntime
    }
    async function getDashboardRunCount(dashboard) {
        // for each dashboard in state, get some basic stats about it to show the user
        const dashboardId = dashboard['id']
        // make a shallow copy of state
        const dashwithdashUsage = {...dashboard}
        //get stats about each dashboard ID

        const req = 
            {"model": "system_activity",
            "view": "history",
            "filters": {
                "history.real_dash_id": `"${dashboardId}"`,
                "history.completed_week": "4 weeks"
              },
            "dynamic_fields": "[{\"_kind_hint\":\"measure\",\"table_calculation\":\"usage_last_week\",\"_type_hint\":\"number\",\"category\":\"table_calculation\",\"expression\":\"${history.count}/offset(${history.count},1)-1\",\"label\":\"Usage Last Week\",\"value_format\":null,\"value_format_name\":null}]",
            "fields": [
                "history.completed_week",
                "history.count"
              ],
              "limit":"10"
            }
        const response =  await sdk.ok(sdk.run_inline_query({result_format:'json', body:req}))

        const dashUsage = response[0]['usage_last_week']
        dashwithdashUsage['usageLastWeek'] = dashUsage
        return dashwithdashUsage
    }
    
    async function getDashboard(dashboardId) {
        const response = await sdk.ok(sdk.dashboard(dashboardId))
        // find the first query_id on the dashboard so we're not trying to run a query for a text tile
        let queryId = 0;
        for( let i=0;i<response.dashboard_elements.length;i++){
            if(response.dashboard_elements[i].query_id!=null){
                    queryId = response.dashboard_elements[i].query_id
                    console.log(queryId)
                    break;
            } else {
        console.log('No query found')
            }
        }
        return queryId
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

            const dashestoadd = {...dashes}
            dashestoadd[index].runtime = res.runtime
            setDashes(dashestoadd)
        })
        getDashboardRunCount(dash).then((res) => {
            const dashestoadd = {...dashes}
            dashestoadd[index].usage = res.usageLastWeek
            setDashes(dashestoadd)

        })
    }
    async function getUser()  {
    const response =  await sdk.ok(sdk.me('display_name, id'))
    return response
}
    const addComment = (index,comment) => {
        var commentDashes = {...dashes}
        if(!commentDashes[index].comments){
            commentDashes[index].comments={}
        }
        getUser().then((userId) => {
            // get the current user ID and whatever comment they make, timestamp it and add it to a new comments object in state
            const display_name = userId['display_name']
            const commentsReference = `${Date.now()} - ${display_name}`
            commentDashes[index].comments[commentsReference] = comment
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

    const deleteComment = (key, dashkey) => {
        const dashboards = {...dashes}
        delete dashboards[dashkey]['comments'][key] 
        setDashes(dashboards)
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

                            const queriesRef = {...sampleQueries}
                            queriesRef[dashboardQueryId] = JSON.stringify(res)
                            setQueries(queriesRef)
                            return
                        })
                    }   
                })
    }

    const updateEmbedDashboard = (dashboardId) => {
        const embedDashboardUpdate = dashboardId
        setEmbedDashboard(embedDashboardUpdate)
    }

    async function getSampleDashes() {
        const req = 
            {"model": "system_activity",
            "view": "history",
            "filters": {
                "history.completed_week": "4 weeks",
                "history.real_dash_id":"-NULL"
              },
            "fields": [
                "history.real_dash_id",
                "dashboard.title",
                "dashboard.description",
                "history.count"
              ],
              "limit":"10"
            }
        const response =  await sdk.ok(sdk.run_inline_query({result_format:'json', body:req}))
        return response

    }
    // helper function to rename object keys as Looker returns awfully named keys in query responses
    const clone = (obj) => Object.assign({}, obj);
    const renameKey = (object, key, newKey) => {
        const clonedObj = clone(object);
        const targetKey = clonedObj[key];
        delete clonedObj[key];
        clonedObj[newKey] = targetKey;
        return clonedObj;      
      };
      
    const getSampleDashesFromSA = () => {
        getSampleDashes().then((r) => {
            let sampleDashes = {}

            // Looker gives unreadable keys as part of the data object so just remapping them. There's probably a cleaner way but 
            // it's not a big deal
            for(let i = 0;i<r.length;i++){
                let id =  r[i]["history.real_dash_id"]
                const dash = {'id':id}
                sampleDashes[`dash${i}`] = r[i]

                getDashboardSAData(dash).then((res) => {
                    console.log(res)
                    sampleDashes[`dash${i}`]["runtime"]=res["runtime"]
                })
                getDashboardRunCount(dash).then((res) => {
                    console.log(res)
                    sampleDashes[`dash${i}`]["usage"]=res["usageLastWeek"]
                })
                delete  sampleDashes[`dash${i}`]["history.count"]

                sampleDashes[`dash${i}`] = renameKey(sampleDashes[`dash${i}`],"dashboard.title","name")
                sampleDashes[`dash${i}`] = renameKey(sampleDashes[`dash${i}`],"dashboard.description","desc")
                
                if(sampleDashes[`dash${i}`]["desc"] ==null){
                    sampleDashes[`dash${i}`]["desc"]='' 
                }

                sampleDashes[`dash${i}`] = renameKey(sampleDashes[`dash${i}`],"history.real_dash_id","id")
                sampleDashes[`dash${i}`]["showRuntime"] = true
                sampleDashes[`dash${i}`]["showExplore"] = true
                sampleDashes[`dash${i}`]["showOwner"] = true
                sampleDashes[`dash${i}`]["status"] = "available"
                sampleDashes[`dash${i}`]["image"] = `https://demoexpo.looker.com/api/internal/core/3.1/content_thumbnail/dashboard/${id}`
                
            }
            setDashes(sampleDashes)
        })
    }
    const user = {...me}
    const currentUserIsAdmin = user['role_ids']==2
    const open = () => {
        setOpen(true)
    }
    const canClose = () => true

    let opacity = 1
    isOpen ? opacity = 0.3 : opacity = 1;
    const panelContent = <Box id='Dashboards'  bg="keyAccent" zIndex='1'
    border="2px solid black" position='relative'
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
                    updateEmbedDashboard={updateEmbedDashboard}
                    deleteComment={deleteComment}
                    />
                </Flex>
                <Divider/>
            </FlexItem>
        )}
        </Flex>
    </Box>
    const { panel } = usePanel({
        canClose,
        direction: 'left',
        isOpen,
        content: panelContent,
        setOpen,
        title: 'Dashboards',
      })

    return (

        <ComponentsProvider >

                <Flex backgroundColor='#222222' justifyContent='space-between'>
                    <FlexItem backgroundColor='#222222'>
                        <Flex>
                        <Heading margin='3px' color='#DDDDDD'>Centre of Excellence</Heading>
                        <Tooltip content="This Extension should be used as an entry point for end users. 
                        On the left, there is a panel showing a predetermined list of dashboards the user can open in the iframe. 
                        Admins can configure what dashboards show and what metadata is shown to the user by way of the Admin tab.
                        Users may add comments, report bugs to assigned owners, run sample queries from the dashboards without opening and also add them directly to their own personal board (tbc).

                        ">
                            <Icon color='#DDDDDD' icon={<InfoCircle />} size="xxsmall" />
                        </Tooltip>
                        </Flex>
                    </FlexItem> 
                    <FlexItem>
                        <Flex justifyContent='end'>
                            <FlexItem>
                                <Filters/>
                            </FlexItem>
                            <FlexItem >
                                <Flex>
                                    <FieldToggleSwitch  size='10px' onChange={handleChange} on={on} id="switch" />
                                    <Label color='inform'>Retain Filters</Label>
                                </Flex>
                            </FlexItem>
                            <FlexItem margin='5px'>
                                <Tooltip content="These don't do anything. Go Away.">
                                    <Icon icon={<Beaker />} color="inform" size="small" />
                                </Tooltip>
                            </FlexItem>
                            <FlexItem margin='5px'>
                                <Tooltip content="Look, pal. I dunno what you were expecting...">
                                    <Icon icon={<LogoRings />} color="inform" size="small" />
                                </Tooltip>
                            </FlexItem>
                            <FlexItem margin='5px'>
                                <Tooltip content="These just look cool. Maybe another time.">
                                    <Icon icon={<BrowseTable />} color="inform" size="small" />
                                </Tooltip>
                            </FlexItem>
                            <FlexItem margin='5px'>
                                <Tooltip content="Your princess is in another castle.">
                                    <Icon icon={<Public />} color="inform" size="small" />
                                </Tooltip>
                            </FlexItem>
                        </Flex>
                    </FlexItem>
                </Flex>

                <Divider/>
                    <Flex >
                        <Panels >
                            {panel}
                            <ListItem  id='dashboardopener' onClick={open} icon={<ArrowForward />} >Dashboard List</ListItem>
                        </Panels>

                        <Panels>
                            <Panel content={
                                <Box id='Metadata' padding='10px'   bg="keyAccent" zIndex='1'
                                border="2px solid black"  position='relative'
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
                            } direction="left" title="Metadata">
                                <ListItem icon={<ArrowForward />} onClick={open}>Metadata</ListItem>
                            </Panel>
                        </Panels>
                    
                        <Panels hidden={!isAdmin}>
                            <Panel content={
                                <Box id='Mgmt' padding='10px'   bg="keyAccent"  zIndex='1'
                                border="2px solid black"  position='relative'
                                borderRadius="4px" backgroundColor='white'>
                                    <Admin 
                                        getFreshMetadata={getFreshMetadata}
                                        addDash={addDash} 
                                        updateDash={updateDash} 
                                        loadSampleDashes={loadSampleDashes} 
                                        deleteDash={deleteDash}
                                        dashes={dashes}
                                        getSampleDashesFromSA={getSampleDashesFromSA}
                                        />
                                </Box>
                                } direction="left" title="Admin">
                                <ListItem onClick={open} icon={<ArrowForward />}>Admin</ListItem>
                            </Panel>
                        </Panels>
                    <DividerVertical stretch/>
                </Flex>

                <Box id='Iframe' padding='5px' opacity={opacity}  height='100%' width='100%' >
                    <DashboardDisplay
                        dashboard={embedDashboard}
                        setIsLoading={setIsLoading}
                    />
                </Box>
            </ComponentsProvider>
    )
}

export default App;