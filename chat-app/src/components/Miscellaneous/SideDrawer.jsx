import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  // Spinner,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider.jsx";
import ProfileModal from "./ProfileModal.jsx";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import axios from "axios";
import ChatLoading from "./ChatLoading.jsx";
import UserListItem from "../UserAvatar/UserListItem.jsx";
import { Spinner } from "@chakra-ui/spinner";
import { getSender } from "../../config/chatsLogics.js";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    setNotification,
    notification,
  } = ChatState();
  const navigate = useNavigate();

  const toast = useToast();

  // ---------------------------------------------------
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  // ------------------------------------------------------

  // ------------------------------------------------------
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "Failed to load the search results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  // ------------------------------------------------------------
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/chat`,
        { userId },
        config
      );
      // console.log(data);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  // --------------------------------------------------------

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
        height="40px" // Limit the box height to 50px
        fontFamily="roboto"
      >
        {/* Left: Search Button */}
        <Tooltip
          fontSize="10px"
          fontFamily="roboto"
          label="Search users to chat"
          hasArrow
          placement="bottom-end"
        >
          <Button height={"15px"} variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text
              fontSize="10px"
              fontFamily="roboto"
              display={{ base: "none", md: "flex" }}
              px="3"
            >
              Search user
            </Text>
          </Button>
        </Tooltip>

        {/* Center: App Name */}
        <Text
          fontSize="28px"
          fontFamily="roboto"
          fontWeight="700"
          textAlign="center"
        >
          Sanga-Ye
        </Text>

        {/* Right: Menu with Profile and Notifications */}
        <Box display="flex" alignItems="center">
          <Menu>
            {/* Notification Icon */}
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="15px" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages"}
              {notification.map((notify) => (
                <MenuItem
                  key={notify._id}
                  onClick={() => {
                    setSelectedChat(notify.chat);
                    setNotification(notification.filter((n) => n !== notify));
                  }}
                  fontFamily="roboto"
                  fontSize="10px"
                >
                  {notify.chat.isGroupChat
                    ? `New message in ${notify.chat.chatName}`
                    : `New message from ${getSender(user, notify.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            {/* User Profile Icon */}
            <Tooltip
              fontSize="10px"
              fontFamily="roboto"
              label="Profile"
              hasArrow
              placement="bottom"
            >
              <MenuButton
                height={"30px"}
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                <Avatar
                  w={"30px"}
                  h={"30px"}
                  size="sm"
                  cursor="pointer"
                  name={user.name}
                  src={user.pic}
                />
              </MenuButton>
            </Tooltip>
            <MenuList fontFamily="roboto" fontSize="15px">
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" p={2}>
              <Input
                placeholder="Search by name or email"
                size={"sm"}
                w={"80%"}
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button size={"sm"} onClick={handleSearch}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              // console.log(searchResult.name)
              searchResult &&
              Array.isArray(searchResult) &&
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} d={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
