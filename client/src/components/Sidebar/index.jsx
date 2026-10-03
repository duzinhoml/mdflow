import { useToggleVisible } from "../../contexts/ToggleVisibleContext.jsx";

import SearchBar from "./SearchBar.jsx";
import List from "./List.jsx";
import './index.css';

function Sidebar() {
    const { visible, toggleVisible } = useToggleVisible();

    return (
        <div 
            className={`position-absolute end-0 top-0 d-flex flex-column overflow-hidden sidebar ${visible.sidebar ? 'show' : 'hide'}`}
            style={{ height: '100%', zIndex: 100 }}
        >
            {/* Header with Title and Close Button */}
            <div className="sidebar-header">
                <div className="sidebar-title">
                    <i className="fa-solid fa-folder-open text-primary"></i>
                    <span>Library Browser</span>
                </div>
                <button 
                    type="button"
                    className="btn btn-sm text-muted p-1"
                    onClick={() => toggleVisible('sidebar')}
                    title="Close sidebar"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            {/* Quick Search */}
            <SearchBar />

            {/* Tabbed List (Setlists / Songs) */}
            <List />
        </div>
    );
};

export default Sidebar;