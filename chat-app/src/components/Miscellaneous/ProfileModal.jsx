import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          d={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        ></IconButton>
      )}
      <Modal size="sm" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={"380px"}
        >
          <ModalHeader
            fontSize="30px"
            fontFamily="berlin sans fb"
            textAlign="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              borderRadius="full"
              borderColor={"gray"}
              boxSize="100px"
              src={user.pic ||`http://localhost:5000/images/anon.jpg`}
              alt={user.name}
              fontSize={"10px"}
              mb={4}
            />
            <Text
              fontSize={{ base: "15px", md: "25px" }}
              fontFamily="berlin sans fb"
              textAlign="center"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="center">
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ProfileModal;
