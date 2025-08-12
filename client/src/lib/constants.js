import { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useSensors, useSensor, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { useUser } from '../contexts/UserContext.jsx';
import { useSongData } from '../contexts/SongDataContext.jsx';
import { useCurrentSong } from '../contexts/CurrentSongContext.jsx';
import { useCurrentSections } from '../contexts/CurrentSectionsContext.jsx';
import { useCurrentSection } from '../contexts/CurrentSectionContext.jsx';

import Auth from './utils/auth.js';

import { useMutation } from '@apollo/client';
import { CREATE_SONG, CREATE_SECTION, CREATE_NOTE, UPDATE_SONG_TITLE, UPDATE_SECTION_ORDER, DELETE_SONG_BY_ID, DELETE_SECTION_BY_ID, DELETE_NOTE_BY_ID } from './utils/mutations.js';
import { QUERY_ME } from './utils/queries';

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

// Updating Song Title
export function useUpdateTitle() {
    const { setUserData } = useUser();
    const { songData, setSongData } = useSongData();
    const { currentSong, setCurrentSong } = useCurrentSong();
    const [createSong] = useMutation(CREATE_SONG, { refetchQueries: [QUERY_ME] });
    const [updateSongTitle] = useMutation(UPDATE_SONG_TITLE, { refetchQueries: [QUERY_ME] });

    useEffect(() => {
        if (currentSong?.title) setSongData(prev => ({ ...prev, title: currentSong.title}))
        else setSongData(prev => ({ ...prev, title: ""}));
    }, [currentSong]);
    
    const handleInputChange = (e) => {
        const { value } = e.target;
        setSongData(prev =>  ({ ...prev, title: value }))
    };
    
    useEffect(() => {
        if (!songData.title || songData.title === currentSong?.title) return;

        const debounceTimeout = setTimeout(async () => {
            try {
                if (!currentSong) {
                    const { data: newSongData} = await createSong({
                        variables: {
                            input: {
                                title: songData.title,
                                sections: []
                            }
                        }
                    });
                    const newSong = newSongData.createSong;

                    setUserData(prev => ({
                        ...prev,
                        songs: [...prev.songs, newSong]
                    }));

                    setCurrentSong(newSong);
                    return;
                }

                setCurrentSong(prev => ({ ...prev, title: songData.title, sections: prev.sections }));
                await updateSongTitle({
                    variables: {
                        songId: currentSong?._id,
                        title: songData.title
                    }
                });

                setUserData(prev => ({
                    ...prev,
                    songs: prev.songs.map(song => song._id === currentSong._id ?
                        { ...song, title: songData.title }
                        : song
                    )
                }));
            } 
            catch (err) {
                console.error(err);
            }
        }, 500);

        return () => clearTimeout(debounceTimeout);
    }, [songData.title]);

    return handleInputChange;
}

// Adding a Section || Note
export function useCreateSection() {
    const { setUserData } = useUser();
    const [createSong] = useMutation(CREATE_SONG, { refetchQueries: [QUERY_ME] });
    const [createSection] = useMutation(CREATE_SECTION, { refetchQueries: [QUERY_ME] });
    const [createNote] = useMutation(CREATE_NOTE, { refetchQueries: [QUERY_ME] });

    const { currentSong, setCurrentSong } = useCurrentSong();
    const { currentSections, setCurrentSections } = useCurrentSections();
    const { currentSection } = useCurrentSection();
    
    // Create Section
    const handleCreateSection = async (child) => {
        try {
            if (!currentSong) {
                // Create Song
                const { data: songData } = await createSong({
                    variables: {
                        input: {
                            title: "Untitled Song",
                            sections: []
                        }
                    }
                });
                if (!songData) return;
                const newSong = songData.createSong
                
                // Add section to new Song
                const { data: sectionData } = await createSection({
                    variables: {
                        songId: songData.createSong?._id,
                        input: {
                            label: child.label,
                            color: child.color
                        }
                    }
                });
                if (!sectionData) return;
                const newSection = sectionData.createSection
                
                // Update User Data
                const updatedSong = {
                    ...newSong,
                    sections: [newSection]
                };
                
                setCurrentSong(updatedSong);
                setCurrentSections([newSection]);
                
                setUserData(prev => ({ 
                    ...prev, 
                    songs: [...prev.songs, updatedSong]
                }))
            }
            else {
                if (currentSection) return;
                
                // Current Song    
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
                const newSection = data.createSection

                const updatedSections = [...currentSections, newSection];
                
                setCurrentSections(updatedSections);
                setCurrentSong(prev => ({
                    ...prev,
                    sections: updatedSections
                }));
                setUserData(prev => ({
                    ...prev,
                    songs: prev.songs.map(song => song._id === currentSong._id
                        ? { ...song, sections: updatedSections }
                        : song
                    )
                }));
            }
        } 
        catch (err) {
            console.error(err);
        }
        
    };

    // Create Note
    const handleCreateNote = async (child) => {
        try {
            if (!currentSong) return;
            if (!currentSection) return;

            const { data } = await createNote({
                variables: {
                    sectionId: currentSection._id,
                    input: {
                        label: child.label,
                        color: child.color
                    }
                }
            });
            if (!data) return;
            const newNote = data.createNote;

            setUserData(prev => ({
                ...prev,
                songs: prev.songs.map(song => song._id === currentSong._id
                    ? {
                        ...song,
                        sections: song.sections.map(section => section._id === currentSection._id
                            ? { ...section, notes: [...section.notes || [], newNote] }
                            : section
                        )
                    }
                    : song
                )
            }));

            setCurrentSections(prev => 
                prev.map(section => section._id === currentSection._id
                    ? { ...section, notes: [...section.notes || [], newNote] }
                    : section
                ));

            setCurrentSong(prev => ({
                ...prev,
                sections: prev.sections.map(section => section._id === currentSection._id
                    ? { ...section, notes: [...section.notes || [], newNote ] }
                    : section
                )
            }));
        }
        catch (err) {
            console.error(err);
        }
    };
    
    const handleInputSelection = (currentTab, child) => {
        if (currentTab.label === "Sections") handleCreateSection(child);
        else handleCreateNote(child);
    }

    return handleInputSelection;
}

// Delete Song
export function useDeleteSong() {
    const { setUserData } = useUser();
    const { setSongData } = useSongData();
    const { setCurrentSections } = useCurrentSections();
    const { currentSong, setCurrentSong } = useCurrentSong();
    const [deleteSongById] = useMutation(DELETE_SONG_BY_ID, { refetchQueries: [QUERY_ME] });

    const handleDeleteSong = async (songId) => {
        try {
            await deleteSongById({
                variables: {
                    songId
                }
            });
            
            setUserData(prev => ({
                ...prev,
                songs: prev.songs.filter(song => song._id !== songId)
            }));

            if (currentSong && songId === currentSong._id) {
                setCurrentSong(null);
                setSongData({ title: '', sections: [] });
                setCurrentSections([]);
            };
        } 
        catch (err) {
            console.error(err);
        }
    };

    return handleDeleteSong;
}

// Deleting a Section
export function useDeleteSection() {
    const { setUserData } = useUser();
    const { currentSong, setCurrentSong } = useCurrentSong();
    const { currentSections, setCurrentSections } = useCurrentSections();
    const [deleteSectionById] = useMutation(DELETE_SECTION_BY_ID, { refetchQueries: [QUERY_ME] });

    const handleDeleteSection = async (sectionId) => {
        if (!currentSong) return;
        if (!currentSections.length) return;

        try {
            await deleteSectionById({ variables: { sectionId } });

            setCurrentSections(prev => prev.filter(section => section._id !== sectionId));
            setCurrentSong(prev => ({ 
                ...prev, 
                sections: prev.sections.filter(section => section._id !== sectionId)
            }));

            setUserData(prev => ({
                ...prev,
                songs: prev.songs.map(song => song._id === currentSong._id
                    ? { ...song, sections: song.sections.filter(section => section._id !== sectionId) }
                    : song
                )
            }));
        } 
        catch (err) {
            console.error(err);
        }
    }

    return handleDeleteSection;
}

// Deleting a Note
export function useDeleteNote() {
    const { setUserData } = useUser();
    const { currentSong, setCurrentSong } = useCurrentSong();

    const [deleteNoteById] = useMutation(DELETE_NOTE_BY_ID, { refetchQueries: [QUERY_ME] });

    const handleDeleteNote = async (noteId, sectionId) => {
        try {
            await deleteNoteById({ variables: { noteId } });

            setUserData(prev => ({
                ...prev,
                songs: prev.songs.map(song => song._id === currentSong._id
                    ? {
                        ...song,
                        sections: song.sections.map(section => section._id === sectionId
                            ? { ...section, notes: section.notes.filter(note => note._id !== noteId) }
                            : section
                        )
                    }
                    : song
                )
            }));

            setCurrentSong(prev => ({
                ...prev,
                sections: prev.sections.map(section => section._id === sectionId
                    ? { ...section, notes: section.notes.filter(note => note._id !== noteId) }
                    : section
                )
            }));
        } 
        catch (err) {
            console.error(err);
        }
    };

    return handleDeleteNote;
}

// Login Input Change
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
    const { userData, setUserData } = useUser();
    const { currentSong, setCurrentSong } = useCurrentSong();
    const { currentSections, setCurrentSections } = useCurrentSections();

    const [updateSectionOrder] = useMutation(UPDATE_SECTION_ORDER, {
        refetchQueries: [QUERY_ME],
        awaitRefetchQueries: true
    });

    const handleDragEnd = async (e) => {
        const { active, over } = e;
        if (!over) return;

        const oldIndex = currentSections.findIndex(section => section._id.toString() === active.id);
        const newIndex = currentSections.findIndex(section => section._id.toString() === over.id);

        const prevUserData = userData;
        const prevSections = currentSections;

        try {
            if (oldIndex !== -1 && newIndex !== -1) {
                const reorderedSections = arrayMove([...currentSections], oldIndex, newIndex);
                setUserData(prev => ({
                    ...prev,
                    songs: prev.songs.map(song => song._id === currentSong._id ?
                        { ...song, sections: reorderedSections } : song
                    )
                }));
                setCurrentSong(prev => ({
                    ...prev,
                    sections: reorderedSections
                }));
                setCurrentSections(reorderedSections);
                    
                await updateSectionOrder({
                    variables: {
                        songId: currentSong._id.toString(),
                        sectionIds: reorderedSections.map(section => section._id.toString())
                    }
                });
            };
        } 
        catch (err) {
            console.error(err);
            setUserData(prevUserData);
            setCurrentSections(prevSections);
        }
    };

    return handleDragEnd;
};

// Hover over Sections/Notes
export function useHoverEffect() {
    const [isHovered, setIsHovered] = useState({
        card: false,
        label: false,
        notes: false
    });
    const [allowDrag, setAllowDrag] = useState(true);
    const { currentSection } = useCurrentSection();

    const handleHoverEffect = (area, state) => {
        setIsHovered(prev => {
            const updated = { ...prev, [area]: state };
            
            if (updated.label || updated.notes) setAllowDrag(false);
            else if (updated.card && (!updated.label && !updated.notes)) setAllowDrag(true);
            
            return updated;
        });
    };

    const isCurrentSection = (id) => {
        return currentSection?._id === id && currentSection !== null
    }
    
    const hoverBg = (id) => {
        if (!id) return "transparent";
        else if (isCurrentSection(id)) return "#3c3d4eff";
        else if (isHovered.card && (isHovered.label || isHovered.notes)) return "transparent";
        else if (isHovered.card) return "#3c3d4eff";
        else return "transparent"
    }

    return { isCurrentSection, hoverBg, isHovered, setIsHovered, allowDrag, handleHoverEffect };
}

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