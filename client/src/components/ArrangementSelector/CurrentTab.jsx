import { useState, useEffect } from "react";
import { useWindowResize, useSectionNoteCreator } from "../../lib/constants";

import Custom from "./Custom.jsx";

import './index.css';

function CurrentTab({ currentTab }) {
    const [openSection, setOpenSection] = useState({
        state: false,
        section: null
    });
    const [openInstrument, setOpenInstrument]= useState(null);
    const { screenWidth } = useWindowResize();

    useEffect(() => setOpenSection({ state: false, section: null }), [currentTab]);

    const handleOpenInstrument = (instrument) => {
        if (openInstrument?.label === instrument.label) setOpenInstrument(null)
        else setOpenInstrument(instrument)
    }

    const handleOpenSection = (child) => {
        if (openSection.section?.label === child.label) setOpenSection({ state: false, section: null });
        else setOpenSection({ state: true, section: child });

        if (currentTab?.id === 3) handleOpenInstrument(child)
    }

    const { handleInputSelection } = useSectionNoteCreator();

    return (
        <div className="collapse" id={`collapseExample${currentTab?.id}`}>
            <div className={`mb-3 mx-3 m-0 pt-0 row justify-content-center`}>
                {currentTab?.id === 4 && <Custom/>}
                {currentTab?.children?.map(child => (
                    <button 
                        key={child.label} 
                        type="submit"
                        className={`btn inputs m-1 flex-grow-1 col-lg-${currentTab?.id === 3 ? '2' : '3'} col-${currentTab?.id === 3 ? '4' : '3'}`}
                        style={{
                            color: child.color || 'hsl(213, 18%, 88%)',
                            borderColor: child.color || 'hsl(235, 13%, 20%)',
                            boxShadow: `0px 0px 2px 1px ${child.color || 'hsl(235, 10%, 15%)'}`,
                            fontSize: screenWidth >= 768 ? '20px' : '16px'
                        }}
                        onClick={() => { 
                            if (currentTab?.id !== 3) handleInputSelection(currentTab, child); 
                            handleOpenSection(child);
                        }}
                    >
                        {child.label}
                        {currentTab?.id === 3 && <i className={`fa-solid fa-caret-${openInstrument?.label === child.label ? "up" : "down"} ms-2`}></i>}
                    </button>
                ))}
            </div>

            {(openSection.state && currentTab?.id === 3) && (
                <div className="mx-3 mb-2 pt-0 row">
                    {currentTab?.children.map(child => (
                        (openSection.section?.label === child.label) && (
                            child.children?.map(grandChild => (
                                <button 
                                    key={grandChild.label} 
                                    type="submit"
                                    className={`btn text-light flex-lg-grow-0 flex-grow-1 sub-inputs m-1 col-lg-${currentTab?.id === 3 ? '2' : '3'} col-${currentTab?.id === 3 ? '3' : '3'}`}
                                    style={{ fontSize: screenWidth >= 768 ? '20px' : '16px' }}
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