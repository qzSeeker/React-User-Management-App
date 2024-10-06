import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, useColorModeValue, useToast, VStack } from "@chakra-ui/react"
import { useState } from "react"
import { createUser, User, UserInput } from "../store/users"
import { emitUserCreated } from "../store/userCreationListener";

function CreatePage() {
    const [newUser, setNewUser] = useState<User>({
        name: '',
        username: '',
        email: '',
        phone: '',
        website: '',
    });

    const [errors, setErrors] = useState<Partial<User>>({});
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const validateForm = (): boolean => {
        const newErrors: Partial<User> = {};
        if (!newUser.name) newErrors.name = "Name is required";
        if (!newUser.username) newErrors.username = "Username is required";
        if (!newUser.email) newErrors.email = "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(newUser.email)) newErrors.email = "Invalid email format";
        if (!newUser.phone) newErrors.phone = "Phone is required";
        if (!newUser.website) newErrors.website = "Website is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof UserInput]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

        const handleCreateUser = async () => {
            if (!validateForm()) return;

            setIsLoading(true);
            try {
                // Create the new user
                const createdUser = await createUser(newUser);

                // Update localStorage
                const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
                localStorage.setItem("users", JSON.stringify([...storedUsers, createdUser]));

                // Emit user created event
                emitUserCreated(createdUser);
                console.log('User emitted:', createdUser); // Debugging line

                setNewUser({
                    name: '',
                    username: '',
                    email: '',
                    phone: '',
                    website: '',
                });
                
                toast({
                    title: "User created.",
                    description: "New user has been successfully created.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                console.log('User created successfully:', createdUser);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to create new user. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                console.error('Failed to create new user:', error);
            } finally {
                setIsLoading(false);
            }
        };

    return (
        <Container maxW={"container.sm"} marginTop={20}>
            <VStack spacing={8}>
            <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8} textColor={'teal.400'}>
                Create New User
            </Heading>
            <Box
                w={"full"}
                bg={useColorModeValue("white", "gray.700")}
                p={6}
                rounded={"lg"}
                shadow={"md"}
            >
                <VStack spacing={4}>
                <FormControl isInvalid={!!errors.name}>
                    <FormLabel>Name</FormLabel>
                    <Input
                    placeholder="Name"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.username}>
                    <FormLabel>Username</FormLabel>
                    <Input
                    placeholder="Username"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    />
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.phone}>
                    <FormLabel>Phone</FormLabel>
                    <Input
                    placeholder="Phone"
                    name="phone"
                    type="tel"
                    value={newUser.phone}
                    onChange={handleInputChange}
                    />
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.website}>
                    <FormLabel>Website</FormLabel>
                    <Input
                    placeholder="Website"
                    name="website"
                    value={newUser.website}
                    onChange={handleInputChange}
                    />
                    <FormErrorMessage>{errors.website}</FormErrorMessage>
                </FormControl>

                <Button
                    colorScheme="teal"
                    onClick={handleCreateUser}
                    w="full"
                    isLoading={isLoading}
                >
                    Create User
                </Button>
                </VStack>
            </Box>
            </VStack>
        </Container>
    )
}

export default CreatePage
