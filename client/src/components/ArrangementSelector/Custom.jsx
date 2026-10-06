import { useState } from 'react';
import { useSectionNoteCreator } from '../../lib/constants';
import { useSong } from '../../contexts/SongContext';

import './index.css';

const PRESET_COLORS = [
    '#61a6ae', '#7c79be', '#cdab4c', '#b75c52', 
    '#d16a33', '#8ab950', '#b1727b', '#64a07c', 
    '#7c4dff', '#ef4444', '#f59e0b', '#06b6d4'
];

function Custom() {
    const [creationFormData, setCreationFormData] = useState({
        type: "Section",
        label: "",
        color: "#7c4dff"
    });

    const { currentSection } = useSong();
    const { handleCreateSelection } = useSectionNoteCreator();

    const handleSelectType = (type) => setCreationFormData(prev => ({ ...prev, type }));

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCreationFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFormSubmit = (e) => {
        e?.preventDefault?.();
        if (!creationFormData.label.trim()) return;

        if (creationFormData.type === "Note" && !currentSection) {
            alert("Please select a section card first before adding a note.");
            return;
        }

        handleCreateSelection(creationFormData);
        setCreationFormData(prev => ({
            ...prev,
            label: ""
        }));
    };

    return (
        <div className="custom-creator-box">
            {/* Type Switcher */}
            <div className="custom-type-switcher d-flex align-items-center justify-content-between mb-3">
                <span className="text-secondary fw-semibold" style={{ fontSize: '13px' }}>
                    Create Custom Element:
                </span>
                <div className="d-flex gap-2">
                    <button 
                        type="button"
                        className={`custom-type-pill ${creationFormData.type === "Section" ? "current" : ""}`}
                        onClick={() => handleSelectType("Section")}
                    >
                        <i className="fa-solid fa-layer-group me-1"></i> Section
                    </button>
                    <button 
                        type="button"
                        className={`custom-type-pill ${creationFormData.type === "Note" ? "current" : ""}`}
                        onClick={() => handleSelectType("Note")}
                    >
                        <i className="fa-solid fa-music me-1"></i> Note / Detail
                    </button>
                </div>
            </div>

            {/* Form & Live Preview */}
            <form onSubmit={handleFormSubmit} className="d-flex flex-column gap-3">
                <div className="d-flex flex-wrap align-items-center gap-3">
                    <input 
                        type="text" 
                        name="label" 
                        value={creationFormData.label}
                        className="custom-input flex-grow-1" 
                        onChange={handleInputChange} 
                        placeholder={creationFormData.type === "Section" ? "e.g. Instrumental Solo, Chorus 2..." : "e.g. Acoustic 12-String, Big Drop..."}
                        autoComplete="off"
                        autoFocus
                    />

                    {creationFormData.type === "Section" && (
                        <div className="d-flex align-items-center gap-1">
                            {PRESET_COLORS.map(c => (
                                <span 
                                    key={c}
                                    className={`color-swatch ${creationFormData.color === c ? 'selected' : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setCreationFormData(prev => ({ ...prev, color: c }))}
                                    title={c}
                                ></span>
                            ))}
                            <input 
                                type="color" 
                                name="color"
                                value={creationFormData.color}
                                className="colorInput ms-1"
                                style={{ width: '28px', height: '28px', borderRadius: '50%', padding: '0', cursor: 'pointer', border: 'none' }}
                                onChange={handleInputChange}
                                title="Custom Color Picker"
                            />
                        </div>
                    )}
                </div>

                {/* Live Preview & Add Button */}
                <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-10">
                    <div className="d-flex align-items-center gap-2">
                        <span className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Preview:</span>
                        {creationFormData.type === "Section" ? (
                            <span 
                                className="section-pill"
                                style={{ backgroundColor: creationFormData.color || '#7c4dff', color: '#fff' }}
                            >
                                {creationFormData.label.trim() || "Untitled Section"}
                            </span>
                        ) : (
                            <span className="note-chip chip-instrument">
                                <i className="fa-solid fa-music text-info me-1"></i>
                                {creationFormData.label.trim() || "Untitled Note"}
                            </span>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-sm text-light fw-medium d-flex align-items-center gap-2"
                        style={{
                            backgroundColor: 'var(--accent-primary)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '6px 16px',
                            opacity: creationFormData.label.trim() ? 1 : 0.6
                        }}
                        disabled={!creationFormData.label.trim()}
                    >
                        <i className="fa-solid fa-plus"></i>
                        <span>Add {creationFormData.type}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Custom;