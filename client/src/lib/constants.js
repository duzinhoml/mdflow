import { useState, useEffect, useCallback } from 'react';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useSensors, useSensor, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { useUser } from '../contexts/UserContext.jsx';
import { useSongData } from '../contexts/SongDataContext.jsx';
import { useSong } from '../contexts/SongContext.jsx';

import Auth from './utils/auth.js';

import { useMutation } from '@apollo/client';
import { 
    CREATE_SETLIST, CREATE_SONG, CREATE_SECTION, CREATE_NOTE, 
    UPDATE_SETLIST_TITLE, UPDATE_SONG_TITLE, UPDATE_SECTION_ORDER, 
    DELETE_SETLIST_BY_ID, DELETE_SONG_BY_ID, DELETE_SECTION_BY_ID, DELETE_NOTE_BY_ID 
} from './utils/mutations.js';
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
            { label: 'Percussion', color: '#cccccc', children: [
                { label: 'Drums', color: '#cccccc' },
                { label: 'Perc', color: '#cccccc' },
                { label: 'Loop', color: '#cccccc' }
            ] },
            { label: 'Bass', color: '#cccccc', children: [
                { label: 'Bass', color: '#cccccc' },
                { label: 'Synth Bass', color: '#cccccc' }
            ] },
            { label: 'Guitar', color: '#cccccc', children: [
                { label: 'Acoustic Guitar', color: '#cccccc' },
                { label: 'Electric Guitar', color: '#cccccc' }
            ] },
            { label: 'Keys', color: '#cccccc', children: [
                { label: 'Piano', color: '#cccccc' },
                { label: 'Organ', color: '#cccccc' },
                { label: 'Keys', color: '#cccccc' }
            ] },
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

// Updating Setlist Title
export function useUpdateSetlistTitle() {
    const { setUserData } = useUser();
    const { setlistData, setSetlistData } = useSongData();
    const { currentSetlist, setCurrentSetlist } = useSong();
    const [createSetlist] = useMutation(CREATE_SETLIST, { refetchQueries: [QUERY_ME] });
    const [updateSetlistTitle] = useMutation(UPDATE_SETLIST_TITLE, { refetchQueries: [QUERY_ME] });

    useEffect(() => {
        if (currentSetlist?.title) setSetlistData(prev => ({ ...prev, title: currentSetlist.title}))
        else setSetlistData(prev => ({ ...prev, title: ""}));
    }, [currentSetlist]);

    const handleInputChange = (e) => {
        const { value } = e.target;
        setSetlistData(prev =>  ({ ...prev, title: value }))
    };

    useEffect(() => {
        if (!setlistData.title || setlistData.title === currentSetlist?.title) return;

        const debounceTimeout = setTimeout(async () => {
            try {
                // No Setlist
                if (!currentSetlist) {
                    const { data: newSetlistData} = await createSetlist({
                        variables: {
                            input: { title: setlistData.title }
                        }
                    });
                    const newSetlist = newSetlistData.createSetlist;
                    
                    setCurrentSetlist(newSetlist);
                    setUserData(prev => ({
                        ...prev,
                        setlists: [...(prev.setlists || []), newSetlist],
                    }));
                }
                else {
                    // Current Setlist
                    await updateSetlistTitle({
                        variables: {
                            setlistId: currentSetlist?._id,
                            title: setlistData.title
                        }
                    });

                    setCurrentSetlist(prev => ({ ...prev, title: setlistData.title }));
                    setUserData(prev => ({
                        ...prev,
                        setlists: prev.setlists.map(setlist => setlist._id === currentSetlist?._id ?
                            { ...setlist, title: setlistData.title }
                            : setlist
                        )
                    }));
                }
            } 
            catch (err) {
                console.error(err);
            }
        }, 500);

        return () => clearTimeout(debounceTimeout);
    }, [setlistData.title]);

    return handleInputChange;
}

