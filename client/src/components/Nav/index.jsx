import { useState } from 'react';

import Auth from '../../lib/utils/auth.js';

import SetlistTitle from './SetlistTitle.jsx';
import Tools from './Tools.jsx';

import './index.css';
import '../../index.css';

function Nav() {  
    const [toggleTools, setToggleTools] = useState(false);

    return (
        <nav className="navbar px-2 mx-2 ml-bg position-relative">
            <span className='navbar-brand me-2 text-light'>MDFlow</span>

            <SetlistTitle />
            <div className='d-flex'>
                <Tools toggleTools={toggleTools} setToggleTools={setToggleTools}/>
                <button onClick={() => Auth.logout()} className='btn btn-danger ms-2'>Log Out</button>
            </div>
        </nav>
    );
};

export default Nav;