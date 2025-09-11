import { useToggleVisible } from '../../contexts/ToggleVisibleContext.jsx';

import './index.css';

function Tools({ toggleTools, setToggleTools }) {
    const { visible, toggleVisible } = useToggleVisible();

    return (
        <div className="d-flex gap-2">
            <div className={`d-flex gap-1 tools ${visible.tools ? 'show' : 'hide'}`}>
                <button className="btn d-flex gap-1 align-items-center justify-content-between" onClick={() => toggleVisible('selector')}>
                    <span className={`${visible.selector ? 'current' : ''}`}>Arrangement</span>
                    <i className={`fa-solid fa-toggle-${visible.selector ? 'on current show' : 'off hide'}`}></i>
                </button>
                <button className='btn d-flex gap-1 align-items-center justify-content-between' onClick={() => toggleVisible('sidebar')}>
                    <span className={`${visible.sidebar ? 'current' : ''}`}>Sidebar</span>
                    <i className={`fa-solid fa-toggle-${visible.sidebar ? 'on current show' : 'off hide'}`}></i>
                </button>
            </div>

            <button className={`btn text-light tools-btn ${toggleTools && 'toggled'}`} onClick={() => { toggleVisible('tools'); setToggleTools(prev => !prev)}}>
                Tools
                <i className="fa-solid fa-screwdriver-wrench ms-1"></i>
            </button>
            
        </div>
    );
};

export default Tools;