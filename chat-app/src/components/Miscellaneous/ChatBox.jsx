import { Box } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import SingleChat from "../SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      flex="1" // Take up the remaining width
      background="#fff"
      borderRadius="lg"
      padding="10px"
      overflowY="hidden" // Prevent scrollbars unless necessary
      boxShadow="md"
      height="100%"
      fontFamily="roboto"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
