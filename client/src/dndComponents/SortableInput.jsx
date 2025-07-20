import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useEditing } from '../contexts/EditingContext';

function SortableInput({ id, className, inputStyle, children }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const { isEditing } = useEditing();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
        minWidth: '15vw',
        cursor: 'default'
    }

    return (
        <div ref={setNodeRef} style={style} className={className} {...attributes} {...listeners}>
            <div className='mb-3 p-1 rounded-2 d-flex justify-content-center align-items-center' style={inputStyle}>
                {isEditing ? (
                    <>
                        <span>{children}</span>
                        <i class="fa-solid fa-trash ms-2" style={{ cursor: 'default' }} data-bs-toggle="modal" data-bs-target={`#deleteSectionBackdrop-${id}`}></i>
                    </>
                )
                : children}
            </div>
        </div>
    );
};

export default SortableInput;