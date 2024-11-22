import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
  onClick={handleFunction}
  cursor="pointer"
  bg="#e8e8e8"
  _hover={{
    background: "brown",//#38b2ac
    color: "white",
  }}
  transition="background 0.3s ease, color 0.3s ease"  // Smooth transition
  w="100%"
  display="flex"
  flexDirection="row"
  justifyContent="space-between"  // Added this to space items
  alignItems="center"
  color="black"
  px={3}
  py={2}
  mb={2}
  borderRadius="lg"
>
  <Box display="flex" flexDirection="column" width="50%">
    <Text fontSize="25px">{user.name}</Text>
    <Text fontSize="10px">
      {/* <b>Email: </b> */}
      <b>{user.email}</b>
    </Text>
  </Box>
  <Avatar
    size="sm"
    cursor="pointer"
    name={user.name}
    src={user.pic}
  />
</Box>
  );
};

export default UserListItem;
