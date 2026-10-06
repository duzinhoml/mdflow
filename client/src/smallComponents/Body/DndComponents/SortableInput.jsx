import { useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';

import { useDelete, useDeleteNote } from "../../../lib/constants.js";
import { useSong } from "../../../contexts/SongContext.jsx";
import { usePaletteDrag } from "../../../contexts/PaletteDragContext.jsx";
import { getNoteMetadata } from "../../../dndComponents/SortableInput.jsx";

import './index.css';

function SortableInput({ id, labelStyle, notes = [], children, index }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const confirmTimerRef = useRef(null);
    const { activePaletteItem } = usePaletteDrag?.() || {};

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver
    } = useSortable({ id });

    const isSectionPaletteDrag = activePaletteItem && activePaletteItem.category === 'section';

    const { setNodeRef: setLeftDropRef, isOver: isOverLeft } = useDroppable({
        id: `section-insert-${id}-left`,
        disabled: !isSectionPaletteDrag,
        data: {
            type: 'palette-section-insert',
            targetSectionId: id,
            position: 'left'
        }
    });

    const { setNodeRef: setRightDropRef, isOver: isOverRight } = useDroppable({
        id: `section-insert-${id}-right`,
        disabled: !isSectionPaletteDrag,
        data: {
            type: 'palette-section-insert',
            targetSectionId: id,
            position: 'right'
        }
    });
    
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

    const handleTriggerDelete = (e) => {
        e?.stopPropagation?.();
        setConfirmDelete(true);
        if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
        confirmTimerRef.current = setTimeout(() => {
            setConfirmDelete(false);
        }, 3500);
    };

    const handleConfirmDelete = (e) => {
        e?.stopPropagation?.();
        if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
        setConfirmDelete(false);
        handleDelete("sections", id);
    };

    const isDropTarget = isOver && activePaletteItem && (activePaletteItem.category === 'dynamic' || activePaletteItem.category === 'instrument');
    const isSectionInsert = (isOverLeft || isOverRight || (isOver && isSectionPaletteDrag));
    const sectionColor = labelStyle?.border?.match(/#[0-9a-fA-F]{3,6}|hsl\([^)]+\)/)?.[0] || '#7c4dff';

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`section-card sm-section-card ${isCurrent ? 'is-active' : ''} ${isDragging ? 'is-dragging' : ''} ${isDropTarget ? 'is-drop-target' : ''}`}
            onClick={handleSelectSection}
        >
            {/* Section Insertion Left Indicator */}
            {(isOverLeft || (isSectionInsert && !isOverRight)) && isSectionPaletteDrag && (
                <div 
                    className="position-absolute top-0 start-0 h-100 rounded-start"
                    style={{
                        width: '6px',
                        backgroundColor: 'var(--accent-primary)',
                        boxShadow: '0 0 16px var(--accent-glow), 0 0 24px var(--accent-primary)',
                        zIndex: 25
                    }}
                >
                    <div className="section-insert-pill left-pill">
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Insert to Left</span>
                    </div>
                </div>
            )}

            {/* Section Insertion Right Indicator */}
            {isOverRight && isSectionPaletteDrag && (
                <div 
                    className="position-absolute top-0 end-0 h-100 rounded-end"
                    style={{
                        width: '6px',
                        backgroundColor: 'var(--accent-primary)',
                        boxShadow: '0 0 16px var(--accent-glow), 0 0 24px var(--accent-primary)',
                        zIndex: 25
                    }}
                >
                    <div className="section-insert-pill right-pill">
                        <span>Insert to Right</span>
                        <i className="fa-solid fa-arrow-right"></i>
                    </div>
                </div>
            )}

            {/* Left and Right Split Drop Targets during Palette Section Drag */}
            {isSectionPaletteDrag && (
                <div 
                    className="section-dropzones-overlay position-absolute top-0 start-0 w-100 h-100 d-flex"
                    style={{ zIndex: 20, pointerEvents: 'none' }}
                >
                    <div 
                        ref={setLeftDropRef}
                        className="w-50 h-100"
                        style={{ pointerEvents: 'all' }}
                        title="Insert to left"
                    />
                    <div 
                        ref={setRightDropRef}
                        className="w-50 h-100"
                        style={{ pointerEvents: 'all' }}
                        title="Insert to right"
                    />
                </div>
            )}

            {/* Drop Indicator for Dynamics and Instruments */}
            {isDropTarget && (
                <div 
                    className="d-flex align-items-center justify-content-center gap-2 py-1 mb-2 rounded-2"
                    style={{
                        backgroundColor: 'rgba(56, 189, 248, 0.15)',
                        border: '1.5px dashed var(--color-info)',
                        color: 'var(--color-info)',
                        fontSize: '11px',
                        fontWeight: 700
                    }}
                >
                    <i className="fa-solid fa-arrow-down-to-bracket"></i>
                    <span>Release to attach {activePaletteItem.item.label}</span>
                </div>
            )}

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
                            className="section-btn btn-delete text-danger is-confirming"
                            title="Confirm delete"
                            onClick={handleConfirmDelete}
                        >
                            <i className="fa-solid fa-check"></i>
                        </button>
                    ) : (
                        <button 
                            type="button"
                            className="section-btn btn-delete"
                            title="Delete section"
                            onClick={handleTriggerDelete}
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