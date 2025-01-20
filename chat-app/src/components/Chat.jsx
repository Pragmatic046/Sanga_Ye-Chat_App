import { ChatState } from "../Context/ChatProvider";
import { Box, Flex, useMediaQuery } from "@chakra-ui/react";
import SideDrawer from "./Miscellaneous/SideDrawer";
import MyChats from "./Miscellaneous/MyChats";
import ChatBox from "./Miscellaneous/ChatBox";
import { useState } from "react";

function Chat() {
  const { user, selectedChat } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  const [isMobile] = useMediaQuery("(max-width: 768px)"); // Define mobile view breakpoint
  return (
    <>
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        {/* --------------------------------------- */}
        <Flex
          h="91.5vh"
          gap={1} // Adds space between MyChats and ChatBox
        >
          {/* ---------------MY-CHATS------------------ */}
          {user && (!isMobile || !selectedChat || isMobile || selectedChat) && (
            <Box
              flex={isMobile && selectedChat ? 0 : 1}
              d="flex"
              w="100%"
              h="91.5vh"
              p="5px"
            >
              <MyChats fetchAgain={fetchAgain} />
            </Box>
          )}

          {/* ---------------CHAT BOX------------------ */}
          {user && (isMobile ? selectedChat : true) && (
            <Box d="flex" flex={isMobile ? 0 : 2} w="95%" h="100%" p="5px">
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </Box>
          )}
        </Flex>
      </div>
    </>
  );
}

export default Chat;
