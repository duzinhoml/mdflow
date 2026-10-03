import { useEffect, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';

import { useUser } from '../contexts/UserContext.jsx';
import { useSong } from '../contexts/SongContext.jsx';
import { useDndSensors, useDrag } from '../lib/constants.js';

import Nav from './Nav/index.jsx';
import ArrangementSelector from './ArrangementSelector/index.jsx';
import DndDashboard from '../dndComponents/DndDashboard.jsx';
import { SortableInputOverlay } from '../dndComponents/SortableInput.jsx';

function Dashboard() {
    const { user, userData, setUserData } = useUser();
    const { currentSections } = useSong();
    const [activeId, setActiveId] = useState(null);

    useEffect(() => { 
        if (!userData && user) setUserData(user); 
    }, [user, userData, setUserData]);
    
    const handleDragEnd = useDrag();
    const { sensors } = useDndSensors();

    const activeSection = currentSections?.find(
        section => section._id.toString() === activeId
    );

    return (
        <div className="vh-100 d-flex flex-column overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
            {/* Top Workspace Navigation Bar */}
            <Nav />

            {/* Main Interactive Workspace */}
            <div className='flex-grow-1 d-flex flex-column position-relative overflow-hidden'>
                <DndContext 
                    sensors={sensors} 
                    onDragStart={(event) => setActiveId(event.active.id)}
                    onDragEnd={(event) => {
                        setActiveId(null);
                        handleDragEnd(event);
                    }}
                    onDragCancel={() => setActiveId(null)}
                >
                    <DndDashboard />

                    {/* Drag and Drop Floating Overlay Preview */}
                    <DragOverlay dropAnimation={{
                        duration: 200,
                        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)'
                    }}>
                        {activeSection ? (
                            <SortableInputOverlay section={activeSection} />
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