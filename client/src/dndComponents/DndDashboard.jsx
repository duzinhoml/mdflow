import { useEffect } from 'react';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

import { useSong } from '../contexts/SongContext.jsx';
import { useToggleVisible } from '../contexts/ToggleVisibleContext.jsx';
import { usePaletteDrag } from '../contexts/PaletteDragContext.jsx';

import SongTitle from "../components/SongTitle.jsx";
import Sidebar from "../components/Sidebar/index.jsx";
import SongLayout from "../components/SongLayout.jsx";
import SortableInput from './SortableInput.jsx';

function EmptyArrangementDropzone({ currentSong, toggleVisible }) {
    const { activePaletteItem } = usePaletteDrag?.() || {};
    const isSectionDragging = activePaletteItem && activePaletteItem.category === 'section';

    const { isOver, setNodeRef } = useDroppable({
        id: 'empty-song-arrangement-dropzone',
        disabled: !currentSong,
        data: {
            type: 'empty-arrangement-drop'
        }
    });

    const isDropActive = isOver && isSectionDragging;

    return (
        <div 
            ref={setNodeRef}
            className="d-flex flex-column align-items-center justify-content-center text-center p-4 m-3 rounded-3"
            style={{
                minWidth: '320px',
                maxWidth: '440px',
                border: isDropActive ? '2px dashed var(--accent-primary)' : '1.5px dashed var(--border-strong)',
                backgroundColor: isDropActive ? 'rgba(124, 77, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                boxShadow: isDropActive ? '0 0 25px rgba(124, 77, 255, 0.35)' : 'none',
                transition: 'all 0.2s ease-in-out'
            }}
        >
            <div 
                className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: isDropActive ? 'rgba(124, 77, 255, 0.25)' : 'var(--accent-light)',
                    color: 'var(--accent-primary)',
                    fontSize: '22px',
                    transition: 'all 0.2s ease-in-out'
                }}
            >
                <i className={isDropActive ? 'fa-solid fa-arrow-down-to-bracket' : (currentSong ? 'fa-solid fa-layer-group' : 'fa-solid fa-music')}></i>
            </div>

            <h6 className="text-light fw-semibold mb-1">
                {isDropActive 
                    ? `Drop to add ${activePaletteItem.item.label}`
                    : (currentSong ? `Empty Arrangement: ${currentSong.title}` : "No Song Selected")}
            </h6>
            <p className="text-muted mb-3" style={{ fontSize: '13px' }}>
                {isDropActive
                    ? 'Release mouse to start arrangement with this section'
                    : (currentSong 
                        ? "Drag & drop a section here to start arrangement, or open the section palette."
                        : "Choose a song from your library or type a song title above to start planning.")}
            </p>

            {currentSong ? (
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
                    <span>Open Section Palette</span>
                </button>
            ) : (
                <button 
                    type="button" 
                    className="btn btn-sm text-light fw-medium d-flex align-items-center gap-2"
                    style={{ 
                        backgroundColor: 'var(--bg-surface-elevated)', 
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 14px'
                    }}
                    onClick={() => toggleVisible('sidebar')}
                >
                    <i className="fa-solid fa-folder-open"></i>
                    <span>Select Song from Library</span>
                </button>
            )}
        </div>
    );
}

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
                    <EmptyArrangementDropzone 
                        currentSong={currentSong} 
                        toggleVisible={toggleVisible} 
                    />
                )}
            </SongLayout>
        </div>
    );
};

export default DndDashboard;