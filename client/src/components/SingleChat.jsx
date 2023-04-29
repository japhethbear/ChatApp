import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/chatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import ScrollableChat from "../components/ScrollableChat";
import Lottie from "react-lottie";
// import animationData from "../animations/typing.json";
// import io from "socket.io-client";
import UpdateGroupChatModal from "././UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const ENDPOINT = "http://localhost:8000"; 

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
const { user, selectedChat, setSelectedChat } = ChatState();
const [messages, setMessages] = useState([]);
const [loading, setLoading] = useState(false);
const [newMessage, setNewMessage] = useState();
const [istyping, setIsTyping] = useState(false);

const toast = useToast();

const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
        setLoading(true);
        const { data } = await axios.get(
            `http://localhost:8000/api/messages/${selectedChat._id}`,
            { withCredentials: true }
            );
            console.log("selected user id:",selectedChat._id)
            setMessages(data);
            setLoading(false);
            console.log("messages:", messages)
    } catch (error) {
        toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
        });
    }
    };

const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
    // socket.emit("stop typing", selectedChat._id);
    try {
        setNewMessage("");
        const { data } = await axios.post(
            "http://localhost:8000/api/messages", 
            {
                content: newMessage,
                chatId: selectedChat._id,
            }, { withCredentials: true }
            );
            // socket.emit("new message", data);
            setMessages([...messages, data]);
            // console.log("messages tets:", messages)
    } catch (error) {
        toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
        });
    }
    }
};

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    const typingHandler = (e) => {
        setNewMessage(e.target.value)
}
return (
        <>
        {selectedChat ? (
            <>
            <Text
                className="chatbox-top" 
                fontSize={{ base: "28px", md: "30px" }}
                pb={3}
                px={2}
                w="100%"
                fontFamily="Work sans"
                d="flex"
                justifyContent={{ base: "space-between" }}
                alignItems="center"
            >
                <IconButton
                d={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
                />
                {messages &&
                (!selectedChat.isGroupChat ? (
                    <>
                    {getSender(user, selectedChat.users)}
                    <ProfileModal
                        user={getSenderFull(user, selectedChat.users)}
                    />
                    </>
                ) : (
                    <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                        fetchMessages={fetchMessages}
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                    />
                    </>
                ))}
            </Text>
            <Box
                className="chat-messages"       
                d="flex"
                flexDir="column"
                justifyContent="flex-end"
                p={3}
                bg="#E8E8E8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {loading ? (
                <Spinner
                    size="xl"
                    w={20}
                    h={20}
                    alignSelf="center"
                    margin="auto"
                />
                ) : (
                <div className="messages">
                    <ScrollableChat messages={messages} />
                </div>
                )}

                <FormControl
                onKeyDown={sendMessage}
                id="first-name"
                isRequired
                mt={3}
                >
                {/* {istyping ? (
                    <div>
                    <Lottie
                        // options={defaultOptions}
                        // height={50}
                        width={70}
                        style={{ marginBottom: 15, marginLeft: 0 }}
                    />
                    </div>
                ) : (
                    <></>
                )} */}
                <Input
                    variant="filled"
                    bg="#E0E0E0"
                    placeholder="Enter a message.."
                    value={newMessage}
                    onChange={typingHandler}
                />
                </FormControl>
            </Box>
            </>
        ) : (
            // to get socket.io on same page
            <Box d="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                Click on a user to start chatting
            </Text>
            </Box>
        )}
        </>
    );

}

export default SingleChat;
