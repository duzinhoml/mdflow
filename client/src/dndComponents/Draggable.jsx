import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

function Draggable({ id, children, className, inputStyle }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        touchAction: 'none'
    }

    return (
        <button ref={setNodeRef} style={{ ...style, ...inputStyle }} {...listeners} {...attributes} className={className}>
            {children}
        </button>
    );
};

export default Draggable;