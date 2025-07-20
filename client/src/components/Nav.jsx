import Auth from '../lib/utils/auth.js';

import { useUser } from '../contexts/UserContext.jsx';
import { useToggleInputPool } from '../contexts/ToggleInputPoolContext.jsx';
import { useCurrentSong } from '../contexts/CurrentSongContext.jsx';
import { useEditing } from '../contexts/EditingContext.jsx';

function Nav() {
    const { user } = useUser();
    const { visible, toggleInputPool } = useToggleInputPool();
    const { currentSong, handleSetCurrentSong } = useCurrentSong();
    const { isEditing, setIsEditing } = useEditing();

    return (
        <nav className="navbar bg-warning-subtle px-2">
            <div className='d-flex'>
                <span className='navbar-brand me-2'>MDFlow</span>

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

                <button className={`btn btn-primary ${isEditing && 'active'} ms-2`} disabled={currentSong ? false : true} onClick={() => setIsEditing(prev => !prev)}>Edit</button>

            </div>

            <span>
                {currentSong && isEditing ? 
                    `Editing: ${currentSong.title}` 
                    : currentSong ? 
                    currentSong.title : user?.username}
            </span>

            <div>
                <button onClick={() => toggleInputPool()} className="btn btn-primary">{!visible ? 'Open' : 'Close'}</button>
                <button onClick={() => Auth.logout()} className='btn btn-danger ms-2'>Log Out</button>
            </div>
        </nav>
    );
};

export default Nav;