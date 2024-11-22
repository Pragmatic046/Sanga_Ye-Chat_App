import { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  position,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/chatsLogics";
import ProfileModal from "./Miscellaneous/ProfileModal.jsx";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal.jsx";
import axios from "axios";
import "../components/Styles.css";
import ScrollableChat from "./ScrollableChat.jsx";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { user, selectedChat, setSelectedChat } = ChatState();

  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "Failed to load the messages",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // --------------------------------------------
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);
  // --------------------------------------------
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage)
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `http://localhost:5000/message`,
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        console.log(data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error occurred",
          description: "Failed to send the message",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Typing Logic
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
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
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            d={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#e8e8e8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflow={"hidden"}
          >
            {/* Messages Here */}
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage}>
              <Input
                variant={"filled"}
                bg={"#e0e0e0"}
                placeholder="Type your message here..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
            {/* Messages above*/}
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent={"center"} h={"100%"}>
          <Text fontSize="3xl" pb={3} fontFamily={""} color={"grey"}>
            Click on a user to start a chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
