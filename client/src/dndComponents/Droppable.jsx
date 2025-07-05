import { useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";

function Droppable({ id, items, className, children }) {
    const { isOver, setNodeRef }  = useDroppable({ id });
    const scrollRef = useRef(null);

    const handleRef = (node) => {
        setNodeRef(node);
        scrollRef.current = node;
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                left: scrollRef.current.scrollWidth,
                behavior: 'smooth'
            });
        }
    }, [items.length])

    const style = {
        // backgroundColor: isOver ? 'red' : '#6c757d',
        backgroundColor: '#6c757d',
        // width: 'fit-content'
    };

    return (
        <div ref={handleRef} style={style} className="flex-grow-1 d-flex overflow-x-auto">
            <div className={className}>
                {children}
            </div>
        </div>
    )
};

export default Droppable;