import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import {Box, Text,useToast} from "@chakra-ui/react"
import {ArrowBackIcon} from "@chakra-ui/icons"
import {IconButton} from "@chakra-ui/button"
import {getSender, getSenderFull} from "../config/ChatLogics"
import ProfileModal from "./miscellaneous/ProfileModal"
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import { useState,useEffect } from "react";
import { Spinner, FormControl, Input} from "@chakra-ui/react";
import axios from "axios";
import "./styles.css";
import ScrollableChat from './ScrollableChat'


const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const toast = useToast();
  // const [socketConnected, setSocketConnected] = useState(false);
  // const [typing, setTyping] = useState(false);
  // const [istyping, setIsTyping] = useState(false);
   
    const {user, selectedChat, setSelectedChat} = ChatState();

    const fetchMessages = async() =>{
       if(!selectedChat) return;

      try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      console.log(messages);

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
    }

   useEffect(() =>{
    fetchMessages();
   }, [selectedChat]);


    const sendMessage = async(event) =>{
      if(event.key === "Enter" && newMessage){
        try{
           const config = {
             headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
           };

          const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);

        setNewMessage("");
        setMessages([...messages, data]);

        }catch{

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


    const typingHandler = (event) =>{
      setNewMessage(event.target.value);
    };
  return (
    <>{
      selectedChat? (
        <>
         <Text
            fontSize={{ base: "28px", md: "30px" }}
            paddingBottom={3}
            px={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center">
              <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ?(
              <>
              {getSender(user, selectedChat.users)}
              < ProfileModal user={getSenderFull(user, selectedChat.users)}/>
              </>
            ):(
              <>
              {selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModal
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              fetchMessages = {fetchMessages}
              
              />
              </>
            )
          }
        </Text>
         <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            padding={3}
            background="#E8E8E8"
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            { loading ? (
              <Spinner
                size="xl"
                width={20}
                height={20}
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
              //id="first-name"
              isRequired
              marginTop={3}
            >
              {/* {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
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
                background="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ): (
        <Box
        display="flex" alignItems="center" justifyContent="center" height="100%">
          <Text fontSize="3xl" paddingBottom={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )
    }
      
    </>
  )
}

export default SingleChat
