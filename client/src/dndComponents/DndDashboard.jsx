import { useEffect } from 'react';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

import { useSong } from '../contexts/SongContext.jsx';
import { useToggleVisible } from '../contexts/ToggleVisibleContext.jsx';

import SongTitle from "../components/SongTitle.jsx";
import Sidebar from "../components/Sidebar/index.jsx";
import SongLayout from "../components/SongLayout.jsx";
import SortableInput from './SortableInput.jsx';

function DndDashboard() {
    const { currentSong, currentSections, setCurrentSections } = useSong();
    const { toggleVisible } = useToggleVisible();

    useEffect(() => {
        currentSong?.sections ? setCurrentSections(currentSong.sections) : setCurrentSections([]);
    }, [currentSong, setCurrentSections]);

    return (
        <div className='d-flex flex-column flex-grow-1 position-relative overflow-hidden'>
            <SongTitle />
            <Sidebar />

            {/* Sections Timeline */}
            <SongLayout>
                {currentSections && currentSections.length > 0 ? (
                    <SortableContext 
                        items={currentSections.map(section => section._id.toString())} 
                        strategy={horizontalListSortingStrategy}
                    >
                        {currentSections.map((section, idx) => (
                            <SortableInput 
                                key={section._id.toString()} 
                                id={section._id.toString()} 
                                index={idx}
                                labelStyle={{ border: `3px solid ${section.color}` }}
                                notes={section.notes || []}
                            >
                                {section.label}
                            </SortableInput>
                        ))}
                    </SortableContext>
                ) : (
                    <div 
                        className="d-flex flex-column align-items-center justify-content-center text-center p-4 m-3 rounded-3"
                        style={{
                            minWidth: '320px',
                            maxWidth: '420px',
                            border: '1.5px dashed var(--border-strong)',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)'
                        }}
                    >
                        <div 
                            className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                            style={{
                                width: '56px',
                                height: '56px',
                                backgroundColor: 'var(--accent-light)',
                                color: 'var(--accent-primary)',
                                fontSize: '22px'
                            }}
                        >
                            <i className={currentSong ? "fa-solid fa-layer-group" : "fa-solid fa-music"}></i>
                        </div>

                        <h6 className="text-light fw-semibold mb-1">
                            {currentSong ? `Empty Arrangement: ${currentSong.title}` : "No Song Selected"}
                        </h6>
                        <p className="text-muted mb-3" style={{ fontSize: '13px' }}>
                            {currentSong 
                                ? "Add your first song section (Intro, Verse, Chorus) to start crafting this arrangement flow."
                                : "Choose a song from your library or type a song title above to start planning."}
                        </p>

                        <button 
                            type="button" 
                            className="btn btn-sm text-light fw-medium d-flex align-items-center gap-2"
                            style={{ 
                                backgroundColor: 'var(--accent-primary)', 
                                borderRadius: 'var(--radius-sm)',
                                padding: '6px 14px'
                            }}
                            onClick={() => toggleVisible('selector')}
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>{currentSong ? "Open Section Palette" : "Open Workspace Tools"}</span>
                        </button>
                    </div>
                )}
            </SongLayout>
        </div>
    );
};

export default DndDashboard;