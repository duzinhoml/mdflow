import Auth from '../../../lib/utils/auth.js';

import '../../../settingsComponents/Options/index.css';

function Options({ setOption }) {

    return (
        <>
            <div className="d-flex flex-column h-100">
                <button 
                    className={`btn d-flex align-items-center rounded-2 mx-4 mt-3 py-2 options`}
                    onClick={() => setOption("update")}
                >
                    <i className="fa-solid fa-lock me-2"></i>
                    Change Password
                </button>
                <button 
                    className={`btn d-flex align-items-center rounded-2 mx-4 mt-3 py-2 options`}
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
        </>

    );
}

export default Options;