import Auth from '../lib/utils/auth.js';

import { useToggleVisible } from '../contexts/ToggleVisibleContext.jsx';
import { useSongData } from '../contexts/SongDataContext.jsx';
import { useCurrentSong } from '../contexts/CurrentSongContext.jsx';

import { useUpdateTitle } from '../lib/constants.js';

function Nav() {  
    const { visible, toggleVisible } = useToggleVisible();
    const { songData } = useSongData();
    const { currentSong } = useCurrentSong();
    const handleInputChange = useUpdateTitle();

    return (
        <nav className="navbar bg-dark px-2">
            <div className='d-flex'>
                <span className='navbar-brand me-2 text-light'>MDFlow</span>
                <button className='btn btn-info ms-2' onClick={() => toggleVisible('sidebar')}>Sidebar</button>
            </div>

            {currentSong ? (
                <input 
                    type="text" 
                    className='text-light text-center p-1 border-2 border-primary rounded'
                    onChange={handleInputChange} 
                    value={songData.title}
                    style={{ 
                        border: 'none',
                        backgroundColor: 'transparent',
                        outlineColor: 'grey',
                        cursor: 'text'
                    }}
                /> 
            ) : (
                <input 
                    type="text" 
                    className='text-light text-center p-1 border-2 border-primary rounded'
                    placeholder='Song Title'
                    onChange={handleInputChange} 
                    value={songData.title}
                    style={{ 
                        border: 'none',
                        backgroundColor: 'transparent',
                        outlineColor: 'grey',
                        cursor: 'text'
                    }}
                /> 
            )}
                {/* : <span className='text-light'>{user?.username}</span>} */}

            <div>
                <button onClick={() => toggleVisible('inputPool')} className="btn btn-primary" style={{ minWidth: '67px' }}>{!visible.inputPool ? 'Open' : 'Close'}</button>
                <button onClick={() => Auth.logout()} className='btn btn-danger ms-2'>Log Out</button>
            </div>
        </nav>
    );
};

export default Nav;