import { useDroppable } from "@dnd-kit/core";

function Droppable({ id, className, children }) {
    const { isOver, setNodeRef }  = useDroppable({ id });

    const style = {
        backgroundColor: isOver ? 'red' : 'transparent',
        width: 'fit-content'
    };

    return (
        <div className="bg-secondary flex-grow-1 d-flex overflow-x-auto">
            <div ref={setNodeRef} style={style} className={className}>
                {children}
            </div>
        </div>
    )
};

export default Droppable;