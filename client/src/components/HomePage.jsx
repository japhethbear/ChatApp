import React from 'react'
import {
    Container, Box, Text, Tab, TabList, TabPanel, TabPanels, Tabs
} from '@chakra-ui/react';
import Login from './Login';
import SignUp from './SignUp'
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (!user?.id) {
            navigate(`/`)
        }else {
            navigate(`/chats`)
        }
        }, []);


    return <Container maxW='xl' centerContent>
        <Box
            d='flex'
            justifyContent='center'
            alignItems='center'
            p={3}
            w='100%'
            m='40px 0 15px 0'
        >
            <Text fontSize='4xl' fontFamily='monospace' color='white'>ChatMe</Text>
        </Box>
        <Box bg='white' w='100%' p={4} color='black' borderRadius='1g' borderWidth='1px'>
            <Tabs variant='soft-rounded'>
                <TabList mb='1em'>
                    <Tab width='50%'>Login</Tab>
                    <Tab width='50%'>Sign Up</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Login />
                    </TabPanel>
                    <TabPanel>
                        <SignUp />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Container>;


};

export default HomePage