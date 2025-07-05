import { useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import { useDragging } from '../contexts/IsDraggingContext.jsx';

function Draggable({ id, children, className, inputStyle }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
    const { draggingId, setDraggingId } = useDragging();

    useEffect(() => {
        isDragging ? setDraggingId(id) : setDraggingId(null);
    }, [isDragging])

    const style = {
        transform: CSS.Translate.toString(transform),
        touchAction: 'none',
        ...inputStyle,
        backgroundColor: draggingId === id ? 'green' : 'transparent'
    }

    return (
        <button ref={setNodeRef} style={style} {...listeners} {...attributes} className={className}>
            {children}
        </button>
    );
};

export default Draggable;