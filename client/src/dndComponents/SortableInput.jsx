import { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useDelete, useDeleteNote, useHoverEffect } from '../lib/constants';

import { useSong } from '../contexts/SongContext';

import './index.css'

function SortableInput({ id, className, inputStyle, notes, children }) {
    const [toDelete, setToDelete] = useState({
        message: false,
        item: null
    });

    const { isCurrentSection, hoverBg, isHovered, allowDrag, setAllowDrag, handleHoverEffect } = useHoverEffect();
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled: !allowDrag });

    const handleDelete = useDelete();
    const handleDeleteNote = useDeleteNote();
    const { currentSong, currentSections, currentSection, setCurrentSection } = useSong();
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition: [transition, 'background-color 0.3s ease-in-out'].filter(Boolean).join(', '),
        touchAction: 'none',
        minWidth: '20vw',
        border: "5px solid hsl(235, 13%, 62%)",
        boxShadow: '0px 0px 2px 1px hsl(235, 13%, 42%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: hoverBg(id)
    }

    const handleSelectSection = (id) => {
        if (currentSections.find(section => section._id === id) === currentSection) setCurrentSection(null);
        else setCurrentSection(currentSections.find(section => section._id === id))
    };

    const confirmDelete = (item) => {
        if (item._id === toDelete.item?._id) {
            setToDelete({ message: false, item: null });
            return;
        }

        setToDelete({ message: true, item });
    };

    useEffect(() => setToDelete({ message: false, item: null }), [currentSection]);

    useEffect(() => { toDelete.message && setAllowDrag(false) });

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
                {isHovered?.label && currentSong && currentSections?.length ? (
                    <div className='d-flex justify-space-between'>
                        <span className='w-50 delete' onClick={() => handleDelete("sections", id)}>
                            Delete
                            <i className="fa-solid fa-trash ms-2"></i>
                        </span>
                        <span className={`w-50 ${currentSection?._id === id ? "done" : "edit"}`} onClick={() => handleSelectSection(id)}>
                            {currentSection?._id === id ? "Done" : "Edit"}
                            <i className={`fa-solid fa-${currentSection?._id === id ? "circle-check" : "pen-to-square"} ms-2`}></i>
                        </span>
                    </div>
                    
                ) : isCurrentSection(id) ? `Editing: ${children}` : children}
            </div>
            {notes?.map(note => (
                <div key={note._id} className='w-100 d-flex align-items-center'>
                    <div 
                        className={`text-center border border-3 rounded-2 mb-2 p-1 w-100 position-relative notes`}
                        onMouseEnter={() => handleHoverEffect("notes", true)}
                        onMouseLeave={() => handleHoverEffect("notes", false)}
                        onClick={() => confirmDelete(note)}
                    >
                        <span>{note.label}</span>
                    </div>
                    {(toDelete.item?._id === note._id && toDelete.message && currentSection?._id === id) && (
                        <button className="btn btn-danger text-center mb-2 py-1 px-2 ms-2" onClick={() => { handleHoverEffect("notes", true); handleDeleteNote(note._id, id)}}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SortableInput;