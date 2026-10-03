import './index.css';

function Header() {
    return (
        <div className="mobile-header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
                <div className="brand-icon" style={{ width: '28px', height: '28px', fontSize: '13px' }}>
                    <i className="fa-solid fa-wave-square"></i>
                </div>
                <span className="brand-text" style={{ fontSize: '18px' }}>MDFlow</span>
                <span className="brand-badge">Studio</span>
            </div>
        </div>
    );
};

export default Header;