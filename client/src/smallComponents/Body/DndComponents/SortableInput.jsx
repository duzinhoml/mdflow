import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

import { useDelete, useDeleteNote } from "../../../lib/constants.js";
import { useSong } from "../../../contexts/SongContext.jsx";
import { getNoteMetadata } from "../../../dndComponents/SortableInput.jsx";

import './index.css';

function SortableInput({ id, labelStyle, notes = [], children, index }) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });
    
    const handleDelete = useDelete();
    const handleDeleteNote = useDeleteNote();
    const { currentSections, currentSection, setCurrentSection } = useSong();

    const isCurrent = currentSection?._id === id;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    const handleSelectSection = (e) => {
        e?.stopPropagation?.();
        if (isCurrent) {
            setCurrentSection(null);
        } else {
            const found = currentSections.find(section => section._id === id);
            if (found) setCurrentSection(found);
        }
    };

    const sectionColor = labelStyle?.border?.match(/#[0-9a-fA-F]{3,6}|hsl\([^)]+\)/)?.[0] || '#7c4dff';

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`section-card sm-section-card ${isCurrent ? 'is-active' : ''} ${isDragging ? 'is-dragging' : ''}`}
            onClick={handleSelectSection}
        >
            {/* Header: Index, Label Pill, Actions & Drag Handle */}
            <div className="section-header" onClick={(e) => e.stopPropagation()}>
                <div className="section-badge-container">
                    {typeof index === 'number' && (
                        <span className="section-index">{String(index + 1).padStart(2, '0')}</span>
                    )}
                    <span 
                        className="section-pill"
                        style={{ backgroundColor: sectionColor, color: '#ffffff' }}
                        title={children}
                    >
                        {children}
                    </span>
                </div>

                <div className="section-actions">
                    <button 
                        type="button"
                        className={`section-btn ${isCurrent ? 'btn-active-edit' : ''}`}
                        title={isCurrent ? "Finish editing section" : "Select section"}
                        onClick={handleSelectSection}
                    >
                        <i className={`fa-solid fa-${isCurrent ? 'circle-check' : 'pen-to-square'}`}></i>
                    </button>

                    {confirmDelete ? (
                        <button 
                            type="button"
                            className="section-btn btn-delete text-danger"
                            title="Confirm delete"
                            onClick={() => handleDelete("sections", id)}
                        >
                            <i className="fa-solid fa-check"></i>
                        </button>
                    ) : (
                        <button 
                            type="button"
                            className="section-btn btn-delete"
                            title="Delete section"
                            onClick={() => setConfirmDelete(true)}
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    )}

                    <button 
                        type="button"
                        className="drag-handle ms-1"
                        title="Drag to reorder"
                        {...attributes}
                        {...listeners}
                    >
                        <i className="fa-solid fa-grip-vertical"></i>
                    </button>
                </div>
            </div>

            {/* Active Section Banner */}
            {isCurrent && (
                <div className="active-indicator">
                    <i className="fa-solid fa-sliders"></i>
                    <span>Selected for Editing</span>
                </div>
            )}

            {/* Notes List */}
            <div className="section-notes-container" onClick={(e) => e.stopPropagation()}>
                {notes && notes.length > 0 ? (
                    notes.map(note => {
                        const meta = getNoteMetadata(note.label);
                        return (
                            <div 
                                key={note._id} 
                                className={`note-chip chip-${meta.type}`}
                            >
                                <span className="note-chip-label">
                                    <i className={`${meta.icon} note-chip-icon`} style={{ color: meta.color }}></i>
                                    <span>{note.label}</span>
                                </span>
                                
                                <button 
                                    type="button"
                                    className="note-chip-delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNote(note._id, id);
                                    }}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <div 
                        className="empty-notes-hint"
                        onClick={handleSelectSection}
                    >
                        <i className={isCurrent ? "fa-solid fa-plus-circle text-primary" : "fa-solid fa-layer-group"}></i>
                        <span>{isCurrent ? "Choose elements below" : "Tap to select and add details"}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SortableInput;