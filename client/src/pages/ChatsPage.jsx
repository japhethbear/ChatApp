import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Box } from "@chakra-ui/react";
import Convos from '../components/Convos';
import ChatBox from '../components/ChatBox'
import SideDrawer from "../components/SideDrawer"
import { ChatState } from '../Context/ChatProvider'


const Chats = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <div style={{ width: "100%" }}>
        {user && <SideDrawer/>}
        <Box  className='chat-page' >
            {user && <Convos fetchAgain={fetchAgain} />}
            {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        </Box>
    </div>
    )


}

export default Chats