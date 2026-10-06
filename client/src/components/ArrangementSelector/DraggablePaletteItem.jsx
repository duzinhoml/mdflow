import { useDraggable } from '@dnd-kit/core';
import { usePaletteDrag } from '../../contexts/PaletteDragContext.jsx';

export function DraggablePaletteItem({
    id,
    type, // 'section' | 'dynamic' | 'instrument'
    item,
    className = '',
    style = {},
    onClick,
    children,
    ...props
}) {
    const { isSwipingPalette } = usePaletteDrag?.() || {};

    const draggableId = id || `palette-${type}-${item.label || item.id || Math.random()}`;

    const {
        attributes,
        listeners,
        setNodeRef,
        isDragging
    } = useDraggable({
        id: draggableId,
        data: {
            type: 'palette-item',
            category: type,
            item
        },
        disabled: !!isSwipingPalette
    });

    const combinedStyle = {
        ...style,
        opacity: isDragging ? 0.35 : 1,
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none'
    };

    return (
        <button
            ref={setNodeRef}
            type="button"
            className={`${className} ${isDragging ? 'is-palette-item-dragging' : ''}`}
            style={combinedStyle}
            onClick={onClick}
            {...attributes}
            {...listeners}
            {...props}
        >
            {children}
        </button>
    );
}

export default DraggablePaletteItem;
