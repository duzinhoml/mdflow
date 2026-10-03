import { useSong } from "../../contexts/SongContext.jsx";
import { INPUT_POOL } from "../../lib/constants.js";

import './index.css';

function Tabs({ currentTab, setCurrentTab }) {
    const { currentSong } = useSong();

    return (
        <div className="palette-tabs-container">
            {INPUT_POOL.map(input => {
                if (input.id === 4 && !currentSong) return null;
                const isCurrent = currentTab?.id === input.id;
                return (
                    <button 
                        key={input.id}
                        type="button"
                        onClick={() => setCurrentTab(input)} 
                        className={`palette-tab-btn ${isCurrent ? 'current' : ''}`}
                    >
                        <i className={input.icon}></i>
                        <span>{input.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default Tabs;