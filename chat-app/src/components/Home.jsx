import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "./Authentication/LogIn";
import SignUp from "./Authentication/SignUp";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW={"xl"} centerContent>
      <Box
        d={"flex"}
        justifyContent={"center"}
        p={3}
        bg={"#0168b5"}
        w={"80%"}
        // m={"40px 0 15px 0"}
        m={"2px 0 5px 0"}
        borderRadius={"lg"}
        borderWidth={"none"}
      >
        <Text
          fontSize={"2xl"}
          fontWeight={"700"}
          fontFamily={"Montserrat"}
          color={"#bee3f8"}
          textAlign={"center"}
        >
          Chat-App
        </Text>
      </Box>
      <Box
        bg={"#0168b5"}
        w={"80%"}
        p={"5"}
        m={"0 0 10px 0"}
        borderRadius={"lg"}
        borderWidth={"none"}
      >
        <Tabs variant="soft-rounded" color={"white"}>
          {/* isFitted  varient={"enclosed"}*/}
          <TabList mb="1em">
            <Tab width={"50%"} color={"white"}>
              Log In
            </Tab>
            <Tab width={"50%"} color={"white"}>
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{<Login />}</TabPanel>
            <TabPanel>{<SignUp />}</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Home;
