import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "./Miscellaneous/SideDrawer";
import MyChats from "./Miscellaneous/MyChats";
import ChatBox from "./Miscellaneous/ChatBox";

function Chat() {
  const { user } = ChatState();

  return (
    <>
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        <Box
          d="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          {user && <MyChats />}
          {user && <ChatBox />}
        </Box>
      </div>
    </>
  );
}

export default Chat;
