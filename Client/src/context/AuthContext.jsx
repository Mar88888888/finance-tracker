import { createContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

export const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [authToken, setAuthToken] = useState(() => {
        const savedToken = localStorage.getItem('authToken');
        return savedToken ? savedToken : null;
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!authToken) {
                console.log('No authToken found');
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/auth/bytoken`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    },
                    withCredentials: true,
                });
                console.log('Fetched user details:', response.data.user);
                setUser(response.data.user);
                setAuthToken(response.data.authToken);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
                setUser(null);
                setAuthToken(null);
                localStorage.removeItem('authToken');
            }
        };

        if (authToken && !user) {
            fetchUserDetails();
        }
    }, [authToken, user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }

        if (authToken) {
            localStorage.setItem('authToken', authToken);
        } else {
            localStorage.removeItem('authToken');
        }
    }, [user, authToken]);

    const contextValue = useMemo(() => ({
        user, setUser, authToken, setAuthToken,
    }), [user, authToken]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
