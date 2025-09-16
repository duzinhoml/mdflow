import { useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';

import { useSong } from '../../../contexts/SongContext.jsx';
import { useDndSensors, useDrag } from '../../../lib/constants.js';

import SongLayout from '../../../components/SongLayout.jsx';
import SortableInput from './SortableInput.jsx';

function DndDashboard() {
    const { currentSong, currentSections, setCurrentSections } = useSong();
    const { sensors } = useDndSensors();
    const handleDragEnd = useDrag();

    useEffect(() => {
        currentSong?.sections ? setCurrentSections(currentSong.sections) : setCurrentSections([])
    }, [currentSong])

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SongLayout>
                <SortableContext items={currentSections.map(section => section._id)} strategy={horizontalListSortingStrategy}>
                    {currentSections.length ? 
                        currentSections?.map(section => (
                            <SortableInput 
                                key={section._id.toString()} 
                                id={section._id.toString()} 
                                labelStyle={{ border: `3px solid ${section.color}`, boxShadow: `0px 0px 2px 0.5px ${section.color}`, backgroundColor: '#262731' }}
                                notes={section.notes || []}
                            >
                                {section.label}
                            </SortableInput>
                        )) : (
                            <SortableInput>
                                Create your song
                            </SortableInput>
                        )
                    }
                </SortableContext>
            </SongLayout>
        </DndContext>
    );
};

export default DndDashboard;