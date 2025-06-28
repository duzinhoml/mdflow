import { useState, useEffect } from 'react';

import { useQuery } from '@apollo/client'
import { QUERY_USERS } from '../utils/queries'

import Nav from '../components/Nav.jsx';
import InputPool from '../components/InputPool.jsx';

function Home() {
    const [visible, setVisible] = useState(false)
    const [currentTab, setCurrentTab] = useState(null);

    // Screen Width
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [screenWidth])

    const { loading, data } = useQuery(QUERY_USERS);

    const users = data?.users;

    if (loading) return <div>Loading...</div>;
    
    // Test Data
    const inputPool = [
        { id: 1, label: 'Sections', children: [
                { label: 'Intro', color: '#61a6ae' },
                { label: 'Verse', color: '#7c79be' },
                { label: 'Pre-Chorus', color: '#cdab4c' },
                { label: 'Vamp', color: '#b75c52' },
                { label: 'Chorus', color: '#d16a33' },
                { label: 'Turnaround', color: '#8ab950' },
                { label: 'Interlude', color: '#b75a52' },
                { label: 'Instrumental', color: '#8ab950' },
                { label: 'Bridge', color: '#b1727b' },
                { label: 'Tag', color: '#d16a33' },
                { label: 'Refrain', color: '#64a07c' },
                { label: 'Outro', color: '#61a6ae' },
            ]
        },
        { id: 2, label: 'Dynamics', children: [
                { label: 'High', color: '#cccccc' },
                { label: 'Low', color: '#cccccc' },
                { label: 'Mid', color: '#cccccc' },
                { label: 'All in', color: '#cccccc' },
                { label: 'Soft', color: '#cccccc' }
            ]
        },
        { id: 3, label: 'Instruments', children: [
                { label: 'Guitar', color: '#cccccc' },
                { label: 'Piano', color: '#cccccc' },
                { label: 'Bass', color: '#cccccc' },
                { label: 'Drums', color: '#cccccc' }
            ]
        }
    ];

    return (
        <div className="vh-100">
            <div className='h-100 d-flex flex-column'>

                {/* Nav */}
                <Nav visible={visible} setVisible={setVisible} />

                {/* Drop Zone */}
                <div className='bg-danger bg-gradient flex-grow-1 d-flex justify-content-between'>
                    <span>Container 1</span>
                </div>

                {/* Draggable Zone */}
                {visible && 
                    <InputPool 
                        inputPool={inputPool} 
                        currentTab={currentTab} 
                        setCurrentTab={setCurrentTab} 
                        screenWidth={screenWidth} 
                    />}

            </div>
        </div>
    )
};

export default Home;