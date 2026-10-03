import { useState } from "react";
import { useSectionNoteCreator } from "../../lib/constants";
import { useSong } from "../../contexts/SongContext.jsx";

import Custom from "./Custom.jsx";
import './index.css';

// Dynamic helper for visual levels
const DYNAMIC_LEVELS = {
    'Soft': { bars: 1, color: '#38bdf8', musicalSymbol: 'p' },
    'Low': { bars: 2, color: '#60a5fa', musicalSymbol: 'mp' },
    'Mid': { bars: 3, color: '#f59e0b', musicalSymbol: 'mf' },
    'High': { bars: 4, color: '#f97316', musicalSymbol: 'f' },
    'All in': { bars: 5, color: '#ef4444', musicalSymbol: 'ff' }
};

function CurrentTab({ currentTab }) {
    const { currentSection } = useSong();
    const { handleInputSelection } = useSectionNoteCreator();
    const [warningMsg, setWarningMsg] = useState(null);

    if (!currentTab) return null;

    const onSelectElement = (child) => {
        if (currentTab.id !== 1 && !currentSection) {
            setWarningMsg("Please select a section card above first to attach notes to it.");
            setTimeout(() => setWarningMsg(null), 3000);
            return;
        }

        setWarningMsg(null);
        handleInputSelection(currentTab, child);
    };

    return (
        <div className="palette-content">
            {warningMsg && (
                <div 
                    className="alert alert-warning py-1 px-3 mb-2 text-center d-flex align-items-center justify-content-center gap-2"
                    style={{ fontSize: '12px', borderRadius: 'var(--radius-sm)' }}
                >
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>{warningMsg}</span>
                </div>
            )}

            {/* TAB 1: SECTIONS - Symmetrical balanced grid */}
            {currentTab.id === 1 && (
                <div className="section-palette-grid">
                    {currentTab.children?.map(child => (
                        <button 
                            key={child.label} 
                            type="button"
                            className="section-item-chip"
                            style={{ borderColor: child.color }}
                            onClick={() => onSelectElement(child)}
                            title={`Add ${child.label} section to song`}
                        >
                            <span className="section-dot" style={{ backgroundColor: child.color, color: child.color }}></span>
                            <span>{child.label}</span>
                            <i className="fa-solid fa-plus text-muted ms-auto" style={{ fontSize: '10px' }}></i>
                        </button>
                    ))}
                </div>
            )}

            {/* TAB 2: DYNAMICS - Logical progression softest -> strongest / all-in */}
            {currentTab.id === 2 && (
                <div className="d-flex flex-column align-items-center w-100">
                    {/* Intensity Progression Header */}
                    <div 
                        className="d-flex align-items-center justify-content-between mb-3 px-2 text-muted w-100"
                        style={{ maxWidth: '640px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}
                    >
                        <span className="d-flex align-items-center gap-1">
                            <i className="fa-solid fa-volume-low" style={{ color: '#38bdf8' }}></i>
                            <span>Softest (Piano)</span>
                        </span>
                        
                        <div 
                            className="flex-grow-1 mx-3 rounded-pill" 
                            style={{ 
                                height: '3px', 
                                background: 'linear-gradient(to right, #38bdf8 0%, #60a5fa 25%, #f59e0b 50%, #f97316 75%, #ef4444 100%)',
                                opacity: 0.7
                            }}
                        ></div>

                        <span className="d-flex align-items-center gap-1">
                            <span>Strongest / All In (Forte)</span>
                            <i className="fa-solid fa-volume-high" style={{ color: '#ef4444' }}></i>
                        </span>
                    </div>

                    <div className="d-flex flex-wrap gap-3 justify-content-center">
                        {[...(currentTab.children || [])]
                            .sort((a, b) => {
                                const order = { 'Soft': 1, 'Low': 2, 'Mid': 3, 'High': 4, 'All in': 5 };
                                return (order[a.label] || 99) - (order[b.label] || 99);
                            })
                            .map(child => {
                                const level = DYNAMIC_LEVELS[child.label] || { bars: 3, color: '#f59e0b', musicalSymbol: 'mf' };
                                return (
                                    <button
                                        key={child.label}
                                        type="button"
                                        className="dynamic-item-card"
                                        onClick={() => onSelectElement(child)}
                                        title={`Add dynamic: ${child.label} (${level.musicalSymbol})`}
                                    >
                                        <span className="fw-bold" style={{ color: level.color, fontSize: '16px' }}>
                                            {level.musicalSymbol}
                                        </span>
                                        <span className="text-light fw-medium" style={{ fontSize: '13px' }}>
                                            {child.label}
                                        </span>
                                        <div className="dynamic-meters">
                                            {[1, 2, 3, 4, 5].map(b => (
                                                <div 
                                                    key={b} 
                                                    className={`dynamic-bar ${b <= level.bars ? 'active' : ''}`}
                                                    style={{
                                                        height: `${4 + b * 2}px`,
                                                        backgroundColor: b <= level.bars ? level.color : undefined
                                                    }}
                                                ></div>
                                            ))}
                                        </div>
                                    </button>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* TAB 3: INSTRUMENTS */}
            {currentTab.id === 3 && (
                <div className="row g-2 justify-content-center">
                    {currentTab.children?.map(category => {
                        let catIcon = 'fa-solid fa-music';
                        if (category.label === 'Percussion') catIcon = 'fa-solid fa-drum';
                        else if (category.label === 'Bass') catIcon = 'fa-solid fa-guitar';
                        else if (category.label === 'Guitar') catIcon = 'fa-solid fa-guitar';
                        else if (category.label === 'Keys') catIcon = 'fa-solid fa-keyboard';

                        return (
                            <div key={category.label} className="col-12 col-sm-6 col-lg-3">
                                <div className="instrument-group-card h-100">
                                    <div className="instrument-group-title">
                                        <i className={catIcon} style={{ color: 'var(--color-info)' }}></i>
                                        <span>{category.label}</span>
                                    </div>
                                    <div className="d-flex flex-wrap gap-1">
                                        {category.children?.map(sub => (
                                            <button
                                                key={sub.label}
                                                type="button"
                                                className="sub-instrument-chip flex-grow-1"
                                                onClick={() => onSelectElement(sub)}
                                                title={`Add ${sub.label}`}
                                            >
                                                {sub.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* TAB 4: CUSTOM CREATION */}
            {currentTab.id === 4 && (
                <Custom />
            )}
        </div>
    );
}

export default CurrentTab;