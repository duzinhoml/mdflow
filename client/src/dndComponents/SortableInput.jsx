import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useDeleteSection } from '../lib/constants';

import { useCurrentSong } from '../contexts/CurrentSongContext';

function SortableInput({ id, className, inputStyle, children }) {
    const [isHovered, setIsHovered] = useState(false);
    const [allowDrag, setAllowDrag] = useState(true);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled: !allowDrag });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
        minWidth: '15vw',
        boxShadow: 'inset 0 2px 4px black'
    }

    const handleHoverEffect = (state) => {
        setIsHovered(state);
        setAllowDrag(!state);
    };

    const handleDeleteSection = useDeleteSection();
    const { currentSong } = useCurrentSong();

    return (
        <div ref={setNodeRef} style={style} className={className} {...attributes} {...listeners}>
            <div 
                className='mb-3 p-1 rounded-2 text-center text-light' 
                style={{ ...inputStyle, backgroundColor: isHovered && currentSong ? 'tomato' : null }}
                onMouseEnter={() => handleHoverEffect(true)}
                onMouseLeave={() => handleHoverEffect(false)}
                onClick={() => handleDeleteSection(id)}
            >
                {isHovered && currentSong ? (
                    <span>
                        Delete
                        <i className="fa-solid fa-trash ms-2"></i>
                    </span>
                ) : children}
            </div>
        </div>
    );
};

export default SortableInput;