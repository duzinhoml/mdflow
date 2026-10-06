import { useEffect } from 'react';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

import { useSong } from '../../../contexts/SongContext.jsx';
import { usePaletteDrag } from '../../../contexts/PaletteDragContext.jsx';
import SongLayout from '../../../components/SongLayout.jsx';
import SortableInput from './SortableInput.jsx';

function EmptyArrangementDropzone({ currentSong }) {
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
            className="text-center p-4 rounded-3 d-flex flex-column align-items-center justify-content-center m-2"
            style={{ 
                minWidth: '240px',
                width: '100%',
                maxWidth: '360px',
                border: isDropActive ? '2px dashed var(--accent-primary)' : '1.5px dashed var(--border-strong)',
                backgroundColor: isDropActive ? 'rgba(124, 77, 255, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                boxShadow: isDropActive ? '0 0 20px var(--accent-glow)' : 'none',
                transition: 'all 0.2s ease-in-out'
            }}
        >
            <i 
                className={`fa-solid ${isDropActive ? 'fa-arrow-down-to-bracket' : 'fa-layer-group'} mb-2`} 
                style={{ fontSize: '24px', color: isDropActive ? 'var(--accent-primary)' : 'var(--text-muted)' }}
            ></i>
            <h6 className="text-light fw-semibold mb-1" style={{ fontSize: '13px' }}>
                {isDropActive 
                    ? `Drop to add ${activePaletteItem.item.label}` 
                    : (currentSong ? `Empty Arrangement: ${currentSong.title}` : 'No Song Selected')}
            </h6>
            <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>
                {isDropActive 
                    ? 'Release to start arrangement with this section' 
                    : (currentSong 
                        ? 'Drag & drop a section here from below to start arrangement' 
                        : 'Choose a song from your library or type a song title above to begin')}
            </p>
        </div>
    );
}

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
                        <EmptyArrangementDropzone currentSong={currentSong} />
                    )
                }
            </SortableContext>
        </SongLayout>
    );
};

export default DndDashboard;