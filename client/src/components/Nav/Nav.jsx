import Auth from '../../lib/utils/auth.js';

import { useToggleVisible } from '../../contexts/ToggleVisibleContext.jsx';
import { useSongData } from '../../contexts/SongDataContext.jsx';
import { useCurrentSong } from '../../contexts/CurrentSongContext.jsx';

import { useUpdateTitle } from '../../lib/constants.js';

import '../../index.css';
import './Nav.css';

function Nav() {  
    const { visible, toggleVisible } = useToggleVisible();
    const { songData } = useSongData();
    const { currentSong } = useCurrentSong();
    const handleInputChange = useUpdateTitle();

    return (
        <nav className="navbar px-2 mx-2 temp-bg">
            <div className='d-flex'>
                <span className='navbar-brand me-2 text-light'>MDFlow</span>
                <div class="dropend">
                    <button class="btn text-light dropdown-toggle tools" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Tools
                    </button>
                    <ul class="dropdown-menu">
                        <button className='dropdown-item d-flex align-items-center justify-content-between' onClick={() => toggleVisible('sidebar')}>
                            <span className={`${visible.sidebar ? 'current' : ''}`}>Sidebar</span>
                            <i class={`fa-solid fa-toggle-${visible.sidebar ? 'on current' : 'off'}`}></i>
                        </button>
                        <button class="dropdown-item d-flex align-items-center justify-content-between" onClick={() => toggleVisible('inputPool')}>
                            <span className={`${visible.inputPool ? 'current' : ''}`}>Inputs</span>
                            <i class={`fa-solid fa-toggle-${visible.inputPool ? 'on current' : 'off'}`}></i>
                        </button>
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
            <button onClick={() => Auth.logout()} className='btn btn-danger ms-2'>Log Out</button>
        </nav>
    );
};

export default Nav;