import { useUser } from '../../contexts/UserContext.jsx';
import './index.css';

function Header({ setActivePage }) {
    const { userData } = useUser();
    const username = userData?.username || 'User';

    return (
        <div 
            className="mobile-header d-flex align-items-center justify-content-between px-3 py-2"
            style={{ 
                backgroundColor: 'var(--bg-surface-elevated)', 
                borderBottom: '1px solid var(--border-default)', 
                minHeight: '48px' 
            }}
        >
            <div className="d-flex align-items-center gap-2">
                <div className="brand-icon" style={{ width: '28px', height: '28px', fontSize: '13px' }}>
                    <i className="fa-solid fa-wave-square"></i>
                </div>
                <span className="brand-text" style={{ fontSize: '17px', fontWeight: 700 }}>MDFlow</span>
                <span className="brand-badge">Studio</span>
            </div>

            <button 
                type="button"
                className="btn btn-sm d-flex align-items-center gap-2 p-1 border-0"
                style={{ backgroundColor: 'transparent', touchAction: 'manipulation' }}
                onClick={() => setActivePage?.('Settings')}
                title="Account Settings"
            >
                <div 
                    className="profile d-flex align-items-center justify-content-center fw-bold"
                    style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-primary)',
                        color: '#fff',
                        fontSize: '13px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    {username[0]?.toUpperCase() || 'U'}
                </div>
            </button>
        </div>
    );
};

export default Header;