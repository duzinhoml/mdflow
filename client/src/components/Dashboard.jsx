import { useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';

import { useUser } from '../contexts/UserContext.jsx';

import { useDndSensors, useDrag } from '../lib/constants.js';

import Nav from './Nav/index.jsx';
import ArrangementSelector from './ArrangementSelector/index.jsx';
import DndDashboard from '../dndComponents/DndDashboard.jsx';

function Dashboard() {
    const { user, userData, setUserData } = useUser();

    useEffect(() => { if (!userData) setUserData(user) }, []);
    
    const handleDragEnd = useDrag();
    const { sensors } = useDndSensors();

    return (
        <div className="vh-100">
            <div className='h-100 d-flex flex-column'>

                {/* Nav */}
                <Nav />
                <div className="rounded-bottom-2" style={{ borderBottom: '4px solid #3a3b47'}}></div>
                
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <DndDashboard />

                    {/* Input Pool */}
                    <ArrangementSelector/>

                </DndContext>
            </div>
        </div>
    );
};

export default Dashboard;