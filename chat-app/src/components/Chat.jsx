import { ChatState } from "../Context/ChatProvider";
import { Box, Flex } from "@chakra-ui/react";
import SideDrawer from "./Miscellaneous/SideDrawer";
import MyChats from "./Miscellaneous/MyChats";
import ChatBox from "./Miscellaneous/ChatBox";
import { useState } from "react";

function Chat() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <>
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
      
        <Flex
          h="91.5vh"
          gap={1} // Adds space between MyChats and ChatBox
        >

          {/* ---------------MY-CHATS------------------ */}
          {user && (
            <Box flex={1} d="flex" w="" h="91.5vh" p="5px">
              <MyChats fetchAgain={fetchAgain} />
            </Box>
          )}

          {/* ---------------CHAT BOX------------------ */}
          {user && (
            <Box d="flex" flex={2} w="" h="91.5vh" p="5px">
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </Box>
          )}

        </Flex>
      </div>
    </>
  );
}

export default Chat;
