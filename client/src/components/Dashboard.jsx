import { useEffect, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';

import { useUser } from '../contexts/UserContext.jsx';
import { useSong } from '../contexts/SongContext.jsx';
import { usePaletteDrag } from '../contexts/PaletteDragContext.jsx';
import { useDndSensors, useDrag, useSectionNoteCreator } from '../lib/constants.js';

import Nav from './Nav/index.jsx';
import ArrangementSelector from './ArrangementSelector/index.jsx';
import PaletteDragOverlay from './ArrangementSelector/PaletteDragOverlay.jsx';
import DndDashboard from '../dndComponents/DndDashboard.jsx';
import { SortableInputOverlay } from '../dndComponents/SortableInput.jsx';

function Dashboard() {
    const { user, userData, setUserData } = useUser();
    const { currentSections } = useSong();
    const [activeId, setActiveId] = useState(null);
    const { activePaletteItem, setActivePaletteItem } = usePaletteDrag();
    const { handleCreateSection, handleCreateNote } = useSectionNoteCreator();

    useEffect(() => { 
        if (!userData && user) setUserData(user); 
    }, [user, userData, setUserData]);
    
    const handleDragEnd = useDrag();
    const { sensors } = useDndSensors();

    const activeSection = currentSections?.find(
        section => section._id.toString() === activeId
    );

    const onDragStart = (event) => {
        const { active } = event;
        if (active.data?.current?.type === 'palette-item') {
            setActivePaletteItem(active.data.current);
            setActiveId(null);
        } else {
            setActiveId(active.id);
            setActivePaletteItem(null);
        }
    };

    const onDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);
        setActivePaletteItem(null);

        if (!over) return;

        if (active.data?.current?.type === 'palette-item') {
            const { category, item } = active.data.current;
            if (category === 'section') {
                const overId = over.id?.toString() || '';
                if (overId === 'empty-song-arrangement-dropzone') {
                    await handleCreateSection(item);
                } else if (overId.startsWith('section-insert-')) {
                    const isLeft = overId.endsWith('-left');
                    const targetSectionId = overId.replace('section-insert-', '').replace('-left', '').replace('-right', '');
                    const position = isLeft ? 'left' : 'right';
                    await handleCreateSection(item, targetSectionId, position);
                } else {
                    const targetSection = currentSections?.find(s => s._id?.toString() === over.id?.toString());
                    if (targetSection) {
                        await handleCreateSection(item, targetSection._id, 'right');
                    } else {
                        await handleCreateSection(item);
                    }
                }
            } else if (category === 'dynamic' || category === 'instrument') {
                const overId = over.id?.toString() || '';
                let targetId = overId;
                if (overId.startsWith('section-insert-')) {
                    targetId = overId.replace('section-insert-', '').replace('-left', '').replace('-right', '');
                }
                const targetSection = currentSections?.find(s => s._id?.toString() === targetId);
                if (targetSection) {
                    await handleCreateNote(item, targetSection._id);
                }
            }
        } else {
            handleDragEnd(event);
        }
    };

    const onDragCancel = () => {
        setActiveId(null);
        setActivePaletteItem(null);
    };

    return (
        <div className="vh-100 h-100-dvh d-flex flex-column overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
            {/* Top Workspace Navigation Bar */}
            <Nav />

            {/* Main Interactive Workspace */}
            <div className='flex-grow-1 d-flex flex-column position-relative overflow-hidden'>
                <DndContext 
                    sensors={sensors} 
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragCancel={onDragCancel}
                >
                    <DndDashboard />

                    {/* Drag and Drop Floating Overlay Preview */}
                    <DragOverlay dropAnimation={{
                        duration: 180,
                        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)'
                    }}>
                        {activeSection ? (
                            <SortableInputOverlay section={activeSection} />
                        ) : activePaletteItem ? (
                            <PaletteDragOverlay activeItem={activePaletteItem} />
                        ) : null}
                    </DragOverlay>

                    {/* Bottom Element & Arrangement Palette */}
                    <ArrangementSelector />
                </DndContext>
            </div>
        </div>
    );
};

export default Dashboard;