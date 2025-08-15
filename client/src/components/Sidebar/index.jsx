import { useToggleVisible } from "../../contexts/ToggleVisibleContext.jsx";

import SearchBar from "./SearchBar.jsx";
import List from "./List.jsx";

import './index.css';

function Sidebar() {
    const { visible } = useToggleVisible();

    return (
        <div 
            className={`bg-secondary position-absolute end-0 d-flex flex-column overflow-hidden sidebar ${visible.sidebar ? 'show' : 'hide'}`}
            style={{ width: '25vw', height: 'calc(100% - 60px)', borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px', zIndex: 1 }}
        >
            <SearchBar />
            <hr className="mb-1" style={{ border: '2px solid black' }}/>
            <List />
        </div>
    );
};

export default Sidebar;