
import React, { useEffect} from 'react';
import { Panel} from '@looker/components'

const EmbedPanel = () => {
    const [open, setOpen] = useState(false)
    const toggleOpen = () => setExplore(!open)
  
    const title = (
      <>
        <Icon icon={<ArrowLeft />} m="xsmall" />
        Left
      </>
    )
  
    return (
      <Panels>
        <List iconGutter>
          <Panel
            content={'content from Right...'}
            direction="right"
            title="Right"
          >
            <ListItem icon={<ArrowBack />}>Right</ListItem>
          </Panel>
          <Panel content={'content from Left...'} direction="left" title="Left">
            <ListItem icon={<ArrowForward />}>Left</ListItem>
          </Panel>
          <ListItem disabled>Not a panel</ListItem>
          <ListItem disabled>Not a panel</ListItem>
        </List>
      </Panels>
    )
  }

  export default EmbedPanel;