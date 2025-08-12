import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useDeleteSection, useDeleteNote, useHoverEffect } from '../lib/constants';

import { useCurrentSong } from '../contexts/CurrentSongContext';
import { useCurrentSections } from '../contexts/CurrentSectionsContext';
import { useCurrentSection } from '../contexts/CurrentSectionContext';
import { useCurrentNote } from '../contexts/CurrentNoteContext';

import '../index.css'

function SortableInput({ id, className, inputStyle, notes, children }) {
    const { currentNote, setCurrentNote } = useCurrentNote();
    const { isCurrentSection, hoverBg, isHovered, allowDrag, handleHoverEffect } = useHoverEffect();
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled: !allowDrag });

    const handleDeleteSection = useDeleteSection();
    const handleDeleteNote = useDeleteNote();
    const { currentSong } = useCurrentSong();
    const { currentSections } = useCurrentSections();
    const { currentSection, setCurrentSection } = useCurrentSection();

    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
        minWidth: '20vw',
        boxShadow: 'inset 0 4px 4px black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: hoverBg(id)
    }

    const handleSelectSection = (id) => {
        if (currentSections.find(section => section._id === id) === currentSection) setCurrentSection(null);
        else setCurrentSection(currentSections.find(section => section._id === id))
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={className} 
            {...attributes} 
            {...listeners} 
            onMouseEnter={() => handleHoverEffect("card", true)} 
            onMouseLeave={() => handleHoverEffect("card", false)}
        >
            <div 
                className='mb-3 p-1 rounded-2 text-center text-light w-100' 
                style={{ ...inputStyle }}
                onMouseEnter={() => handleHoverEffect("label", true)}
                onMouseLeave={() => handleHoverEffect("label", false)}
            >
                {isHovered.label && currentSong && currentSections.length ? (
                    <div className='d-flex justify-space-between'>
                        <span className='w-50 bg-danger' onClick={() => handleDeleteSection(id)}>
                            Delete
                            <i className="fa-solid fa-trash ms-2"></i>
                        </span>
                        <span className='w-50 bg-secondary' onClick={() => handleSelectSection(id)}>
                            Edit
                            <i className="fa-solid fa-pen-to-square ms-2"></i>
                        </span>
                    </div>
                    
                ) : isCurrentSection(id) ? `Editing: ${children}` : children}
            </div>
            {notes?.map(note => (
                <div 
                    key={note._id} 
                    className='text-light text-center border border-3 rounded-2 mb-2 p-1 w-100 section-note position-relative'
                    onMouseEnter={() => { handleHoverEffect("notes", true); setCurrentNote(note) }}
                    onMouseLeave={() => handleHoverEffect("notes", false)}
                    style={{ borderColor: note.color }}
                >
                    <span>{note.label}</span>
                    {isHovered.notes && note._id === currentNote?._id && (
                        <button 
                            className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-1 fs-6"
                            onClick={() => handleDeleteNote(note._id, id)}
                            style={{ backgroundColor: "#262731", padding: '2px 6px' }}
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SortableInput;