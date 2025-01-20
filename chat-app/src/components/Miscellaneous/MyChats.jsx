import { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Avatar,
  Box,
  Button,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/chatsLogics.js";
import GroupChatModal from "./GroupChatModal.jsx";
import ScrollableFeed from "react-scrollable-feed";
import {v4 as uuid4} from "uuid"

const MyChats = ({ fetchAgain, setFetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("http://localhost:5000/chat", config); //
      if (!chats.find((c) => c._id === data._id)) setChats(data);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "Failed to load the chats",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      // alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "100%" }}
      borderRadius="lg"
      borderWidth="1px"
      height="505px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="roboto"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        textAlign="center"
      >
        Chats
        <GroupChatModal>
          <Box float="right">
            <Tooltip
              fontSize={"10px"}
              label="Create new group"
              hasArrow
              placement="top"
            >
              <Button
                className="groupChatButton"
                fontSize={{ base: "17px", md: "17px", lg: "17px" }}
              >
                <AddIcon />
              </Button>
            </Tooltip>
          </Box>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        h={{ base: "69vh", md: "68vh", lg: "75.5vh" }}
        borderRadius="lg"
        overflowY="hidden"
      >
        {Array.isArray(chats) ? (
          <ScrollableFeed>
            <Stack overflowY={"scroll"} >
              {chats.map((chat) => {
                const getSender = (loggedUser, users) => {
                  return users.find((user) => user._id !== loggedUser._id)
                    ?.name;
                };

                const getSenderPic = (loggedUser, users) => {
                  // const sender = users?.find(
                  //   (user) => user._id !== loggedUser._id// );
                  if (!users || users.length === 0) return null; // Safeguard for empty or undefined users array
                  const validUser = users.filter((u) => u && u._id); // Filter out invalid objects
                  const sender = validUser.find(
                    (u) => u._id !== loggedUser._id
                  );
                  return sender ? sender.pic : null; // Return null if sender not found
                  // return (
                  //   sender?.pic || "../../assets/anonymous user profile.jpg"
                  // );
                };
                const isGroupChat = chat.isGroupChat;
                const chatPic = isGroupChat
                  ? chat.pic // Group chat picture (if available)
                  : getSenderPic(loggedUser, chat.users); // Individual user picture

                return (
                  <>
                    <Tooltip
                    key={chat._id} //Ensure the key is always unique
                      fontSize={"10px"}
                      label={!isGroupChat ? getSender(loggedUser, chat.users):  chat.chatName}
                      hasArrow
                      placement="top"
                    >
                      <Box
                        onClick={() => setSelectedChat(chat)}
                        cursor="pointer"
                        bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                        color={selectedChat === chat ? "white" : "black"}
                        px={3}
                        py={2}
                        borderRadius="lg"
                        display="flex"
                        // flexDirection={{base:"row", md:"column", lg:"column"}}
                        justifyContent="space-between"
                      >
                        <Avatar
                          w="30px"
                          h="30px"
                          size="sm"
                          cursor="pointer"
                          src={chatPic} // Set the correct picture here
                          mr={{ base: "40%", md: "0", lg: "5px" }}
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        />
                        <Text
                          fontSize="12px"
                          fontFamily="roboto"
                          width="50%"
                          display="flex"
                          justifyContent="right"
                        >
                          {!isGroupChat
                            ? getSender(loggedUser, chat.users) // Sender's name for individual chats
                            : chat.chatName}
                        </Text>
                      </Box>
                    </Tooltip>
                  </>
                );
              })}
            </Stack>
          </ScrollableFeed>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
