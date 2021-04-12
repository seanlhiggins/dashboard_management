import React, { useEffect} from 'react';
import { formatPrice,fancyTimeFormat } from '../helpers'
import { Paragraph, 
      CardMedia,
      PopoverContent,
      Popover, 
      Card,
      CardContent, 
      ComponentsProvider, 
      Heading , 
      IconButton,
      Icon, 
      Span, 
      Divider, 
      List, 
      FlexItem, 
      Flex, 
      Box, 
      SpaceVertical,
      Tooltip,
      Button,
      Form,
      FieldText,
      InputText} from '@looker/components'
import {  Add, MoreVert, Comment } from '@styled-icons/material'
import { LogoRings, 
  Explore, 
  DashboardGauge, 
  UserAttributes} from '@looker/icons'
const DashCard = ({index, details, addToOrder, runQuery}) => {

    const handleClick = () => {
        addToOrder(index)
    }   

    const addComment = () => {
      console.log('commented')
    }
    const submitComment = (e) =>{
      e.preventDefault()
      const comment = commentRef.current.value
      console.log(comment)
    }
    const { image, name, runtime, desc, id, status, showRuntime, showExplore, showOwner, owner } = details;
    const isAvailable = status === 'available';
    const isOpen = true
    const icon = isAvailable ? <LogoRings /> : 'X';
    const hoverRef = React.useRef()
    const commentRef= React.useRef()
    const content = <PopoverContent p="large"><Button>Report a Problem</Button></PopoverContent>
    const commentPop = <PopoverContent p="large"><Form>  <FieldText label="Comment" ref={commentRef} name="Comment" placeholder="What's your beef?" />
    <Button onClick={submitComment}>Submit</Button></Form></PopoverContent>
    return (
        <ComponentsProvider globalStyle={false}>
          <Box padding='4px'>
            <SpaceVertical>
              <Flex justifyContent='space-between' margin='medium' padding='5px'>
                  
                    <Card raised margin='medium'>
                        <CardMedia image={image} title={name} alt={name}/>
                        <CardContent>
                          <Flex>
                            <FlexItem>
                              <Span fontSize='small'>{name}</Span>
                              
                            </FlexItem>
                            
                          </Flex>
                        </CardContent>
                      </Card>
                  <FlexItem>
                    <Flex flexDirection='column' id='headerdescbuttons'>
                      <FlexItem ><Heading marginBottom='0' marginTop='1' fontSize="Large" textAlign='center' fontWeight="bold">{name}</Heading></FlexItem>
                      <FlexItem padding='5px'><Span fontSize='small' >{desc}</Span></FlexItem>
                        <Flex justifyContent="space-evenly" alignItems="flex-end" id='buttons'>
                          <FlexItem>
                            <Flex>
                              <FlexItem id='add' margin='medium'><Tooltip content='Add to list under Boards to enable adding to a personal Looker Board'><IconButton icon={ <Add /> }  label='Add To Board'  size="medium" onClick={handleClick}/></Tooltip><Span fontSize='small' >Add</Span>
                              </FlexItem>    
                                
                                <FlexItem id='comment' margin='medium'><Tooltip content='Add a comment'><Popover content={commentPop}><IconButton icon={ <Comment /> }  label='Add Comment'  size="medium" onClick={addComment}/></Popover></Tooltip><Span fontSize='small' >Comment</Span>
                                </FlexItem>
     
                                {showExplore ? 
                                <FlexItem><FlexItem id='run' margin='medium'><Tooltip content='Run Sample Query, output under Board section'><IconButton  icon={<Explore />} size='medium' label="Run Query" onClick={() => runQuery(id)} /></Tooltip><Span fontSize='small' >Run</Span></FlexItem></FlexItem>
                                  : <Span></Span>}
                                <FlexItem id='metacard'>
                                  <Card ref={hoverRef} raised>
                                    <Paragraph margin='medium' fontSize="xsmall" color="subdued">
                                      Metadata
                                    </Paragraph>
                                    <Flex justifyContent='space-between' id='metadata'>
                                      <FlexItem id='runtime' padding='5px'>{showRuntime ? 
                                        <Flex>
                                          <Tooltip content='Average Runtime as calculated by System Activity'><Icon icon={<DashboardGauge/>} label="Average Runtime" color='#959a9d' size='xsmall' />
                                          </Tooltip>
                                          <Span fontSize='xsmall' color='subdued'  padding='2px' textAlign='centre'>{Math.round((runtime) * 10) / 10}s
                                          </Span> 
                                        </Flex>: <Span></Span>}
                                      </FlexItem>
                                      <FlexItem id='owner' padding='5px'>{showOwner ? <Flex><Tooltip content='Owner as specified by CoE Team'><Icon icon={<UserAttributes />} label="Owner" color='#959a9d' size='xsmall' /></Tooltip><Span fontSize='xsmall' color='subdued'  padding='2px' textAlign='centre'>@{owner}</Span> </Flex>: <Span></Span>}</FlexItem>
                                      <FlexItem id='action'>
                                          <Popover content={content} hoverDisclosureRef={hoverRef}>
                                            <IconButton icon={<MoreVert />} label="Actions" />
                                          </Popover>
                                      </FlexItem>
                                    </Flex>
                                  </Card>
                                </FlexItem>
                            </Flex>
                        </FlexItem>
                    </Flex>
                  </Flex>
                </FlexItem>
              </Flex>
            </SpaceVertical>
          </Box>
        </ComponentsProvider>
      );
      
}

export default DashCard;