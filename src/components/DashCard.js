import React, { useEffect} from 'react';
import { formatPrice,fancyTimeFormat } from '../helpers'
import Badge from '@material-ui/core/Badge';
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
      Fieldset,
      InputText} from '@looker/components'
import {  Add, MoreVert, Comment } from '@styled-icons/material'
import { LogoRings, 
  Explore, 
  DashboardGauge, 
  UserAttributes} from '@looker/icons'
  
  const AvatarIcon = (props) => {
    return (
        <img display='inline' src={props.src} style={{borderRadius: '50%'}} width='50px' height='50px'/>
    )
}
  const CommentCard = ({comments, index}) => {
    console.log('message',comments)
    return (
      <Box width="30rem" height='5rem'>
        <Card key={comments[index]}
      // style={{float: comments[index].id % 2 == 0 ? 'right' : 'left'}}
            >
          <CardContent>
            <Flex justifyContent='space-between'>
              {comments.avatar && <AvatarIcon src={comments.avatar}/>}
              <FlexItem><Heading display='inline' as='h6'>{comments.author}</Heading></FlexItem>
              <FlexItem><Heading as='h6'>{comments.timestamp}</Heading></FlexItem>
              <FlexItem><Paragraph>
                        {comments.msg}
                        </Paragraph>
                        </FlexItem>
            </Flex>
          </CardContent>
        </Card>
        </Box>
    )
}

const DashCard = ({index, details, addToOrder, runQuery, addComment, me}) => {

    const handleClick = () => {
        addToOrder(index)
    }   

    
    const submitComment = (e) =>{
      e.preventDefault()
      const comment = commentRef.current.value
      let newComment = {
        id: Date.now(),
        author: me.display_name,
        timestamp: new Date().toDateString(),
        msg: comment,
        avatar: me.avatar_url
    }
      addComment(index,newComment)
    }
    const { image, name, runtime, desc, id, status, showRuntime, showExplore, showOwner, owner,  comments} = details;
    const isAvailable = status === 'available';
    let commentsLength = 0
    let commentsParsed =''
    let commentsObj = {};
    if(comments){ 
      commentsLength = Object.keys(comments).length;
      commentsParsed = JSON.stringify(comments)
      commentsObj=comments
    }
   

    const isOpen = true
    const icon = isAvailable ? <LogoRings /> : 'X';
    const hoverRef = React.useRef()
    const commentRef= React.useRef()
    const content = <PopoverContent p="large"><Button onClick={() => (<PopoverContent p="large"><Fieldset legend="Report Problem">
                                                                          <FieldText label="Assignee" />
                                                                          <FieldText label="Overview" />
                                                                          <FieldText label="Description" />
                                                                        </Fieldset></PopoverContent>)}>Report a Problem</Button></PopoverContent>
    const commentPop = <PopoverContent p="large">
                          {Object.keys(commentsObj).map(key => 
                        <CommentCard comments={commentsObj[key]} key={key} index={key}></CommentCard>                    
                        )}                   
                          <Form>  
                            <FieldText label="Comment" ref={commentRef} name="Comment" placeholder="What's your beef?" />
                            <Button onClick={submitComment}>Submit</Button>
                          </Form>
                        </PopoverContent>
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
                              <FlexItem id='add' margin='small'><Tooltip content='Add to list under Boards to enable adding to a personal Looker Board'><IconButton icon={ <Add /> }  label='Add To Board'  size="medium" onClick={handleClick}/></Tooltip><Span fontSize='small' >Add</Span>
                              </FlexItem>    
                                
                              <FlexItem id='comment' margin='small'>
                                  <Tooltip content='Add a comment'>
                                    <Popover content={commentPop}>
                                    <Badge badgeContent={commentsLength} color="primary">
                                        <IconButton icon={ <Comment /> }  label='Add Comment'  size="medium"/>
                                      </Badge>
                                    </Popover>
                                  </Tooltip>
                                <Span fontSize='small' >Comment</Span>
                              </FlexItem>
    
                              {showExplore ? 
                              <FlexItem><FlexItem id='run' margin='small'><Tooltip content='Run Sample Query, output under Board section'><IconButton  icon={<Explore />} size='medium' label="Run Query" onClick={() => runQuery(id)} /></Tooltip><Span fontSize='small' >Run</Span></FlexItem></FlexItem>
                                : <Span></Span>}
                            </Flex>
                            <Flex>
                              <FlexItem id='metacard'>
                                <Card ref={hoverRef} raised>
                                  <Flex justifyContent='flex-end' id='metadata'>
                                    <FlexItem id='runtime' padding='2px'>{showRuntime ? 
                                      <Flex>
                                        <Tooltip content='Average Runtime as calculated by System Activity'><Icon icon={<DashboardGauge/>} label="Average Runtime" color='#959a9d' size='xsmall' />
                                        </Tooltip>
                                        <Span fontSize='xsmall' color='subdued'  padding='3px' textAlign='centre'>{Math.round((runtime) * 10) / 10}s
                                        </Span> 
                                      </Flex>: <Span></Span>}
                                    </FlexItem>
                                    <FlexItem id='owner' padding='3px'>{showOwner ? <Flex><Tooltip content='Owner as specified by CoE Team'><Icon icon={<UserAttributes />} label="Owner" color='#959a9d' size='xsmall' /></Tooltip><Span fontSize='xsmall' color='subdued'  padding='2px' textAlign='centre'>@{owner}</Span> </Flex>: <Span></Span>}</FlexItem>
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