// Define a type for the user data
export interface Geo {
    lat: string;
    lng: string;
}

export interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}

export interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
}

export interface User {
    id: number | string;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
}

export type UserInput = Omit<User, 'id' | 'address' | 'company'>;

export type UserCreationData = UserInput & {
    address?: Partial<Address>;
    company?: Partial<Company>;
};