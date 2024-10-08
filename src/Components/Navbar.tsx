import {
    Button,
    Container,
    Flex,
    HStack,
    Text,
    useColorMode,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Container maxW={"1140px"} px={4}>

        <Flex
            h={16}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={5}
            flexDir={{
            base: "column",
            sm: "row",
            }}
        >
            <Link to={"/"}>
            <Button colorScheme="teal" variant="outline">
                User's Hub
            </Button>
            </Link>
            <HStack spacing={2} alignItems={"center"}>
            <Link to="/create">
                <Button variant={"outline"}>
                <Text>Create New User</Text>
                </Button>
            </Link>
            <Button onClick={toggleColorMode} variant={"outline"}>
                {colorMode === "light" ? (
                <FaSun fontSize={18} />
                ) : (
                <FaMoon fontSize={18} />
                )}
            </Button>
            </HStack>
        </Flex>

        </Container>
    );
}

export default Navbar;
