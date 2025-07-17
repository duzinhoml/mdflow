import { useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

import Nav from './Nav.jsx';
import InputPool from './InputPool.jsx';

import SortableInput from '../dndComponents/SortableInput.jsx';
import Layout from './Layout.jsx';

import { useToggleInputPool } from '../contexts/ToggleInputPoolContext.jsx';

import { useDndSensors, useDrag } from '../lib/constants.js';

function Dashboard() {
    const { visible } = useToggleInputPool();
    const { currentSections, setCurrentSections, currentSong, handleDragEnd } = useDrag();

    useEffect(() => {
        currentSong?.sections ? setCurrentSections(currentSong.sections) : setCurrentSections([]);
    }, [currentSong]);

    const { sensors } = useDndSensors();
    
    return (
        <div className="vh-100">
            <div className='h-100 d-flex flex-column'>

                {/* Nav */}
                <Nav />

                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>

                    {/* Drop Zone */}
                    <Layout>
                        <SortableContext items={currentSections.map(section => section._id.toString())} strategy={horizontalListSortingStrategy}>
                            {currentSections.length ? 
                                currentSections?.map(section => (
                                    <SortableInput 
                                        key={section._id.toString()} 
                                        id={section._id.toString()} 
                                        className='border border-light-subtle border-5 rounded-4 m-3 p-3'
                                        inputStyle={{ border: `3px solid ${section.color}` }}
                                    >
                                        {section.label}
                                    </SortableInput>
                                )) : (
                                    <SortableInput 
                                        className='border border-light-subtle border-5 rounded-4 m-3 p-3' 
                                        inputStyle={{ width: '12vw' }}
                                    >
                                        Create your song
                                    </SortableInput>
                                )
                            }
                        </SortableContext>
                    </Layout>

                    {/* Draggable Zone */}
                    {visible && 
                        <InputPool/>}

                </DndContext>
            </div>
        </div>
    );
};

export default Dashboard;