import { AddIcon } from "@chakra-ui/icons";
import React from 'react'
import { Stack, Text } from "@chakra-ui/layout";

import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { Box } from '@chakra-ui/react'
import ChatLoading from "./ChatLoading";
import { Button } from "@chakra-ui/button";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from '../config/chatLogics';
import GroupChatModal from '../components/GroupChatModal'


const Convos = ({fetchAgain}) => {
    const [loggedUser, setLoggedUser] = useState();
    const {  selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        try {

        const { data } = await axios.get("http://localhost:8000/api/users/chats",{ withCredentials: true });
        setChats(data);
        // console.log("chats:", chats)
        } catch (error) {
        toast({
            title: "Error Occured!",
            description: "Failed to Load the chats",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        // console.log("logged user:", loggedUser)
        
        }, [fetchAgain]);

  return (
        <Box 
            className="left-chatpage"
            >
            <Box 
                className="convos"
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                >
                My Chats
                <GroupChatModal>
                    <Button
                        d='flex'
                        fontSize={{ base: '17px', md: '10px', lg: '17px' }}
                        rightIcon={<AddIcon/>}
                    > New Group Chat
                    </Button>
                    </GroupChatModal>
            </Box>
            <Box
                d="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                { chats ? (
                    <Stack overflowY={"scroll"}>
                        {chats.map((chat) => (
                            <Box
                            className="chat-pop"
                            onClick={() => setSelectedChat(chat)}
                            cursor="pointer"
                            bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                            color={selectedChat === chat ? "white" : "black"}
                            px={3}
                            py={2}
                            borderRadius="lg"
                            key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat?(
                                        getSender(loggedUser, chat.users)
                                    ) : (chat.chatName)}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading/>
                )}
            </Box>
            
        </Box>
        
  )
}
export default Convos
