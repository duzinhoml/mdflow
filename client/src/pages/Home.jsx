import { useState, useEffect } from 'react';

import { useQuery } from '@apollo/client'
import { QUERY_USERS } from '../lib/utils/queries.js'

import Nav from '../components/Nav.jsx';
import InputPool from '../components/InputPool.jsx';

import { INPUT_POOL, useWindowResize } from '../lib/constants.js';

function Home() {
    const [visible, setVisible] = useState(false)
    const [currentTab, setCurrentTab] = useState(null);

    const screenWidth = useWindowResize();

    const { loading, data } = useQuery(QUERY_USERS);

    const users = data?.users;

    if (loading) return <div>Loading...</div>;

    return (
        <div className="vh-100">
            <div className='h-100 d-flex flex-column'>

                {/* Nav */}
                <Nav visible={visible} setVisible={setVisible} />

                {/* Drop Zone */}
                <div className='bg-secondary flex-grow-1 d-flex'>
                    <div className='d-flex border border-dark-subtle border-5 rounded-5 w-100 m-3'>
                        <div className='border border-light-subtle border-5 rounded-4 m-3 p-3 text-center' style={{ minWidth: '15vw' }}>
                            Chorus
                        </div>
                        <div className='d-flex flex-column border border-light-subtle border-5 rounded-4 m-3 p-3' style={{ minWidth: '15vw' }}>
                            <p className='mb-3 bg-dark-subtle p-1 rounded-2 text-center'>Pre-Chorus</p>
                            <div className='d-flex justify-content-between align-items-center btn btn-light p-1 px-2 mb-2 rounded-2 fs-6 text-start'>
                                <span>Soft</span>
                                <i class="fa-solid fa-trash"></i>
                            </div>
                            <div className='d-flex justify-content-between align-items-center btn btn-light p-1 px-2 rounded-2 fs-6 text-start'>
                                <span>Drums in</span>
                                <i class="fa-solid fa-trash"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Draggable Zone */}
                {visible && 
                    <InputPool 
                        inputPool={INPUT_POOL} 
                        currentTab={currentTab} 
                        setCurrentTab={setCurrentTab} 
                        screenWidth={screenWidth} 
                    />}

            </div>
        </div>
    )
};

export default Home;