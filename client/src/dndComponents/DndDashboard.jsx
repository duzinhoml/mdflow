import { useEffect } from 'react';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

import { useSong } from '../contexts/SongContext.jsx';

import SongTitle from "../components/SongTitle.jsx";
import Sidebar from "../components/Sidebar/index.jsx";
import SongLayout from "../components/SongLayout.jsx";
import SortableInput from './SortableInput.jsx';

function DndDashboard() {
    const { currentSong, currentSections, setCurrentSections } = useSong();

    useEffect(() => {
        currentSong?.sections ? setCurrentSections(currentSong.sections) : setCurrentSections([]);
    }, [currentSong]);

    return (
        <div className='d-flex flex-column flex-grow-1'>

            <SongTitle />

            <Sidebar />
            {/* Sections */}
            <SongLayout>
                <SortableContext items={currentSections.map(section => section._id)} strategy={horizontalListSortingStrategy}>
                    {currentSections.length ? 
                        currentSections?.map(section => (
                            <SortableInput 
                                key={section._id.toString()} 
                                id={section._id.toString()} 
                                className='rounded-4 m-3 p-3'
                                inputStyle={{ border: `3px solid ${section.color}`, boxShadow: `0px 0px 2px 0.5px ${section.color}`, backgroundColor: '#262731' }}
                                notes={section.notes || []}
                            >
                                {section.label}
                            </SortableInput>
                        )) : (
                            <SortableInput 
                                className='rounded-4 m-3 p-3' 
                                inputStyle={{ width: '12vw' }}
                            >
                                Create your song
                            </SortableInput>
                        )
                    }
                </SortableContext>
            </SongLayout>
        </div>
    );
};

export default DndDashboard;