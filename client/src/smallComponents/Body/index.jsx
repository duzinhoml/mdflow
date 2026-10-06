import { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';

import { useSong } from "../../contexts/SongContext.jsx";
import { usePaletteDrag } from "../../contexts/PaletteDragContext.jsx";
import { useDndSensors, useDrag, useSectionNoteCreator } from "../../lib/constants.js";

import SetlistTitle from "./SetlistTitle.jsx";
import SongTitle from "./SongTitle.jsx";
import DndDashboard from "./DndComponents/DndDashboard.jsx";
import ArrangementSelector from "../../components/ArrangementSelector/index.jsx";
import PaletteDragOverlay from "../../components/ArrangementSelector/PaletteDragOverlay.jsx";
import Sidebar from "../../components/Sidebar/index.jsx";
import Settings from "./Settings/index.jsx";
import { SortableInputOverlay } from "../../dndComponents/SortableInput.jsx";

function Body({ activePage, setActivePage }) {
    const { currentSections } = useSong();
    const [activeId, setActiveId] = useState(null);
    const { activePaletteItem, setActivePaletteItem } = usePaletteDrag();
    const { handleCreateSection, handleCreateNote } = useSectionNoteCreator();

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
                if (overId.startsWith('section-insert-')) {
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
        <main className="h-100 flex-grow-1 d-flex flex-column overflow-hidden position-relative">
            {activePage !== "Settings" ? (
                <DndContext
                    sensors={sensors}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragCancel={onDragCancel}
                >
                    <div className="flex-grow-1 d-flex flex-column overflow-y-auto">
                        <SetlistTitle />
                        <SongTitle />
                        <DndDashboard />
                    </div>

                    <Sidebar />
                    <ArrangementSelector />

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
                </DndContext>
            ) : (
                <Settings setActivePage={setActivePage} />
            )}
        </main>
    );
};

export default Body;