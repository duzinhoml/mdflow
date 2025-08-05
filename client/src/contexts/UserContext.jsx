import { useState, useContext, createContext } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../lib/utils/queries';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { loading, data, error } = useQuery(QUERY_ME);
    const [userData, setUserData] = useState(null);

    return (
        <UserContext.Provider value={{ user: data?.me, loading, error, userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
