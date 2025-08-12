import { ApolloProvider } from '@apollo/client';

import { UserProvider } from './contexts/UserContext.jsx';
import { ToggleVisibleProvider } from "./contexts/ToggleVisibleContext.jsx";
import { SongDataProvider } from './contexts/SongDataContext.jsx';
import { CurrentSongProvider } from "./contexts/CurrentSongContext.jsx";
import { CurrentSectionsProvider } from './contexts/CurrentSectionsContext.jsx';
import { CurrentSectionProvider } from './contexts/CurrentSectionContext.jsx'
import { SearchTermProvider } from './contexts/SearchTermContext.jsx';

import { useApolloProvider } from './lib/constants.js';

function AppProviders({ children }) {
    const client = useApolloProvider();

    return (
        <ApolloProvider client={client}>
          <UserProvider>
            <ToggleVisibleProvider>
              <SongDataProvider>
                <CurrentSongProvider>
                  <CurrentSectionsProvider>
                    <CurrentSectionProvider>
                      <SearchTermProvider>
                        {children}
                      </SearchTermProvider>
                    </CurrentSectionProvider>
                  </CurrentSectionsProvider>
                </CurrentSongProvider>
              </SongDataProvider>
            </ToggleVisibleProvider>
          </UserProvider>
        </ApolloProvider>
    );
};

export default AppProviders;