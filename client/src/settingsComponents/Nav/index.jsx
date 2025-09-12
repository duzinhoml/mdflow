import { Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

import './index.css';

function Nav() {
    const { userData } = useUser();

    return (
        <nav className="navbar px-2 mx-2 ml-bg position-relative">
            <span className='navbar-brand me-2 text-light'>MDFlow</span>
            <span className='text-light position-absolute top-50 start-50 translate-middle'>{userData?.firstName} {userData?.lastName}</span>
            
            <div className='d-flex'>
                <Link 
                    to="/" 
                    className='ms-2 home fs-6'
                    style={{ textDecoration: "none" }}
                >
                    <i className="fa-solid fa-house"></i>
                </Link>
            </div>
        </nav>
    ); 
};

export default Nav;