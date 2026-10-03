import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext.jsx';

import Tools from './Tools.jsx';
import './index.css';

function Nav() {  
    const { userData } = useUser();

    return (
        <nav className="topbar-nav">
            {/* Brand Logo & Name */}
            <Link to="/" className="brand-container">
                <div className="brand-icon">
                    <i className="fa-solid fa-wave-square"></i>
                </div>
                <div className="d-flex align-items-center">
                    <span className="brand-text">MDFlow</span>
                    <span className="brand-badge d-none d-sm-inline">Studio</span>
                </div>
            </Link>

            {/* Right Controls: Workspace Toggles & Profile Avatar */}
            <div className='d-flex align-items-center gap-2'>
                <Tools />
                
                <Link 
                    to="/settings" 
                    className='profile ms-1'
                    title={userData ? `Account Settings: ${userData.firstName} ${userData.lastName}` : "Settings"}
                >
                    {userData?.firstName ? userData.firstName.slice(0, 1) : "U"}
                    {userData?.lastName ? userData.lastName.slice(0, 1) : ""}
                </Link>
            </div>
        </nav>
    );
};

export default Nav;