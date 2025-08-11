import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useDeleteSection } from '../lib/constants';

import { useCurrentSong } from '../contexts/CurrentSongContext';
import { useCurrentSections } from '../contexts/CurrentSectionsContext';
import { useCurrentSection } from '../contexts/CurrentSectionContext';

import '../index.css'

function SortableInput({ id, className, inputStyle, notes, children }) {
    const [isHovered, setIsHovered] = useState({
        card: false,
        label: false
    });
    const [allowDrag, setAllowDrag] = useState(true);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled: !allowDrag });

    const handleDeleteSection = useDeleteSection();
    const { currentSong } = useCurrentSong();
    const { currentSections } = useCurrentSections();
    const { currentSection, setCurrentSection } = useCurrentSection();

    const isCurrentSection = (currentSection?._id === id && currentSection !== null);
    const hoverBg = () => {
        if (isCurrentSection) return "#3c3d4eff";
        else if (isHovered.card && isHovered.label) return "transparent";
        else if (isHovered.card) return "#3c3d4eff";
        else return "transparent"
    }
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
        minWidth: '20vw',
        boxShadow: 'inset 0 4px 4px black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: hoverBg()
    }
    
    const handleHoverEffect = (area, state) => {
        setIsHovered(prev => {
            const updated = { ...prev, [area]: state };
            
            if (updated.label) setAllowDrag(false);
            else if (updated.card && !updated.label) setAllowDrag(true);
            
            return updated;
        });
    };

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
                    
                ) : (isCurrentSection ? `Editing: ${children}` : children)}
            </div>
            {notes?.map(note => (
                <div key={note._id} className='text-light text-center border border-3 border-danger rounded-2 mb-2 p-1 w-100 note-hover'>{note.label}</div>
            ))}
        </div>
    );
};

export default SortableInput;