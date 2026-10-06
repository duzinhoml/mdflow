import { useState } from 'react';
import { useSectionNoteCreator } from '../../lib/constants';
import { useSong } from '../../contexts/SongContext';

import DraggablePaletteItem from './DraggablePaletteItem.jsx';
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
        color: "#7c4dff",
        repeats: 1
    });

    const { currentSection } = useSong();
    const { handleCreateSelection } = useSectionNoteCreator();

    const isNoteWithoutSection = creationFormData.type === "Note" && !currentSection;

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
        if (isNoteWithoutSection) return;

        const submissionData = {
            ...creationFormData,
            label: creationFormData.type === "Section" && creationFormData.repeats > 1
                ? `${creationFormData.label.trim()} (${creationFormData.repeats}x)`
                : creationFormData.label.trim()
        };

        handleCreateSelection(submissionData);
        setCreationFormData(prev => ({
            ...prev,
            label: ""
        }));
    };

    const canSubmit = creationFormData.label.trim() && !isNoteWithoutSection;

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
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            {/* Repetition Stepper/Selector */}
                            <div className="d-flex align-items-center gap-1 bg-dark bg-opacity-50 px-2 py-1 rounded border border-secondary border-opacity-25" title="Section repetitions">
                                <span className="text-muted me-1" style={{ fontSize: '11px' }}>Repeats:</span>
                                {[1, 2, 3, 4].map(num => (
                                    <button
                                        key={num}
                                        type="button"
                                        className={`btn btn-sm py-0 px-2 fw-semibold ${creationFormData.repeats === num ? 'btn-primary' : 'btn-outline-secondary text-light'}`}
                                        style={{ fontSize: '11px', borderRadius: '4px', minWidth: '26px' }}
                                        onClick={() => setCreationFormData(prev => ({ ...prev, repeats: num }))}
                                    >
                                        {num}x
                                    </button>
                                ))}
                            </div>

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
                        </div>
                    )}
                </div>

                {/* Inline Section Required Warning for Custom Notes */}
                {isNoteWithoutSection && (
                    <div 
                        className="d-flex align-items-center gap-2 px-3 py-2 rounded-2" 
                        style={{ 
                            fontSize: '12px', 
                            color: '#fbbf24', 
                            backgroundColor: 'rgba(245, 158, 11, 0.12)', 
                            border: '1px solid rgba(245, 158, 11, 0.25)' 
                        }}
                    >
                        <i className="fa-solid fa-circle-exclamation flex-shrink-0"></i>
                        <span>A section card must be selected in the arrangement before adding a note.</span>
                    </div>
                )}

                {/* Live Preview & Add Button */}
                <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-10">
                    <div className="d-flex align-items-center gap-2">
                        <span className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Preview:</span>
                        {creationFormData.label.trim() ? (
                            <DraggablePaletteItem
                                type={creationFormData.type === "Section" ? "section" : "instrument"}
                                item={{
                                    label: creationFormData.type === "Section" && creationFormData.repeats > 1
                                        ? `${creationFormData.label.trim()} (${creationFormData.repeats}x)`
                                        : creationFormData.label.trim(),
                                    color: creationFormData.color || '#7c4dff'
                                }}
                                className="btn p-0 border-0 bg-transparent"
                                onClick={canSubmit ? handleFormSubmit : undefined}
                                title={canSubmit ? "Tap or drag into song" : "Select a section card first"}
                            >
                                {creationFormData.type === "Section" ? (
                                    <span 
                                        className="section-pill"
                                        style={{ backgroundColor: creationFormData.color || '#7c4dff', color: '#fff' }}
                                    >
                                        {creationFormData.label.trim()}
                                        {creationFormData.repeats > 1 && (
                                            <span className="ms-1 opacity-75 fw-normal" style={{ fontSize: '10px' }}>
                                                ({creationFormData.repeats}x)
                                            </span>
                                        )}
                                    </span>
                                ) : (
                                    <span className="note-chip chip-instrument">
                                        <i className="fa-solid fa-music text-info me-1"></i>
                                        {creationFormData.label.trim()}
                                    </span>
                                )}
                            </DraggablePaletteItem>
                        ) : (
                            creationFormData.type === "Section" ? (
                                <span 
                                    className="section-pill"
                                    style={{ backgroundColor: creationFormData.color || '#7c4dff', color: '#fff', opacity: 0.6 }}
                                >
                                    Untitled Section
                                </span>
                            ) : (
                                <span className="note-chip chip-instrument" style={{ opacity: 0.6 }}>
                                    <i className="fa-solid fa-music text-info me-1"></i>
                                    Untitled Note
                                </span>
                            )
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-sm text-light fw-medium d-flex align-items-center gap-2"
                        style={{
                            backgroundColor: canSubmit ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '6px 16px',
                            cursor: canSubmit ? 'pointer' : 'not-allowed',
                            opacity: canSubmit ? 1 : 0.5
                        }}
                        disabled={!canSubmit}
                        title={isNoteWithoutSection ? "Select a section card to attach note" : undefined}
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