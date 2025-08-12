import Auth from '../../lib/utils/auth.js';

import { useToggleVisible } from '../../contexts/ToggleVisibleContext.jsx';

import SongTitle from './SongTitle.jsx';

import './index.css';
import '../../index.css';

function Nav() {  
    const { visible, toggleVisible } = useToggleVisible();

    return (
        <nav className="navbar px-2 mx-2 temp-bg">
            <div className='d-flex'>
                <span className='navbar-brand me-2 text-light'>MDFlow</span>
                <div className="dropend">
                    <button className="btn text-light dropdown-toggle tools" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Tools
                    </button>
                    <ul className="dropdown-menu">
                        <button className='dropdown-item d-flex align-items-center justify-content-between' onClick={() => toggleVisible('sidebar')}>
                            <span className={`${visible.sidebar ? 'current' : ''}`}>Sidebar</span>
                            <i className={`fa-solid fa-toggle-${visible.sidebar ? 'on current' : 'off'}`}></i>
                        </button>
                        <button className="dropdown-item d-flex align-items-center justify-content-between" onClick={() => toggleVisible('selector')}>
                            <span className={`${visible.selector ? 'current' : ''}`}>Inputs</span>
                            <i className={`fa-solid fa-toggle-${visible.selector ? 'on current' : 'off'}`}></i>
                        </button>
                    </ul>
                </div>
            </div>

            <SongTitle />
            <button onClick={() => Auth.logout()} className='btn btn-danger ms-2'>Log Out</button>
        </nav>
    );
};

export default Nav;