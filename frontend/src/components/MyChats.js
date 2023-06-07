import React from 'react';
import {useToast, Box, Stack, Text} from '@chakra-ui/react';
import {AddIcon} from '@chakra-ui/icons'
import {Button} from '@chakra-ui/button'
import {useState ,useEffect} from "react";
import { ChatState } from '../Context/ChatProvider';
import Axios from "axios";
import ChatLoading from './ChatLoading';
import {getSender} from '../config/ChatLogics'

const   MyChats = () =>{
  const [loggedUser, setLoggedUser] = useState();
  const {selectedChat, setSelectedChat,user, chats, setChats} = ChatState();
  const toast = useToast();

   const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await Axios.get("/api/chat", config);
      console.log(data);
      setChats(data);
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
    // eslint-disable-next-line
  }, []);
  
  return (
     <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      padding={3}
      bg="white"
      width={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px">
        <Box
         paddingBottom={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        >My Chats
         <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </Box>
       <Box
        display="flex"
        flexDirection="column"
        padding={3}
        background="#F8F8F8"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
       >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
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
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ):(
          <ChatLoading/>
        )}
       </Box>
      </Box>
  );

};

export default MyChats;

