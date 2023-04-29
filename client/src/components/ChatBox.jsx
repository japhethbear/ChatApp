import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from '../components/SingleChat'

const ChatBox = ({fetchAgain, setFetchAgain}) => {
    const {selectedChat} = ChatState();
  return (
    <Box
      className='chat-box'
  >
    <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox