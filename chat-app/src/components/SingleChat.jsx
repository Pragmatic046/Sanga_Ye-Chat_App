import { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon, Spinner } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/chatsLogics";
import ProfileModal from "./Miscellaneous/ProfileModal.jsx";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal.jsx";
import axios from "axios";
import "../components/Styles.css";
import ScrollableChat from "./ScrollableChat.jsx";
import io from "socket.io-client";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../animations/typing.json";
import MyChats from "./Miscellaneous/MyChats.jsx";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, setNotification, notification } =
    ChatState();

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
      socket.emit("join chat", selectedChat._id);
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
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id); // Stop typing on send

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage(""); // Clear the input field

        const { data } = await axios.post(
          `http://localhost:5000/message`,
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );

        // Emit new message to the server
        socket.emit("new message", data);

        // Update messages in state
        setMessages([...messages, data]);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error occurred",
          description: "Failed to send the message",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  // --------------------------------------------
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, []);
  // --------------------------------------------------------------

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  // ------------------------------------------------------------

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });
  // ---------------------------------------------------------------

  let typingTimeout; // Declare outside the function for global use

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id); // Notify the server that the user is typing
    }

    // Clear any existing timeout
    clearTimeout(typingTimeout);

    // Reset typing status after a delay
    typingTimeout = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id); // Notify server to stop typing
      setTyping(false);
    }, 3000); // 3 seconds debounce
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "16px", md: "20px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="roboto"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
            />

            {!selectedChat.isGroupChat ? (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {getSender(user, selectedChat.users)}
                  <div className="anime-space">
                    {isTyping ? (
                      <div className="anime">
                        <Player
                          autoplay
                          loop
                          src={animationData}
                          style={{ width: 30 }}
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
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
            className={
              messages.length === 0 ? "chatbox-empty" : "chatbox-filled"
            }
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={1}
            bg={"#e8e8e8"}
            h="75vh"
            borderRadius="lg"
            overflow="hidden"
            width="100%"
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
              sx={{
                display: "flex",
                flexDirection: "column",
                width: { base: "85vw", md: "100%", lg: "50vw" }, // Adjust conditionally for screen size
              }}
            >
              <Input
                variant="filled"
                bg="#e0e0e0"
                placeholder="Type your message here..."
                onChange={typingHandler}
                value={newMessage}
                display="flex"
                flexDir="column"
                fontFamily="roboto"
                fontSize="15px"
                width="100%"
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="87vh"
        >
          <Text
            fontWeight="100"
            fontSize="lg"
            color="gray.500"
            textAlign="center"
          >
            Click on a user to start conversation
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
