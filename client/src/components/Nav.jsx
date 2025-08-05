import Auth from '../lib/utils/auth.js';

import { useUser } from '../contexts/UserContext.jsx';
import { useToggleInputPool } from '../contexts/ToggleInputPoolContext.jsx';
import { useSongData } from '../contexts/SongDataContext.jsx';
import { useCurrentSong } from '../contexts/CurrentSongContext.jsx';

import { useUpdateTitle } from '../lib/constants.js';

function Nav() {
    const { user } = useUser();    
    const { visible, toggleInputPool } = useToggleInputPool();
    const { songData } = useSongData();
    const { currentSong, handleSetCurrentSong } = useCurrentSong();
    const handleInputChange = useUpdateTitle();

    return (
        <nav className="navbar bg-dark px-2">
            <div className='d-flex'>
                <span className='navbar-brand me-2 text-light'>MDFlow</span>

                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Dropdown
                    </button>
                    <ul className="dropdown-menu">
                        {user?.songs.map(song => (
                            <li key={song._id}>
                                <button 
                                    className="dropdown-item" 
                                    type="button" 
                                    onClick={() => handleSetCurrentSong(song)}
                                >
                                    {song.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
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
            )
                : <span className='text-light'>{user?.username}</span>}

            <div>
                <button onClick={() => toggleInputPool()} className="btn btn-primary">{!visible ? 'Open' : 'Close'}</button>
                <button onClick={() => Auth.logout()} className='btn btn-danger ms-2'>Log Out</button>
            </div>
        </nav>
    );
};

export default Nav;