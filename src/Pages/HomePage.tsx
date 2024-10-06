import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchUsers, User } from "../store/users";
import { useUserCreationListener } from "../store/userCreationListener";
import React from "react";

function HomePage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [updatedUser, setUpdatedUser] = useState<User | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
    } = useDisclosure();
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const toast = useToast();

  // Helper function to save users to local storage
    const saveUsersToLocalStorage = (users: User[]) => {
        localStorage.setItem("users", JSON.stringify(users));
    };

        const loadUsers = async () => {
            try {
                setLoading(true);
                const storedUsers = localStorage.getItem("users");
                if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
                } else {
                const data = await fetchUsers();
                setUsers(data);
                localStorage.setItem("users", JSON.stringify(data));
                }
                setError(null);
            } catch (error) {
                setError("Failed to fetch users. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            loadUsers();
        });

        
        useEffect(() => {
            const handleFocus = () => {
                loadUsers();
            };
            window.addEventListener('focus', handleFocus);
            return () => {
                window.removeEventListener('focus', handleFocus);
            };
        }, []);


    // Listen for new user creation events
    useUserCreationListener((newUser) => {
        if (newUser) {
        setUsers((prevUsers) => {
            const updatedUsers = [...prevUsers, newUser];
            saveUsersToLocalStorage(updatedUsers); // Update local storage
            return updatedUsers;
        });
        toast({
            title: "New user created!",
            description: `User ${newUser.name} has been added.`,
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        }
    });

    const handleEdit = (user: User) => {
        setCurrentUser(user);
        setUpdatedUser(user);
        onOpen();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedUser(
        (prevUser) =>
            ({
            ...prevUser,
            [e.target.name]: e.target.value,
            } as User)
        );
    };

    const handleSave = async () => {
        if (updatedUser) {
        // Validate input before proceeding
        if (
            !updatedUser.name ||
            !updatedUser.username ||
            !updatedUser.email ||
            !updatedUser.phone ||
            !updatedUser.website
        ) {
            toast({
            title: "Error",
            description: "Please fill in all the fields.",
            status: "error",
            duration: 3000,
            isClosable: true,
            });
            return;
        }

        setIsSaving(true); // Show spinner and disable Save button

        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${updatedUser.id}`,
            {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
            }
        );

        const data = await response.json();

        // Update the UI
        const updatedUsersList = users.map((user) =>
            user.id === updatedUser.id ? data : user
        );
        setUsers(updatedUsersList);
        saveUsersToLocalStorage(updatedUsersList);

        setIsSaving(false); // Stop spinner and re-enable Save button
        onClose(); // Close the modal
        }
    };

    // Function to open the delete confirmation modal
    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        onDeleteOpen();
    };

    // Function to delete the user
    const handleDelete = async () => {
        if (userToDelete) {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${userToDelete.id}`,
            {
            method: "DELETE",
            }
        );

        if (response.ok) {
            const updatedUsersList = users.filter(
            (user) => user.id !== userToDelete.id
            );
            setUsers(updatedUsersList);
            saveUsersToLocalStorage(updatedUsersList);

            // Show a success message
            toast({
            title: "User deleted.",
            description: `User with ID ${userToDelete.id} has been deleted.`,
            status: "success",
            duration: 3000,
            isClosable: true,
            });

            onDeleteClose();
        }
        }
    };

    if (loading) {
        return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
        >
            <Spinner size="xl" />
        </Box>
        );
    }

    if (error) {
        return (
        <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
        );
    }

    return (
        <Box py={12} width="100%" marginTop={14}>
        <Heading as="h1" size="xl" textAlign="center" textColor={'teal.400'} mb={6}>
            Users List
        </Heading>

        {/* Display Current User Editing Information */}
        {currentUser && (
            <Box mb={6}>
                <Heading size="lg">Editing User: {currentUser.name}</Heading>
                <Text>Email: {currentUser.email}</Text>
                <Text>Username: {currentUser.username}</Text>
            </Box>
        )}

        {/* Desktop Table */}
        <TableContainer display={{ base: "none", md: "block" }} py={12}>
            <Table variant="striped" colorScheme="teal">
            <TableCaption>List of all users</TableCaption>
            <Thead>
                <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Username</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Website</Th>
                <Th>Actions</Th>
                </Tr>
            </Thead>
            <Tbody>
                {users.map((user) => (
                <Tr key={user.id}>
                    <Td>{user.id}</Td>
                    <Td>{user.name}</Td>
                    <Td>{user.username}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.phone}</Td>
                    <Td>{user.website}</Td>
                    <Td>
                    <Button colorScheme="gray" onClick={() => handleEdit(user)}>
                        Edit
                    </Button>
                    </Td>
                    <Td>
                    <Button
                        colorScheme="red"
                        onClick={() => handleDeleteClick(user)}
                    >
                        Delete
                    </Button>
                    </Td>
                </Tr>
                ))}
            </Tbody>
            </Table>
        </TableContainer>

        {/* Mobile View (Stacked Layout) */}
        <Box display={{ base: "block", md: "none" }} py={12}>
            {users.map((user) => (
            <Box
                key={user.id}
                borderWidth="1px"
                borderColor="teal.400"
                borderRadius="lg"
                overflow="hidden"
                mb={4}
                p={4}
                boxShadow="md"
            >
                <Table variant="striped" colorScheme="teal">
                <Tbody>
                    <Tr fontSize={{ base: '14px' }}>
                    <Td fontWeight="bold">ID:</Td>
                    <Td>{user.id}</Td>
                    </Tr>
                    <Tr  fontSize={{ base: '14px' }}>
                    <Td fontWeight="bold">Name:</Td>
                    <Td>{user.name}</Td>
                    </Tr>
                    <Tr fontSize={{ base: '14px' }}>
                    <Td fontWeight="bold">Username:</Td>
                    <Td>{user.username}</Td>
                    </Tr>
                    <Tr fontSize={{ base: '14px' }}>
                    <Td fontWeight="bold">Email:</Td>
                    <Td>{user.email}</Td>
                    </Tr>
                    <Tr fontSize={{ base: '14px' }}>
                    <Td fontWeight="bold">Phone:</Td>
                    <Td>{user.phone}</Td>
                    </Tr>
                    <Tr fontSize={{ base: '14px' }}>
                    <Td fontWeight="bold">Website:</Td>
                    <Td>{user.website}</Td>
                    </Tr>
                </Tbody>
                </Table>
                <Box mt={4}>
                <Button colorScheme="gray" onClick={() => handleEdit(user)} mr={2}>
                    Edit
                </Button>
                <Button colorScheme="red" onClick={() => handleDeleteClick(user)}>
                    Delete
                </Button>
                </Box>
            </Box>
            ))}
        </Box>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Delete User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                Are you sure you want to delete {userToDelete?.name}?
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={handleDelete}>
                Yes, delete
                </Button>
                <Button variant="ghost" onClick={onDeleteClose}>
                Cancel
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>

        {/* Update User Modal */}
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Update User Information</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
                {/* Form controls for updating user details */}
                <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                    ref={initialRef}
                    placeholder="Name"
                    name="name"
                    value={updatedUser?.name || ""}
                    onChange={handleInputChange}
                />
                </FormControl>
                <FormControl mt={4}>
                <FormLabel>Username</FormLabel>
                <Input
                    placeholder="Username"
                    name="username"
                    value={updatedUser?.username || ""}
                    onChange={handleInputChange}
                />
                </FormControl>
                <FormControl mt={4}>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder="Email"
                    name="email"
                    value={updatedUser?.email || ""}
                    onChange={handleInputChange}
                />
                </FormControl>
                <FormControl mt={4}>
                <FormLabel>Phone</FormLabel>
                <Input
                    placeholder="Phone"
                    name="phone"
                    value={updatedUser?.phone || ""}
                    onChange={handleInputChange}
                />
                </FormControl>
                <FormControl mt={4}>
                <FormLabel>Website</FormLabel>
                <Input
                    placeholder="Website"
                    name="website"
                    value={updatedUser?.website || ""}
                    onChange={handleInputChange}
                />
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <Button
                colorScheme="blue"
                mr={3}
                onClick={handleSave}
                isLoading={isSaving}
                loadingText="Saving"
                >
                Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </Box>
    );
}

export default HomePage;
