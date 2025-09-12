import { useState } from 'react';
import { Link } from 'react-router-dom'

import SetlistTitle from './SetlistTitle.jsx';
import Tools from './Tools.jsx';

import './index.css';

function Nav() {  
    const [toggleTools, setToggleTools] = useState(false);

    return (
        <nav className="navbar px-2 mx-2 position-relative">
            <span className='navbar-brand me-2 text-light'>MDFlow</span>

            <SetlistTitle />
            <div className='d-flex'>
                <Tools toggleTools={toggleTools} setToggleTools={setToggleTools}/>
                <Link 
                    to="/settings" 
                    className='ms-2 profile fs-6'
                    style={{ textDecoration: "none" }}
                >
                    ML
                </Link>
            </div>
        </nav>
    );
};

export default Nav;