// Updating Song Title
export function useUpdateSongTitle() {
    const { setUserData } = useUser();
    const { songData, setSongData } = useSongData();
    const { currentSetlist, setCurrentSetlist, currentSong, setCurrentSong } = useSong();
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
        if (!currentSetlist) return;
        if (!songData.title || songData.title === currentSong?.title) return;

        const debounceTimeout = setTimeout(async () => {
            try {
                // No Song
                if (!currentSong) {
                    const { data: newSongData} = await createSong({
                        variables: {
                            setlistId: currentSetlist?._id,
                            input: { title: songData.title }
                        }
                    });
                    const newSong = newSongData.createSong;

                    setCurrentSong(newSong);
                    setCurrentSetlist(prev => ({
                        ...prev,
                        songs: [...(prev.songs || []), newSong]
                    }));
                    setUserData(prev => ({
                        ...prev,
                        songs: [...(prev.songs || []), newSong]
                    }));
                }
                else {
                    // Current Song
                    await updateSongTitle({
                        variables: {
                            songId: currentSong?._id,
                            title: songData.title
                        }
                    });

                    setCurrentSong(prev => ({ ...prev, title: songData.title, sections: prev.sections }));
                    setCurrentSetlist(prev => ({
                        ...prev,
                        songs: prev.songs.map(song => song._id === currentSong._id ?
                            { ...song, title: songData.title }
                            : song
                        )
                    }));
                    setUserData(prev => ({
                        ...prev,
                        songs: prev.songs.map(song => song._id === currentSong._id ?
                            { ...song, title: songData.title }
                            : song
                        )
                    }));
                }
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
export function useSectionNoteCreator() {
    const { setUserData } = useUser();
    const [createSong] = useMutation(CREATE_SONG, { refetchQueries: [QUERY_ME] });
    const [createSection] = useMutation(CREATE_SECTION, { refetchQueries: [QUERY_ME] });
    const [createNote] = useMutation(CREATE_NOTE, { refetchQueries: [QUERY_ME] });

    const { currentSong, setCurrentSong, currentSections, setCurrentSections, currentSection } = useSong();
    
    // Create Section
    const handleCreateSection = async (child) => {
        try {
            if (!currentSong) {
                // Create Song
                const { data: songData } = await createSong({
                    variables: {
                        input: { title: "Untitled Song" }
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

// Delete Setlist
export function useDeleteSetlist() {
    const { setUserData } = useUser();
    const { setSetlistData } = useSongData();
    const { currentSetlist, setCurrentSetlist } = useSong();
    const [deleteSetlistById] = useMutation(DELETE_SETLIST_BY_ID, { refetchQueries: [QUERY_ME] });

    const handleDeleteSetlist = async (setlistId) => {
        try {
            await deleteSetlistById({
                variables: {
                    setlistId
                }
            });

            setUserData(prev => {
                const deletedSetlist = prev.setlists.find(setlist => setlist._id === setlistId);
                const updatedSetlists = prev.setlists.filter(setlist => setlist._id !== setlistId);

                const updatedSongs = prev.songs.filter(song => !(deletedSetlist.songs || []).some(dsSong => dsSong._id === song._id));

                return {
                    ...prev,
                    songs: updatedSongs,
                    setlists: updatedSetlists
                }
            });

            if (currentSetlist && setlistId === currentSetlist._id) {
                setCurrentSetlist(null);
                setSetlistData({ title: "" });
            }
        } 
        catch (err) {
            console.error(err);
        }
    }

    return handleDeleteSetlist;
}

// Delete Song
export function useDeleteSong() {
    const { setUserData } = useUser();
    const { setSongData } = useSongData();
    const { setCurrentSetlist, currentSong, setCurrentSong, setCurrentSections } = useSong();
    const [deleteSongById] = useMutation(DELETE_SONG_BY_ID, { refetchQueries: [QUERY_ME] });

    const handleDeleteSong = async (songId) => {
        try {
            await deleteSongById({
                variables: {
                    songId
                }
            });

            setCurrentSetlist(prev => ({
                ...prev,
                songs: prev.songs.filter(song => song._id !== songId)
            }));
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
    const { currentSong, setCurrentSong, currentSections, setCurrentSections } = useSong();
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
    const { currentSong, setCurrentSong, currentSection } = useSong();

    const [deleteNoteById] = useMutation(DELETE_NOTE_BY_ID, { refetchQueries: [QUERY_ME] });

    const handleDeleteNote = async (noteId, sectionId) => {
        if (currentSection?._id !== sectionId) return;

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

// Delete Parent
export function useDelete() {
    const handleDeleteSetlist = useDeleteSetlist();
    const handleDeleteSong = useDeleteSong();
    const handleDeleteSection = useDeleteSection();

    const handleDelete = useCallback((category, itemId) => {
        switch(category.toLowerCase()) {
            case "setlists": handleDeleteSetlist(itemId); break;
            case "songs": handleDeleteSong(itemId); break;
            case "sections": handleDeleteSection(itemId); break;
            default: console.error(`Unknown delete category: ${category}`); break;
        }
    }, [handleDeleteSetlist, handleDeleteSong, handleDeleteSection]);

    return handleDelete;
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
    const { currentSong, setCurrentSong, currentSections, setCurrentSections } = useSong();

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
    const { currentSection } = useSong();

    const handleHoverEffect = (area, state) => {
        setIsHovered(prev => {
            const updated = { ...prev, [area]: state };

            if (updated.notes) {
                setAllowDrag(false);
                return updated;
            }

            if (updated.label || updated.notes) setAllowDrag(false);
            else if (updated.card && (!updated.label && !updated.notes)) setAllowDrag(true);
            
            return updated;
        });
    };

    const isCurrentSection = (id) => currentSection?._id === id && currentSection !== null;
    
    const hoverBg = (id) => {
        if (!id) return "transparent";
        else if (isCurrentSection(id)) return "#3c3d4eff";
        else if (isHovered?.card && (isHovered?.label || isHovered?.notes)) return "transparent";
        else if (isHovered?.card) return "#3c3d4eff";
        else return "transparent"
    }

    return { isCurrentSection, hoverBg, isHovered, setIsHovered, allowDrag, setAllowDrag, handleHoverEffect };
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