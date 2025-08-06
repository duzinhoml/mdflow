import { useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

import Nav from './Nav.jsx';
import Sidebar from './Sidebar.jsx';
import InputPool from './InputPool.jsx';

import SortableInput from '../dndComponents/SortableInput.jsx';
import SongLayout from './SongLayout.jsx';

import { useUser } from '../contexts/UserContext.jsx';
import { useToggleVisible } from '../contexts/ToggleVisibleContext.jsx';
import { useCurrentSong } from '../contexts/CurrentSongContext.jsx';
import { useCurrentSections } from '../contexts/CurrentSectionsContext.jsx';

import { useDndSensors, useDrag } from '../lib/constants.js';

function Dashboard() {
    const { user, userData, setUserData } = useUser();
    const { visible } = useToggleVisible();
    const { currentSong } = useCurrentSong();
    const { currentSections, setCurrentSections } = useCurrentSections();

    useEffect(() => {
        if (!userData) {
            setUserData(user)
        };
    }, []);

    useEffect(() => {
        currentSong?.sections ? setCurrentSections(currentSong.sections) : setCurrentSections([]);
    }, [currentSong]);
    
    const handleDragEnd = useDrag();
    const { sensors } = useDndSensors();

    return (
        <div className="vh-100">
            <div className='h-100 d-flex flex-column'>

                {/* Nav */}
                <Nav />

                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <div className='d-flex flex-grow-1'>
                        <Sidebar />
                        {/* Sections */}
                        <SongLayout>
                            <SortableContext items={currentSections.map(section => section._id)} strategy={horizontalListSortingStrategy}>
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
                        </SongLayout>
                    </div>

                    {/* Input Pool */}
                    {visible.inputPool && 
                        <InputPool/>}

                </DndContext>
            </div>
        </div>
    );
};

export default Dashboard;