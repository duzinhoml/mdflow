import { useState } from "react";
import { useToggleVisible } from '../../contexts/ToggleVisibleContext.jsx';
import { useSong } from '../../contexts/SongContext.jsx';
import { INPUT_POOL } from '../../lib/constants.js';

import Tabs from "./Tabs.jsx";
import CurrentTab from "./CurrentTab.jsx";
import './index.css';

function ArrangementSelector() {
    const [currentTab, setCurrentTab] = useState(INPUT_POOL[0]);
    const { visible, toggleVisible } = useToggleVisible();
    const { currentSection, setCurrentSection } = useSong();

    return (
        <div className={`selector ${visible.selector ? 'show' : 'hide'}`}>
            {/* Target Section Banner & Quick Close */}
            <div className={`palette-target-banner ${currentSection ? 'active' : 'idle'}`}>
                <div className="d-flex align-items-center gap-2 text-truncate">
                    {currentSection ? (
                        <>
                            <i className="fa-solid fa-sliders text-primary"></i>
                            <span>Target Section:</span>
                            <span 
                                className="target-badge"
                                style={{ backgroundColor: currentSection.color || '#7c4dff' }}
                            >
                                {currentSection.label}
                            </span>
                            <span className="text-secondary d-none d-md-inline" style={{ fontSize: '12px' }}>
                                — Click any dynamic or instrument below to attach
                            </span>
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-circle-info text-muted"></i>
                            <span>Arrangement Palette:</span>
                            <span className="text-muted d-none d-sm-inline" style={{ fontSize: '12px' }}>
                                Click a section below to append to your song, or click a section card above to add details
                            </span>
                        </>
                    )}
                </div>

                <div className="d-flex align-items-center gap-2">
                    {currentSection && (
                        <button 
                            type="button"
                            className="btn btn-sm text-secondary p-0 px-2"
                            style={{ fontSize: '12px' }}
                            onClick={() => setCurrentSection(null)}
                            title="Deselect section"
                        >
                            <i className="fa-solid fa-xmark me-1"></i> Deselect
                        </button>
                    )}

                    <button 
                        type="button"
                        className="btn btn-sm text-muted p-1"
                        onClick={() => toggleVisible('selector')}
                        title="Close arrangement palette"
                    >
                        <i className="fa-solid fa-chevron-down"></i>
                    </button>
                </div>
            </div>

            {/* Segmented Category Tabs */}
            <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />

            {/* Active Category Content */}
            <CurrentTab currentTab={currentTab} />
        </div>
    );
};

export default ArrangementSelector;