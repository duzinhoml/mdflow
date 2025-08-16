import { useState } from 'react';

import Auth from '../../lib/utils/auth.js';

import { useToggleVisible } from '../../contexts/ToggleVisibleContext.jsx';

import SongTitle from './SongTitle.jsx';

import './index.css';
import '../../index.css';

function Nav() {  
    const [toggleTools, setToggleTools] = useState(false);
    const { visible, toggleVisible } = useToggleVisible();

    return (
        <nav className="navbar px-2 mx-2 temp-bg position-relative">
            <span className='navbar-brand me-2 text-light'>MDFlow</span>

            <SongTitle />
            <div className='d-flex'>

                {/* Tools */}
                <div className="d-flex gap-2">
                    <div className={`d-flex gap-1 tools ${visible.tools ? 'show' : 'hide'}`}>
                        <button className="btn d-flex gap-1 align-items-center justify-content-between" onClick={() => toggleVisible('selector')}>
                            <span className={`${visible.selector ? 'current' : ''}`}>Arrangement</span>
                            <i className={`fa-solid fa-toggle-${visible.selector ? 'on current show' : 'off hide'}`}></i>
                        </button>
                        <button className='btn d-flex gap-1 align-items-center justify-content-between' onClick={() => toggleVisible('sidebar')}>
                            <span className={`${visible.sidebar ? 'current' : ''}`}>Sidebar</span>
                            <i className={`fa-solid fa-toggle-${visible.sidebar ? 'on current show' : 'off hide'}`}></i>
                        </button>
                    </div>

                    <button className={`btn text-light tools-btn ${toggleTools && 'toggled'}`} onClick={() => { toggleVisible('tools'); setToggleTools(prev => !prev)}}>
                        Tools
                        <i className="fa-solid fa-screwdriver-wrench ms-1"></i>
                    </button>
                    
                </div>

                <button onClick={() => Auth.logout()} className='btn btn-danger ms-2'>Log Out</button>
            </div>
        </nav>
    );
};

export default Nav;