import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useEditing } from '../contexts/EditingContext';

import { useDeleteSection } from '../lib/constants';

function SortableInput({ id, className, inputStyle, children }) {
    const [isHovered, setIsHovered] = useState(false);
    const [allowDrag, setAllowDrag] = useState(true)
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled: !allowDrag });
    const { isEditing } = useEditing();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
        minWidth: '15vw'
    }

    const handleHoverEffect = (state) => {
        if (isEditing) {
            setIsHovered(state);
            setAllowDrag(!state)
        };
    };

    const handleDeleteSection = useDeleteSection();

    return (
        <div ref={setNodeRef} style={style} className={className} {...attributes} {...listeners}>
            <div 
                className='mb-3 p-1 rounded-2 text-center' 
                style={{ ...inputStyle, backgroundColor: isHovered ? 'tomato' : null }}
                onMouseEnter={() => handleHoverEffect(true)}
                onMouseLeave={() => handleHoverEffect(false)}
                onClick={() => handleDeleteSection(id)}
            >
                {isHovered ? (
                    <span>
                        Delete
                        <i class="fa-solid fa-trash ms-2"></i>
                    </span>
                ) : children}
            </div>
        </div>
    );
};

export default SortableInput;