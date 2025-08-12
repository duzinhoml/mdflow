import { useToggleVisible } from "../../contexts/ToggleVisibleContext.jsx";

import SearchBar from "./SearchBar.jsx";
import List from "./List.jsx";

function Sidebar() {
    const { visible } = useToggleVisible();

    return (
        visible.sidebar && 
            <div 
                className='bg-secondary position-absolute end-0 d-flex flex-column overflow-hidden' 
                style={{ width: '25vw', height: 'calc(100% - 60px)', borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px', zIndex: 1 }}
            >
                <SearchBar />
                <hr className="mb-1" style={{ border: '2px solid black' }}/>
                <List />
            </div>
    );
};

export default Sidebar;