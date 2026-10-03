import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useDelete, useDeleteNote } from '../lib/constants';
import { useSong } from '../contexts/SongContext';

import './index.css';

// Helper to categorize note and return appropriate icon
export function getNoteMetadata(label = '') {
    const lower = label.toLowerCase();
    const dynamicLabels = ['high', 'low', 'mid', 'all in', 'soft'];
    const isDynamic = dynamicLabels.some(d => lower.includes(d));

    if (isDynamic) {
        let bars = 3;
        let color = '#f59e0b';
        if (lower.includes('soft')) { bars = 1; color = '#38bdf8'; }
        else if (lower.includes('low')) { bars = 2; color = '#60a5fa'; }
        else if (lower.includes('mid')) { bars = 3; color = '#f59e0b'; }
        else if (lower.includes('high')) { bars = 4; color = '#f97316'; }
        else if (lower.includes('all in')) { bars = 5; color = '#ef4444'; }

        return {
            type: 'dynamic',
            icon: 'fa-solid fa-chart-simple',
            bars,
            color
        };
    }

    // Instrument icons
    let icon = 'fa-solid fa-music';
    if (lower.includes('drum') || lower.includes('perc') || lower.includes('loop')) {
        icon = 'fa-solid fa-drum';
    } else if (lower.includes('bass')) {
        icon = 'fa-solid fa-guitar';
    } else if (lower.includes('guitar')) {
        icon = 'fa-solid fa-guitar';
    } else if (lower.includes('piano') || lower.includes('key') || lower.includes('organ')) {
        icon = 'fa-solid fa-keyboard';
    }

    return {
        type: 'instrument',
        icon,
        color: '#38bdf8'
    };
}

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
            className={`section-card ${isCurrent ? 'is-active' : ''} ${isDragging ? 'is-dragging' : ''}`}
            onMouseLeave={() => setConfirmDelete(false)}
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
                        style={{ 
                            backgroundColor: sectionColor,
                            color: '#ffffff'
                        }}
                        title={children}
                    >
                        {children}
                    </span>
                </div>

                <div className="section-actions">
                    {/* Active/Select Toggle */}
                    <button 
                        type="button"
                        className={`section-btn ${isCurrent ? 'btn-active-edit' : ''}`}
                        title={isCurrent ? "Finish editing section" : "Select section to add instruments/dynamics"}
                        onClick={handleSelectSection}
                    >
                        <i className={`fa-solid fa-${isCurrent ? 'circle-check' : 'pen-to-square'}`}></i>
                    </button>

                    {/* Delete Section */}
                    {confirmDelete ? (
                        <button 
                            type="button"
                            className="section-btn btn-delete text-danger"
                            title="Confirm delete section"
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

                    {/* Dedicated Drag Handle */}
                    <button 
                        type="button"
                        className="drag-handle ms-1"
                        title="Drag to reorder section"
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

            {/* Notes List (Dynamics & Instruments) */}
            <div className="section-notes-container" onClick={(e) => e.stopPropagation()}>
                {notes && notes.length > 0 ? (
                    notes.map(note => {
                        const meta = getNoteMetadata(note.label);
                        return (
                            <div 
                                key={note._id} 
                                className={`note-chip chip-${meta.type}`}
                                title={`${meta.type.toUpperCase()}: ${note.label}`}
                            >
                                <span className="note-chip-label">
                                    <i className={`${meta.icon} note-chip-icon`} style={{ color: meta.color }}></i>
                                    <span>{note.label}</span>
                                </span>
                                
                                <button 
                                    type="button"
                                    className="note-chip-delete"
                                    title={`Remove ${note.label}`}
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
                        style={{ cursor: 'pointer' }}
                    >
                        <i className={isCurrent ? "fa-solid fa-plus-circle text-primary" : "fa-solid fa-layer-group"}></i>
                        <span>{isCurrent ? "Choose instruments or dynamics below" : "Click to select and add elements"}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// Standalone overlay preview for DragOverlay
export function SortableInputOverlay({ section }) {
    if (!section) return null;
    const notes = section.notes || [];

    return (
        <div className="section-card-overlay">
            <div className="section-header">
                <div className="section-badge-container">
                    <span 
                        className="section-pill"
                        style={{ backgroundColor: section.color || '#7c4dff', color: '#ffffff' }}
                    >
                        {section.label}
                    </span>
                </div>
                <div className="drag-handle text-primary">
                    <i className="fa-solid fa-grip-vertical"></i>
                </div>
            </div>

            <div className="section-notes-container">
                {notes.slice(0, 3).map(note => {
                    const meta = getNoteMetadata(note.label);
                    return (
                        <div key={note._id} className={`note-chip chip-${meta.type}`}>
                            <span className="note-chip-label">
                                <i className={`${meta.icon} note-chip-icon`} style={{ color: meta.color }}></i>
                                <span>{note.label}</span>
                            </span>
                        </div>
                    );
                })}
                {notes.length > 3 && (
                    <small className="text-muted text-center">+{notes.length - 3} more items</small>
                )}
            </div>
        </div>
    );
}

export default SortableInput;