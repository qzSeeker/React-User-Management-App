const API_URL = 'https://jsonplaceholder.typicode.com/';

// Define a type for the user data
export interface User {
    id?: number;
    name: string;
    username: string;
    email: string;
    phone?: string;
    website: string;
}

export interface UserInput {
    name: string;
    username: string;
    email: string;
}

// Fetching All Users
export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await fetch(`${API_URL}users`);
        if (!response.ok) {
            throw new Error("Network error: Something went wrong with response");
        }
        return await response.json();
    } catch (error) {
        console.error("There was an error while fetching users:", error);
        throw error;
    }
};

// Creating a New User
export const createUser = async (userData: UserInput): Promise<User> => {
    try {
        const response = await fetch(`${API_URL}users`, {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        });
        if (!response.ok) {
            throw new Error('Network error: Something went wrong with response');
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem creating a user:', error);
        throw error;
    }
};

// Updating an Existing User
export const updateUser = async (id: number, userData: UserInput): Promise<User> => {
    try {
        const response = await fetch(`${API_URL}users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        });
        if (!response.ok) {
            throw new Error('Network error: Something went wrong with response');
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem updating the user:', error);
        throw error;
    }
};

// Deleting Users
export const deleteUser = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}users/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network error: Something went wrong with response');
        }
    } catch (error) {
        console.error('There was a problem deleting the user:', error);
    }
};
