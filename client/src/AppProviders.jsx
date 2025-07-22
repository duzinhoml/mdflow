import { ApolloProvider } from '@apollo/client';

import { UserProvider } from './contexts/UserContext.jsx';
import { ToggleInputPoolProvider } from "./contexts/ToggleInputPoolContext.jsx";
import { EditingProvider } from './contexts/EditingContext.jsx';
import { CurrentSongProvider } from "./contexts/CurrentSongContext.jsx";
import { CurrentSectionsProvider } from './contexts/CurrentSectionsContext.jsx';

import { useApolloProvider } from './lib/constants.js';

function AppProviders({ children }) {
    const client = useApolloProvider();

    return (
        <ApolloProvider client={client}>
          <UserProvider>
            <ToggleInputPoolProvider>
              <EditingProvider>
                <CurrentSongProvider>
                  <CurrentSectionsProvider>
                    {children}
                  </CurrentSectionsProvider>
                </CurrentSongProvider>
              </EditingProvider>
            </ToggleInputPoolProvider>
          </UserProvider>
        </ApolloProvider>
    );
};

export default AppProviders;