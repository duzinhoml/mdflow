import { useState } from 'react';

import Auth from '../../lib/utils/auth.js';

import UpdatePassword from '../Selection/UpdatePassword.jsx';
import DeleteUser from '../Selection/DeleteUser.jsx';

import './index.css';

function Options() {
    const [option, setOption] = useState("update");

    return (
        <div className="settings-layout-wrapper d-flex flex-grow-1 overflow-hidden w-100">
            <div className="settings-nav-sidebar d-flex flex-column">
                <button 
                    className={`btn d-flex align-items-center rounded-2 mx-4 mt-3 py-2 options ${option === "update" && "current"}`}
                    onClick={() => setOption("update")}
                >
                    <i className="fa-solid fa-lock me-2"></i>
                    Change Password
                </button>
                <button 
                    className={`btn d-flex align-items-center rounded-2 mx-4 mt-3 py-2 options ${option === "delete" && "current"}`}
                    onClick={() => setOption("delete")}
                >
                    <i className="fa-solid fa-user me-2"></i>
                    Delete Account
                </button>

                <hr className="mx-2" style={{ color: 'hsl(0, 0.00%, 100%)' }} />

                <button className="btn d-flex align-items-center rounded-2 mx-4 mt-3 py-2 log-out" onClick={() => Auth.logout()}>
                    <i className="fa-solid fa-right-from-bracket me-2"></i>
                    Log Out
                </button>
            </div>

            <div className="settings-content-pane flex-grow-1 overflow-y-auto">
                {option === "update" 
                    ? <UpdatePassword />
                    : <DeleteUser />}
            </div>
        </div>
    );
};

export default Options;