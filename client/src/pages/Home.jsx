import { useState, useEffect } from 'react';
import { 
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensors,
    useSensor
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';

import { useQuery } from '@apollo/client'
import { QUERY_USERS } from '../lib/utils/queries.js'
import { INPUT_POOL } from '../lib/constants.js';

import Nav from '../components/Nav.jsx';
import InputPool from '../components/InputPool.jsx';

import Droppable from '../dndComponents/Droppable.jsx';
import SortableInput from '../dndComponents/SortableInput.jsx';

function Home() {
    const [visible, setVisible] = useState(false);
    const [dropZoneItems, setDropZoneItems] = useState([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const { loading, data } = useQuery(QUERY_USERS);

    const users = data?.users;

    if (loading) return <div>Loading...</div>;

    const handleDragEnd = (e) => {
        const { active, over } = e;
        if (!over) return;

        const isFromPool = 
            INPUT_POOL
                .find(input => input.id === 1)?.children?.find(child => child.label === active.id);

        // If adding to drop zone
        if (isFromPool && over.id === 'drop-zone') {
            const newItem = {
                id: `${isFromPool.label}-${Date.now()}`,
                label: isFromPool.label,
                color: isFromPool.color
            };

            setDropZoneItems(prevItems => [...prevItems, newItem]);
            return;
        }

        // If moving within drop zone
        const oldIndex = dropZoneItems.findIndex(item => item.id === active.id);
        const newIndex = dropZoneItems.findIndex(item => item.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) setDropZoneItems(prevItems => arrayMove(prevItems, oldIndex, newIndex));
    }

    return (
        <div className="vh-100">
            <div className='h-100 d-flex flex-column'>

                {/* Nav */}
                <Nav visible={visible} setVisible={setVisible} />

                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>

                    {/* Drop Zone */}
                    <Droppable id='drop-zone' className='d-flex border border-dark-subtle border-5 rounded-5 m-3'>
                        <SortableContext items={dropZoneItems} strategy={horizontalListSortingStrategy}>
                            {dropZoneItems.length ? 
                                dropZoneItems.map(item => (
                                    <SortableInput 
                                        key={item.id} 
                                        id={item.id} 
                                        className='border border-light-subtle border-5 rounded-4 m-3 p-3'
                                        inputStyle={{ border: `3px solid ${item.color}` }}
                                    >
                                        {item.label}
                                    </SortableInput>
                                )) : 'No items in drop zone.'
                            }
                        </SortableContext>
                    </Droppable>

                    {/* Draggable Zone */}
                    {visible && 
                        <InputPool/>}
                </DndContext>

            </div>
        </div>
    )
};

export default Home;