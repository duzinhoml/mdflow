import { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useSensors, useSensor, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { useUser } from '../contexts/UserContext.jsx';
import { useCurrentSong } from '../contexts/CurrentSongContext.jsx';
import { useCurrentSections } from '../contexts/CurrentSectionsContext.jsx';

import Auth from './utils/auth.js';

import { useMutation } from '@apollo/client';
import { CREATE_SECTION } from './utils/mutations.js';
import { UPDATE_SECTION_ORDER, DELETE_SECTION_BY_ID } from './utils/mutations.js';
import { QUERY_ME } from './utils/queries';
import { useEditing } from '../contexts/EditingContext.jsx';

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

// Placeholder

// Adding a Section
export function useCreateSection() {
    const [createSection] = useMutation(CREATE_SECTION, { refetchQueries: [QUERY_ME] });

    const { isEditing } = useEditing();
    const { currentSong } = useCurrentSong();
    const { setCurrentSections } = useCurrentSections();

    const handleCreateSection = async (e, child) => {
        e.preventDefault();

        try {
            if (!isEditing) return;
            if (!currentSong) return;

            const { data } = await createSection({
                variables: {
                    songId: currentSong?._id,
                    input: {
                        label: child.label,
                        color: child.color
                    }
                }
            });
            if (!data) return;

            setCurrentSections(prevSections => [...prevSections, data.createSection]);
        } 
        catch (err) {
            console.error(err);
        }
    };

    return handleCreateSection;
}

// Deleting a Section
export function useDeleteSection() {
    const { setCurrentSections } = useCurrentSections();
    const [deleteSectionById] = useMutation(DELETE_SECTION_BY_ID, {
        refetchQueries: [QUERY_ME]
    });

    const handleDeleteSection = async (sectionId) => {
        setCurrentSections(prev => prev.filter(section => section._id != sectionId))
        await deleteSectionById({
            variables: {
                sectionId
            }
        });
    }

    return handleDeleteSection;
}

// Input Change
export const useInputChange = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return { formData, handleInputChange };
}

// Sensors
export function useDndSensors() {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    return sensors;
}

// Drag Function
export function useDrag() {
    const { currentSections, setCurrentSections } = useCurrentSections();
    const { currentSong } = useCurrentSong();

    const [updateSectionOrder] = useMutation(UPDATE_SECTION_ORDER, {
        refetchQueries: [QUERY_ME],
        awaitRefetchQueries: true
    });

    const handleDragEnd = async (e) => {
        const { active, over } = e;
        if (!over) return;

        const oldIndex = currentSections.findIndex(section => section._id.toString() === active.id);
        const newIndex = currentSections.findIndex(section => section._id.toString() === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const reorderedSections = arrayMove([...currentSections], oldIndex, newIndex);
            setCurrentSections(reorderedSections);
                
            await updateSectionOrder({
                variables: {
                    songId: currentSong._id.toString(),
                    sectionIds: reorderedSections.map(section => section._id.toString())
                }
            });
        };
    };

    return handleDragEnd;
};

// Authentication Render
export function useLoginCheck() {
    const { loading, error } = useUser();
    const loginCheck = Auth.loggedIn();

    useEffect(() => {
        if (loginCheck && error) console.error("Error fetching user data:", error);
    }, [loginCheck, error]);

    return { loginCheck, loading };
}

// ApolloProvider Client
export function useApolloProvider() {
    const httpLink = createHttpLink({
        uri: process.env.NODE_ENV === 'production' ? '/graphql' : 'http://localhost:3001/graphql'
    });

    const authLink = setContext((_, { headers }) => {
        const token = localStorage.getItem('id_token');

        return {
            headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
            }
        };
    });

    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    });

    return client;
}