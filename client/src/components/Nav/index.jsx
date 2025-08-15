import Auth from '../../lib/utils/auth.js';

import { useToggleVisible } from '../../contexts/ToggleVisibleContext.jsx';

import SongTitle from './SongTitle.jsx';

import './index.css';
import '../../index.css';

function Nav() {  
    const { visible, toggleVisible } = useToggleVisible();

    return (
        <nav className="navbar px-2 mx-2 temp-bg position-relative">
            <div className='d-flex'>
                <span className='navbar-brand me-2 text-light'>MDFlow</span>

                {/* Tools */}
                <div className="d-flex gap-2">
                    <button className='btn text-light tools-btn' onClick={() => toggleVisible('tools')}>
                        Tools
                        <i className="fa-solid fa-screwdriver-wrench ms-1"></i>
                    </button>
                    
                    <div className={`d-flex gap-1 tools ${visible.tools ? 'show' : 'hide'}`}>
                        <button className='btn d-flex gap-1 align-items-center justify-content-between' onClick={() => toggleVisible('sidebar')}>
                            <span className={`${visible.sidebar ? 'current' : ''}`}>Sidebar</span>
                            <i className={`fa-solid fa-toggle-${visible.sidebar ? 'on current show' : 'off hide'}`}></i>
                        </button>
                        <button className="btn d-flex gap-1 align-items-center justify-content-between" onClick={() => toggleVisible('selector')}>
                            <span className={`${visible.selector ? 'current' : ''}`}>Inputs</span>
                            <i className={`fa-solid fa-toggle-${visible.selector ? 'on current show' : 'off hide'}`}></i>
                        </button>
                    </div>
                </div>
            </div>

            <SongTitle />
            <button onClick={() => Auth.logout()} className='btn btn-danger ms-2'>Log Out</button>
        </nav>
    );
};

export default Nav;