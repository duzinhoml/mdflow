import { useEffect } from 'react';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';

import { useSong } from '../../../contexts/SongContext.jsx';
import SongLayout from '../../../components/SongLayout.jsx';
import SortableInput from './SortableInput.jsx';

function DndDashboard() {
    const { currentSong, currentSections, setCurrentSections } = useSong();

    useEffect(() => {
        currentSong?.sections ? setCurrentSections(currentSong.sections) : setCurrentSections([]);
    }, [currentSong, setCurrentSections]);

    return (
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
                            <p className="mb-0 fw-medium" style={{ fontSize: '13px' }}>Tap or drag below to add sections</p>
                        </div>
                    )
                }
            </SortableContext>
        </SongLayout>
    );
};

export default DndDashboard;