import { useState, useEffect } from 'react';

// Test Data
export const INPUT_POOL = [
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

// Screen Width
export function useWindowResize() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenWidth;
};