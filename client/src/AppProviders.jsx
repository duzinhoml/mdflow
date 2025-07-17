import { ApolloProvider } from '@apollo/client';

import { UserProvider } from './contexts/UserContext';

import { useApolloProvider } from './lib/constants.js';

function AppProviders({ children }) {
    const { client } = useApolloProvider();

    return (
        <ApolloProvider client={client}>
          <UserProvider>
            {children}
          </UserProvider>
        </ApolloProvider>
    );
};

export default AppProviders;