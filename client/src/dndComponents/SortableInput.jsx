import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableInput({ id, className, inputStyle, children }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
        minWidth: '15vw'
    }

    return (
        <div ref={setNodeRef} style={style} className={className} {...attributes} {...listeners}>
            <p className='mb-3 p-1 rounded-2 text-center' style={inputStyle}>{children}</p>
        </div>
    );
};

export default SortableInput;