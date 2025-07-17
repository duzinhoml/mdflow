import { useContext, createContext } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../lib/utils/queries';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { loading, data, error } = useQuery(QUERY_ME);

    return (
        <UserContext.Provider value={{ user: data?.me, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
