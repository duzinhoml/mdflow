import { useToggleVisible } from '../../contexts/ToggleVisibleContext';

import './index.css';

function Footer({ activePage, setActivePage }) {
    const { setVisible, toggleVisible } = useToggleVisible();

    const toggleTools = () => {
        if (activePage === "Tools") {
            setActivePage("Home");
            setVisible({ tools: false, selector: false, sidebar: false })
        }
        else setActivePage("Tools")
    }

    const handlePageSelection = (page) => {
        if (page === 1) activePage === "Tools" ? toggleVisible("selector") : setActivePage("Home")
        else activePage === "Tools" ? toggleVisible("sidebar") : setActivePage("Settings")
    }


    return (
        <div className="d-flex justify-content-center gap-5 footer py-2 foot-labels">
            <button 
                className={`btn btn-lg ${activePage === "Home" && "current"}`} 
                onClick={() => handlePageSelection(1)}
            >
                <i className={`fa-solid fa-${activePage === "Tools" ? "stream" : "house"}`}></i>
            </button>

            <button className={`btn btn-lg ${activePage === "Tools" && "current"}`} onClick={toggleTools}>
                <i className="fa-solid fa-screwdriver-wrench"></i>
            </button>

            <button 
                className={`btn btn-lg ${activePage === "Settings" && "current"}`} 
                onClick={() => handlePageSelection(2)}
            >
                <i className={`fa-solid fa-${activePage === "Tools" ? "music" : "gear"}`}></i>
            </button>
        </div>
    );
};

export default Footer;