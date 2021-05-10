import React, { useEffect, useState} from 'react';
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
      Prompt,
      Flex, 
      Box, 
      SpaceVertical,
      Tooltip,
      Button,
      Form,
      FieldText,
      Fieldset,
      InputText} from '@looker/components'
import {  Add, MoreVert, Comment, Delete } from '@styled-icons/material'
import { LogoRings, 
  Explore, 
  DashboardGauge, 
  UserAttributes, 
  CalendarHour,
  Notes,
  SalesAnalytics} from '@looker/icons'
  
  const AvatarIcon = (props) => {
    return (
        <img display='inline' src={props.src} style={{borderRadius: '50%'}} width='50px' height='50px'/>
    )
}
  const CommentCard = ({comments, deleteComment, index, dashkey}) => {


    return (
      <Box width="30rem" height='6rem'>
        <Card key={comments[index]}>
          <CardContent>
                  <Flex >
                    <FlexItem>{comments.avatar && <AvatarIcon size='xsmall' margin='medium' src={comments.avatar}/>}</FlexItem>
                    <FlexItem>
                      <Flex flexDirection='column' margin='m'>
                        <FlexItem>
                          <Flex>
                            <Icon color="subdued" size='xxsmall' icon={<UserAttributes />}/><Span color="subdued" fontSize='xxsmall'>{comments.author}</Span>
                            <Icon color="subdued" size='xxsmall' icon={<CalendarHour />}/>  <Span color="subdued" fontSize='xxsmall'>{comments.timestamp}</Span>
                          </Flex>
                        </FlexItem>
                          <FlexItem><Flex><Icon size='xxsmall' icon={<Notes />}/>
                              <Span truncate fontSize='small'>
                              {comments.msg}
                              </Span>
                          </Flex>
                          </FlexItem>
                      </Flex>
                    </FlexItem>
                    <FlexItem>
                      <IconButton color='subdued' size='xxsmall' onClick={() => deleteComment(index, dashkey)} label="Delete Comment" icon={<Delete />}></IconButton>
                    </FlexItem>
                  </Flex>
          </CardContent>
        </Card>
        </Box>
    )
}

const DashCard = ({index, details, addToOrder, runQuery, addComment, me, updateEmbedDashboard, deleteComment}) => {
    const [commentForm, setCommentForm] = useState('')
    
    const handleFormChange = (e) => {
      setCommentForm(e.target.value)
    }
    const handleClick = () => {
        addToOrder(index)
    }   

    const handleUpdateEmbed = (id) => {
      console.log('updating68',id)
      updateEmbedDashboard(id)
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
      setCommentForm('')
    }
    const { image, name, runtime, usage, desc, id, status, showRuntime, showExplore, showOwner, owner,  comments} = details;
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
    const content = <Prompt
                                                  title={'Report a Problem'}
                                                  inputLabel={'Description'}
                                                  onCancel={(close) => {
                                                    alert('Problem reported')
                                                    close()
                                                  }}
                                                  onSave={(value, close) => {
                                                    alert(`You chose ${value}`)
                                                    close()
                                                  }}
                                                >
                                                  {(open) => <Button onClick={open}>Report Problem</Button>}
                                                </Prompt>
    const commentPop = <PopoverContent p="large">
                          {Object.keys(commentsObj).map(key => 
                        <CommentCard deleteComment={deleteComment} dashkey={index} comments={commentsObj[key]} key={key} index={key}></CommentCard>                    
                        )}                   
                          <Form>  
                            <FieldText label="Comment" value={commentForm} onChange={handleFormChange} ref={commentRef} name="Comment" placeholder="What's your beef?" />
                            <Button onClick={submitComment}>Submit</Button>
                          </Form>
                        </PopoverContent>
    return (
        <>
          <Box margin='4px'>
            <SpaceVertical>
              <Flex justifyContent='space-between'  padding='5px'>
                    <Card ref={hoverRef} raised margin='6px' onClick={() =>handleUpdateEmbed(id)}>
                        <CardMedia image={image} title={name} alt={name}/>
                        <CardContent >
                          <Flex>
                            <FlexItem>
                              <Span fontSize='small'>{name}</Span>
                              <Popover content={content} hoverDisclosureRef={hoverRef}>
                                  <IconButton icon={<MoreVert />} label="Actions" />
                                </Popover>
                            </FlexItem>
                          </Flex>
                        </CardContent>
                      </Card>
                  <FlexItem width='100%'>
                    <Flex flexDirection='column' id='headerdescbuttons'>
                      <FlexItem ><Heading marginBottom='0' marginTop='1' fontSize="Large" textAlign='center' fontWeight="bold">{name}</Heading></FlexItem>
                      <FlexItem padding='5px'>
                        <Span fontSize='small' width='100%' >{desc}</Span></FlexItem>
                      <FlexItem>
                        <Flex justifyContent="space-evenly" alignItems="flex-end" id='buttons'>
                              <FlexItem id='add' margin='small'>
                                <Tooltip content='Add to list under Boards to enable adding to a personal Looker Board'>
                                  <IconButton icon={ <Add /> }  label='Add To Board'  size="medium" onClick={handleClick}/>
                                </Tooltip>
                                <Span fontSize='small' >Add</Span>
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
                              <FlexItem id='run' margin='small'>
                                <Tooltip content='Run Sample Query, output under Board section'>
                                  <IconButton  icon={<Explore />} size='medium' label="Run Query" onClick={() => runQuery(id)} />
                                </Tooltip>
                                <Span fontSize='small' >Run</Span>
                              </FlexItem>
                                : <Span></Span>}
                            </Flex>
                      </FlexItem>
                      <FlexItem id='metacard'>
                        <Card raised>
                          <Flex justifyContent='space-evenly' id='metadata'>
                            <FlexItem id='usage'>
                              <Flex>
                                <Tooltip content='Change in usage WoW'><Icon color={usage>0 ? "#00AF33":"#FF1F33"} icon={<SalesAnalytics />} label="usage"  size='xsmall' /></Tooltip><Span fontSize='xsmall' color={usage>0 ? "#00AF33":"#FF1F33"}  padding='3px' textAlign='centre'>{(usage*100).toFixed(1)+"%"}</Span>
                              </Flex>
                            </FlexItem>
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
                                
                            </FlexItem>
                          </Flex>
                        </Card>
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                </Flex>
            </SpaceVertical>
          </Box>
        </>
      );
      
}

export default DashCard;