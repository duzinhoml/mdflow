import { useState, useEffect } from "react";
import { useSectionNoteCreator } from "../../lib/constants";

import './index.css';

function CurrentTab({ currentTab, screenWidth }) {
    const [openSection, setOpenSection] = useState({
        state: false,
        section: null
    });

    useEffect(() => setOpenSection({ state: false, section: null }), [currentTab]);

    const handleOpenSection = (child) => {
        if (openSection.section?.label === child.label) setOpenSection({ state: false, section: null });
        else setOpenSection({ state: true, section: child });
    }

    const handleInputSelection = useSectionNoteCreator();

    return (
        <div className="collapse" id={`collapseExample${currentTab?.id}`}>
            <div className={`p-2 m-0 pt-0 row`}>
                {currentTab?.children.map(child => (
                    <button 
                        key={child.label} 
                        type="submit"
                        className={`btn inputs m-1 flex-grow-1 col-${currentTab?.id === 3 ? '2' : '3'}`}
                        style={{
                            color: child.color,
                            borderColor: child.color,
                            fontSize: screenWidth >= 768 ? '20px' : '16px'
                        }}
                        onClick={() => { 
                            if (currentTab?.id !== 3) handleInputSelection(currentTab, child); 
                            handleOpenSection(child);
                        }}
                    >
                        {child.label}
                    </button>
                ))}
            </div>

            {(openSection.state && currentTab?.id === 3) && (
                <div className="p-2 m-0 pt-0 row">
                    {currentTab?.children.map(child => (
                        (openSection.section?.label === child.label) && (
                            child.children?.map(grandChild => (
                                <button 
                                    key={grandChild.label} 
                                    type="submit"
                                    className={`btn inputs m-1 col-${currentTab?.id === 3 ? '2' : '3'}`}
                                    style={{
                                        color: grandChild.color,
                                        borderColor: grandChild.color,
                                        fontSize: screenWidth >= 768 ? '20px' : '16px',
                                        textShadow: '2px 2px 4px black'
                                    }}
                                    onClick={() => handleInputSelection(currentTab, grandChild)}
                                >
                                    {grandChild.label}
                                </button>
                            ))
                        )
                    ))}
                </div>
            )}

        </div>
    );
};

export default CurrentTab;