import React from 'react';
import { User } from './types';

type UserCreationListener = (user: User) => void;

const listeners: UserCreationListener[] = [];

export function emitUserCreated(user: User) {
    listeners.forEach(listener => listener(user));
}

export function useUserCreationListener(callback: UserCreationListener) {
    React.useEffect(() => {
        listeners.push(callback);
        return () => {
        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
        };
    }, [callback]);
}