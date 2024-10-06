import { useEffect } from 'react';
import { User } from './users';

const USER_CREATED_EVENT = 'userCreated';

export const emitUserCreated = (user: User) => {
    const event = new CustomEvent(USER_CREATED_EVENT, { detail: user });
    window.dispatchEvent(event);
    };

    export const useUserCreationListener = (callback: (user: User) => void) => {
    useEffect(() => {
        const handler = (event: CustomEvent<User>) => {
        callback(event.detail);
        };

        window.addEventListener(USER_CREATED_EVENT, handler as EventListener);

        return () => {
        window.removeEventListener(USER_CREATED_EVENT, handler as EventListener);
        };
    }, [callback]);
};