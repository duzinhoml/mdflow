import { useState, useEffect } from 'react';
import { 
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensors,
    useSensor
} from '@dnd-kit/core';

import { useQuery } from '@apollo/client'
import { QUERY_USERS } from '../lib/utils/queries.js'

import Nav from '../components/Nav.jsx';
import InputPool from '../components/InputPool.jsx';

function Home() {
    const [visible, setVisible] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    const { loading, data } = useQuery(QUERY_USERS);

    const users = data?.users;

    if (loading) return <div>Loading...</div>;

    // WIP
    const handleDragEnd = (e) => {
        console.log(e)
    }

    return (
        <div className="vh-100">
            <div className='h-100 d-flex flex-column'>

                {/* Nav */}
                <Nav visible={visible} setVisible={setVisible} />

                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    {/* Drop Zone */}
                    <div className='bg-secondary flex-grow-1 d-flex overflow-x-auto'>
                        <div className='d-flex border border-dark-subtle border-5 rounded-5 m-3' style={{ width: 'fit-content' }}>

                            {/* Input 1 */}
                            <div className='border border-light-subtle border-5 rounded-4 m-3 p-3' style={{ minWidth: '15vw' }}>
                                <p className='mb-3 bg-dark-subtle p-1 rounded-2 text-center'>Chorus</p>
                                <div className="d-flex justify-content-between align-items-center btn btn-light p-1 px-2 mb-2 rounded-2 fs-6 text-start">
                                    <span>All in</span>
                                    <i className="fa-solid fa-trash"></i>
                                </div>
                                <div className="d-flex justify-content-between align-items-center btn btn-light p-1 px-2 mb-2 rounded-2 fs-6 text-start">
                                    <span>Full groove</span>
                                    <i className="fa-solid fa-trash"></i>
                                </div>
                            </div>

                            {/* Input 2 */}
                            <div className='d-flex flex-column border border-light-subtle border-5 rounded-4 m-3 p-3' style={{ minWidth: '15vw' }}>
                                <p className='mb-3 bg-dark-subtle p-1 rounded-2 text-center'>Pre-Chorus</p>
                                <div className='d-flex justify-content-between align-items-center btn btn-light p-1 px-2 mb-2 rounded-2 fs-6 text-start'>
                                    <span>Soft</span>
                                    <i className="fa-solid fa-trash"></i>
                                </div>
                                <div className='d-flex justify-content-between align-items-center btn btn-light p-1 px-2 rounded-2 fs-6 text-start'>
                                    <span>Drums in</span>
                                    <i className="fa-solid fa-trash"></i>
                                </div>
                            </div>

                            <div className='d-flex flex-column border border-light-subtle border-5 rounded-4 m-3 p-3' style={{ minWidth: '15vw' }}>
                                <p className='mb-3 bg-dark-subtle p-1 rounded-2 text-center'>Pre-Chorus</p>
                                <div className='d-flex justify-content-between align-items-center btn btn-light p-1 px-2 mb-2 rounded-2 fs-6 text-start'>
                                    <span>Soft</span>
                                    <i className="fa-solid fa-trash"></i>
                                </div>
                                <div className='d-flex justify-content-between align-items-center btn btn-light p-1 px-2 rounded-2 fs-6 text-start'>
                                    <span>Drums in</span>
                                    <i className="fa-solid fa-trash"></i>
                                </div>
                            </div>

                            <div className='d-flex flex-column border border-light-subtle border-5 rounded-4 m-3 p-3' style={{ minWidth: '15vw' }}>
                                <p className='mb-3 bg-dark-subtle p-1 rounded-2 text-center'>Pre-Chorus</p>
                                <div className='d-flex justify-content-between align-items-center btn btn-light p-1 px-2 mb-2 rounded-2 fs-6 text-start'>
                                    <span>Soft</span>
                                    <i className="fa-solid fa-trash"></i>
                                </div>
                                <div className='d-flex justify-content-between align-items-center btn btn-light p-1 px-2 rounded-2 fs-6 text-start'>
                                    <span>Drums in</span>
                                    <i className="fa-solid fa-trash"></i>
                                </div>
                            </div>

                            <div className='d-flex flex-column border border-light-subtle border-5 rounded-4 m-3 p-3' style={{ minWidth: '15vw' }}>
                                <p className='mb-3 bg-dark-subtle p-1 rounded-2 text-center'>Pre-Chorus</p>
                                <div className='d-flex justify-content-between align-items-center btn btn-light p-1 px-2 mb-2 rounded-2 fs-6 text-start'>
                                    <span>Soft</span>
                                    <i className="fa-solid fa-trash"></i>
                                </div>
                                <div className='d-flex justify-content-between align-items-center btn btn-light p-1 px-2 rounded-2 fs-6 text-start'>
                                    <span>Drums in</span>
                                    <i className="fa-solid fa-trash"></i>
                                </div>
                            </div>

                            <div className='d-flex flex-column border border-light-subtle border-5 rounded-4 m-3 p-3' style={{ minWidth: '15vw' }}>
                                <p className='mb-3 bg-dark-subtle p-1 rounded-2 text-center'>Pre-Chorus</p>
                                <div className='d-flex justify-content-between align-items-center btn btn-light p-1 px-2 mb-2 rounded-2 fs-6 text-start'>
                                    <span>Soft</span>
                                    <i className="fa-solid fa-trash"></i>
                                </div>
                                <div className='d-flex justify-content-between align-items-center btn btn-light p-1 px-2 rounded-2 fs-6 text-start'>
                                    <span>Drums in</span>
                                    <i className="fa-solid fa-trash"></i>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Draggable Zone */}
                    {visible && 
                        <InputPool/>}
                </DndContext>

            </div>
        </div>
    )
};

export default Home;