import { useToggleVisible } from '../../contexts/ToggleVisibleContext.jsx';
import './index.css';

function Footer({ activePage, setActivePage }) {
    const { visible, toggleVisible, setVisible } = useToggleVisible();

    const handleNav = (target) => {
        if (target === 'arranger') {
            setActivePage('Home');
            setVisible(prev => ({ ...prev, selector: false, sidebar: false }));
        } else if (target === 'palette') {
            if (activePage !== 'Home') setActivePage('Home');
            toggleVisible('selector');
        } else if (target === 'library') {
            if (activePage !== 'Home') setActivePage('Home');
            toggleVisible('sidebar');
        } else if (target === 'settings') {
            setActivePage('Settings');
            setVisible(prev => ({ ...prev, selector: false, sidebar: false }));
        }
    };

    return (
        <nav 
            className="mobile-bottom-nav d-flex align-items-center justify-content-around py-1 px-2"
            role="navigation"
            aria-label="Mobile Navigation"
        >
            {/* 1. Arranger / Timeline Tab */}
            <button
                type="button"
                className={`mobile-nav-item ${activePage === 'Home' && !visible.selector && !visible.sidebar ? 'active' : ''}`}
                onClick={() => handleNav('arranger')}
                title="Song Arranger"
            >
                <i className="fa-solid fa-layer-group mobile-nav-icon"></i>
                <span className="mobile-nav-label">Arranger</span>
            </button>

            {/* 2. Palette Tab */}
            <button
                type="button"
                className={`mobile-nav-item ${visible.selector ? 'active' : ''}`}
                onClick={() => handleNav('palette')}
                title="Arrangement Palette"
            >
                <i className="fa-solid fa-shapes mobile-nav-icon"></i>
                <span className="mobile-nav-label">Palette</span>
            </button>

            {/* 3. Library Tab */}
            <button
                type="button"
                className={`mobile-nav-item ${visible.sidebar ? 'active' : ''}`}
                onClick={() => handleNav('library')}
                title="Setlist & Song Library"
            >
                <i className="fa-solid fa-folder-open mobile-nav-icon"></i>
                <span className="mobile-nav-label">Library</span>
            </button>

            {/* 4. Settings Tab */}
            <button
                type="button"
                className={`mobile-nav-item ${activePage === 'Settings' ? 'active' : ''}`}
                onClick={() => handleNav('settings')}
                title="Account Settings"
            >
                <i className="fa-solid fa-gear mobile-nav-icon"></i>
                <span className="mobile-nav-label">Settings</span>
            </button>
        </nav>
    );
};

export default Footer;