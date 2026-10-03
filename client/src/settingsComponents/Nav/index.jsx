import { Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import './index.css';

function Nav() {
    const { userData } = useUser();

    return (
        <nav className="topbar-nav">
            <Link to="/" className="brand-container">
                <div className="brand-icon">
                    <i className="fa-solid fa-wave-square"></i>
                </div>
                <div className="d-flex align-items-center">
                    <span className="brand-text">MDFlow</span>
                    <span className="brand-badge d-none d-sm-inline">Settings</span>
                </div>
            </Link>

            <div className="d-flex align-items-center gap-2">
                <i className="fa-solid fa-user-circle text-primary"></i>
                <span className="text-light fw-medium" style={{ fontSize: '14px' }}>
                    {userData ? `${userData.firstName} ${userData.lastName}` : "Account"}
                </span>
                {userData?.username && (
                    <span className="badge bg-dark bg-opacity-50 text-muted" style={{ fontSize: '11px' }}>
                        @{userData.username}
                    </span>
                )}
            </div>
            
            <div className='d-flex align-items-center'>
                <Link 
                    to="/" 
                    className='nav-toggle-btn active'
                    style={{ textDecoration: "none" }}
                    title="Return to Workspace"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Workspace</span>
                </Link>
            </div>
        </nav>
    ); 
};

export default Nav;