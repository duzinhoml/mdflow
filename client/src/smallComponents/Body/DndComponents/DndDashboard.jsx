import { useEffect, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';

import { useSong } from '../../../contexts/SongContext.jsx';
import { useDndSensors, useDrag } from '../../../lib/constants.js';

import SongLayout from '../../../components/SongLayout.jsx';
import SortableInput from './SortableInput.jsx';
import { SortableInputOverlay } from '../../../dndComponents/SortableInput.jsx';

function DndDashboard() {
    const { currentSong, currentSections, setCurrentSections } = useSong();
    const { sensors } = useDndSensors();
    const handleDragEnd = useDrag();
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        currentSong?.sections ? setCurrentSections(currentSong.sections) : setCurrentSections([]);
    }, [currentSong, setCurrentSections]);

    const activeSection = currentSections?.find(
        section => section._id.toString() === activeId
    );

    return (
        <DndContext 
            sensors={sensors} 
            onDragStart={(event) => setActiveId(event.active.id)}
            onDragEnd={(event) => {
                setActiveId(null);
                handleDragEnd(event);
            }}
            onDragCancel={() => setActiveId(null)}
        >
            <SongLayout>
                <SortableContext items={currentSections.map(section => section._id.toString())} strategy={horizontalListSortingStrategy}>
                    {currentSections && currentSections.length ? 
                        currentSections.map((section, idx) => (
                            <SortableInput 
                                key={section._id.toString()} 
                                id={section._id.toString()} 
                                index={idx}
                                labelStyle={{ border: `3px solid ${section.color}` }}
                                notes={section.notes || []}
                            >
                                {section.label}
                            </SortableInput>
                        )) : (
                            <div className="text-center p-3 text-muted d-flex flex-column align-items-center justify-content-center" style={{ minWidth: '240px' }}>
                                <i className="fa-solid fa-layer-group mb-2 text-primary" style={{ fontSize: '20px' }}></i>
                                <p className="mb-0 fw-medium" style={{ fontSize: '13px' }}>Tap below to add sections</p>
                            </div>
                        )
                    }
                </SortableContext>
            </SongLayout>

            <DragOverlay dropAnimation={{
                duration: 200,
                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)'
            }}>
                {activeSection ? (
                    <SortableInputOverlay section={activeSection} />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default DndDashboard;