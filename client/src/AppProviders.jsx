import { ApolloProvider } from '@apollo/client';

import { UserProvider } from './contexts/UserContext.jsx';
import { ToggleVisibleProvider } from "./contexts/ToggleVisibleContext.jsx";
import { SongDataProvider } from './contexts/SongDataContext.jsx';
import { SongProvider } from './contexts/SongContext.jsx';
import { SearchTermProvider } from './contexts/SearchTermContext.jsx';

import { useApolloProvider } from './lib/constants.js';

function AppProviders({ children }) {
    const client = useApolloProvider();

    return (
        <ApolloProvider client={client}>
          <UserProvider>
            <ToggleVisibleProvider>
              <SongDataProvider>
                <SongProvider>
                  <SearchTermProvider>
                    {children}
                  </SearchTermProvider>
                </SongProvider>
              </SongDataProvider>
            </ToggleVisibleProvider>
          </UserProvider>
        </ApolloProvider>
    );
};

export default AppProviders;