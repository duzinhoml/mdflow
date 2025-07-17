import Auth from '../lib/utils/auth.js';

import { useUser } from '../contexts/UserContext.jsx';
import { useCurrentSong } from '../contexts/CurrentSongContext.jsx';

import { useToggleInputPool } from '../contexts/ToggleInputPoolContext.jsx';

function Nav() {
    const { user } = useUser();
    const { currentSong, handleSetCurrentSong } = useCurrentSong();

    const { visible, toggleInputPool } = useToggleInputPool();

    return (
        <nav className="navbar bg-warning-subtle px-2">
            <div className='d-flex'>
                <span className='navbar-brand'>MDFlow</span>
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

            <span>{currentSong ? currentSong.title : user?.username}</span>

            <div>
                <button onClick={() => toggleInputPool()} className="btn btn-primary">{!visible ? 'Open' : 'Close'}</button>
                <button onClick={() => Auth.logout()} className='btn btn-danger ms-2'>Log Out</button>
            </div>
        </nav>
    );
};

export default Nav;