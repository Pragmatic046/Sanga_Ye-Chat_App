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
  Tooltip,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}

      <Modal size="sm" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={"380px"}
        >
          <ModalHeader fontSize="22px" fontFamily="roboto" textAlign="center">
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
              src={user.pic || `http://localhost:5000/images/anon.jpg`}
              alt={user.name}
              fontSize={"10px"}
              mb={4}
            />
            <Text
              fontSize={{ base: "12px", md: "15px" }}
              fontFamily="roboto"
              textAlign="center"
            >
              {user.email}
            </Text>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="center">
            <Button fontFamily="roboto" fontSize="15px" colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ProfileModal;
