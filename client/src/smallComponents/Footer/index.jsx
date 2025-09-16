import { useState } from 'react';
import { useToggleVisible } from '../../contexts/ToggleVisibleContext';

import './index.css';

function Footer({ activePage, setActivePage }) {
    const toggleTools = () => {
        if (activePage === "Tools") setActivePage("Home")
        else setActivePage("Tools")
    }

    const { toggleVisible } = useToggleVisible();

    return (
        <div className="d-flex justify-content-center gap-5 footer py-2 foot-labels">
            <button 
                className={`btn btn-lg ${activePage === "Home" && "current"}`} 
                // onClick={() => setActivePage("Home")}
                onClick={() => toggleVisible("selector")}
            >
                <i className={`fa-solid fa-${activePage === "Tools" ? "stream" : "house"}`}></i>
            </button>
            <button className={`btn btn-lg ${activePage === "Tools" && "current"}`} onClick={toggleTools}>
                <i className="fa-solid fa-screwdriver-wrench"></i>
            </button>
            <button 
                className={`btn btn-lg ${activePage === "Settings" && "current"}`} 
                // onClick={() => setActivePage("Settings")}
                onClick={() => toggleVisible("sidebar")}
            >
                <i className={`fa-solid fa-${activePage === "Tools" ? "music" : "gear"}`}></i>
            </button>
        </div>
    );
};

export default Footer;