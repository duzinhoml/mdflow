import { useToggleVisible } from "../../../contexts/ToggleVisibleContext";

import SearchBar from "../../../components/Sidebar/SearchBar";
import List from "./List.jsx";

import './index.css';

function MusicSelector() {
    const { visible } = useToggleVisible();

    return (
        <div 
            className={`d-flex flex-column overflow-hidden music ${visible.sidebar ? 'show' : 'hide'}`}
        >
            <SearchBar />
            <hr className="mb-1" style={{ border: '2px solid hsl(235, 13%, 52%)' }}/>
            <List />
        </div>
    );
}

export default MusicSelector;