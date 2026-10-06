import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useSensors, useSensor, PointerSensor, MouseSensor, TouchSensor, KeyboardSensor } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { useUser } from '../contexts/UserContext.jsx';
import { useSongData } from '../contexts/SongDataContext.jsx';
import { useSong } from '../contexts/SongContext.jsx';

import Auth from './utils/auth.js';

import { useMutation } from '@apollo/client';
import { 
    LOGIN_USER, CREATE_USER, CREATE_SETLIST, CREATE_SONG, CREATE_SECTION, CREATE_NOTE, 
    UPDATE_PASSWORD, UPDATE_SETLIST_TITLE, UPDATE_SONG_TITLE, UPDATE_SONG_BPM, UPDATE_SONG_TIME_SIGNATURE, UPDATE_SECTION_ORDER, 
    DELETE_USER, DELETE_SETLIST_BY_ID, DELETE_SONG_BY_ID, DELETE_SECTION_BY_ID, DELETE_NOTE_BY_ID 
} from './utils/mutations.js';
import { QUERY_ME } from './utils/queries';

// Test Data
export const INPUT_POOL = [
    { id: 1, label: 'Sections', icon: 'fa-solid fa-layer-group', children: [
            { label: 'Intro', color: '#61a6ae' },
            { label: 'Verse', color: '#7c79be' },
            { label: 'Pre-Chorus', color: '#cdab4c' },
            { label: 'Chorus', color: '#d16a33' },
            { label: 'Bridge', color: '#b1727b' },
            { label: 'Vamp', color: '#b75c52' },
            { label: 'Turnaround', color: '#8ab950' },
            { label: 'Interlude', color: '#b75a52' },
            { label: 'Instrumental', color: '#8ab950' },
            { label: 'Tag', color: '#d16a33' },
            { label: 'Refrain', color: '#64a07c' },
            { label: 'Outro', color: '#61a6ae' },
        ]
    },
    { id: 2, label: 'Dynamics', icon: 'fa-solid fa-chart-simple', children: [
            { label: 'Soft' },
            { label: 'Low' },
            { label: 'Mid' },
            { label: 'High' },
            { label: 'All in' }
        ]
    },
    { id: 3, label: 'Instruments', icon: 'fa-solid fa-guitar', children: [
            { label: 'Percussion', children: [
                { label: 'Drums' },
                { label: 'Perc' },
                { label: 'Loop' }
            ] },
            { label: 'Bass', children: [
                { label: 'Bass' },
                { label: 'Synth Bass' }
            ] },
            { label: 'Guitar', children: [
                { label: 'Acoustic Guitar' },
                { label: 'Electric Guitar' }
            ] },
            { label: 'Keys', children: [
                { label: 'Piano' },
                { label: 'Organ' },
                { label: 'Keys' }
            ] },
        ]
    },
    { id: 4, label: 'Create', icon: 'fa-solid fa-pen-to-square' }
];

// Screen Width
export function useWindowResize() {
    const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { screenWidth, isMobile };
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
        if (currentSong) {
            setSongData(prev => ({
                ...prev,
                title: currentSong.title || "",
                bpm: currentSong.bpm || 120,
                timeSignature: currentSong.timeSignature || '4/4'
            }));
        } else {
            setSongData(prev => ({
                ...prev,
                title: "",
                bpm: 120,
                timeSignature: '4/4'
            }));
        }
    }, [currentSong, setSongData]);
    
    const handleInputChange = (e) => {
        const { value } = e.target;
        setSongData(prev => ({ ...prev, title: value }));
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
                            input: {
                                title: songData.title,
                                bpm: Number(songData.bpm) || 120,
                                timeSignature: songData.timeSignature || '4/4'
                            }
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
                        songs: [...(prev.songs || []), newSong],
                        setlists: prev.setlists.map(setlist => setlist._id === currentSetlist._id ?
                            { ...setlist, songs: [...(setlist.songs || []), newSong] }
                            : setlist
                        )
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
                    setUserData(prev => {
                        const updatedSetlists = prev.setlists.map(setlist => {
                            if (setlist._id === currentSetlist._id) {
                                return {
                                    ...setlist,
                                    songs: setlist.songs.map(song => song._id === currentSong._id ?
                                        { ...song, title: songData.title }
                                        : song
                                    )
                                }
                            }
                            return setlist;
                        });

                        return {
                            ...prev,
                            songs: prev.songs.map(song => song._id === currentSong._id ?
                                { ...song, title: songData.title }
                                : song
                            ),
                            setlists: updatedSetlists
                        }
                    });
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

// Updating Song BPM
export function useUpdateSongBpm() {
    const { songData, setSongData } = useSongData();
    const { currentSetlist, setCurrentSetlist, currentSong, setCurrentSong } = useSong();
    const { setUserData } = useUser();
    const [updateSongBpm] = useMutation(UPDATE_SONG_BPM, { refetchQueries: [QUERY_ME] });

    const handleBpmChange = async (newBpm) => {
        const parsed = parseInt(newBpm, 10);
        if (isNaN(parsed)) return;
        const clamped = Math.min(Math.max(parsed, 20), 320);

        setSongData(prev => ({ ...prev, bpm: clamped }));

        if (currentSong?._id) {
            try {
                await updateSongBpm({
                    variables: {
                        songId: currentSong._id,
                        bpm: clamped
                    }
                });

                setCurrentSong(prev => prev ? ({ ...prev, bpm: clamped }) : null);
                if (currentSetlist) {
                    setCurrentSetlist(prev => prev ? ({
                        ...prev,
                        songs: prev.songs?.map(s => s._id === currentSong._id ? { ...s, bpm: clamped } : s)
                    }) : null);
                }
                setUserData(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        songs: prev.songs?.map(s => s._id === currentSong._id ? { ...s, bpm: clamped } : s),
                        setlists: prev.setlists?.map(sl => ({
                            ...sl,
                            songs: sl.songs?.map(s => s._id === currentSong._id ? { ...s, bpm: clamped } : s)
                        }))
                    };
                });
            } catch (err) {
                console.error('Error updating BPM:', err);
            }
        }
    };

    return { bpm: songData.bpm || 120, handleBpmChange };
}

// Updating Song Time Signature
export function useUpdateSongTimeSignature() {
    const { songData, setSongData } = useSongData();
    const { currentSetlist, setCurrentSetlist, currentSong, setCurrentSong } = useSong();
    const { setUserData } = useUser();
    const [updateSongTimeSignature] = useMutation(UPDATE_SONG_TIME_SIGNATURE, { refetchQueries: [QUERY_ME] });

    const handleTimeSignatureChange = async (newSig) => {
        if (!newSig || typeof newSig !== 'string') return;
        const trimmed = newSig.trim();

        setSongData(prev => ({ ...prev, timeSignature: trimmed }));

        if (currentSong?._id) {
            try {
                await updateSongTimeSignature({
                    variables: {
                        songId: currentSong._id,
                        timeSignature: trimmed
                    }
                });

                setCurrentSong(prev => prev ? ({ ...prev, timeSignature: trimmed }) : null);
                if (currentSetlist) {
                    setCurrentSetlist(prev => prev ? ({
                        ...prev,
                        songs: prev.songs?.map(s => s._id === currentSong._id ? { ...s, timeSignature: trimmed } : s)
                    }) : null);
                }
                setUserData(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        songs: prev.songs?.map(s => s._id === currentSong._id ? { ...s, timeSignature: trimmed } : s),
                        setlists: prev.setlists?.map(sl => ({
                            ...sl,
                            songs: sl.songs?.map(s => s._id === currentSong._id ? { ...s, timeSignature: trimmed } : s)
                        }))
                    };
                });
            } catch (err) {
                console.error('Error updating time signature:', err);
            }
        }
    };

    return { timeSignature: songData.timeSignature || '4/4', handleTimeSignatureChange };
}

// Adding a Section || Note
export function useSectionNoteCreator() {
    const { setUserData } = useUser();
    const [createSong] = useMutation(CREATE_SONG, { refetchQueries: [QUERY_ME] });
    const [createSection] = useMutation(CREATE_SECTION, { refetchQueries: [QUERY_ME] });
    const [createNote] = useMutation(CREATE_NOTE, { refetchQueries: [QUERY_ME] });
    const [updateSectionOrder] = useMutation(UPDATE_SECTION_ORDER, { refetchQueries: [QUERY_ME] });

    const { currentSetlist, setCurrentSetlist, currentSong, setCurrentSong, currentSections, setCurrentSections, currentSection } = useSong();
    
    // Create Section with optional targetSectionId and position ('left' | 'right' | 'end')
    const handleCreateSection = async (child, targetSectionId = null, position = 'end') => {
        if (!currentSetlist) return;

        try {
            if (!currentSong) {
                // Create Song
                const { data: songData } = await createSong({
                    variables: {
                        setlistId: currentSetlist?._id,
                        input: { title: "Untitled Song" }
                    }
                });
                if (!songData) return;
                const newSong = songData.createSong;
                
                // Add section to new Song
                const { data: sectionData } = await createSection({
                    variables: {
                        songId: newSong._id,
                        input: {
                            label: child.label,
                            color: child.color
                        }
                    }
                });
                if (!sectionData) return;
                const newSection = sectionData.createSection;
                
                // Update User Data
                const updatedSong = {
                    ...newSong,
                    sections: [newSection]
                };
                
                setCurrentSong(updatedSong);
                setCurrentSections([newSection]);
                setCurrentSetlist(prev => ({
                    ...prev,
                    songs: [...(prev.songs || []), updatedSong]
                }));
                setUserData(prev => ({ 
                    ...prev, 
                    setlists: (prev.setlists || []).map(setlist => setlist._id === currentSetlist?._id
                        ? { ...setlist, songs: [...(setlist.songs || []), updatedSong] }
                        : setlist
                    ),
                    songs: [...(prev.songs || []), updatedSong]
                }));
            }
            else {
                // If desktop (no targetSectionId and currentSection exists and screen > 1024), block as original:
                const isDesktop = typeof window !== 'undefined' && window.innerWidth > 1024;
                if (isDesktop && !targetSectionId && currentSection) return;
                
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
                const newSection = data.createSection;

                let updatedSections = [...(currentSections || [])];
                const resolvedTargetId = targetSectionId || (currentSection?._id && !isDesktop ? currentSection._id : null);

                if (resolvedTargetId && position !== 'end') {
                    const targetIndex = updatedSections.findIndex(
                        s => String(s._id) === String(resolvedTargetId)
                    );
                    if (targetIndex !== -1) {
                        const insertIndex = position === 'left' ? targetIndex : targetIndex + 1;
                        updatedSections.splice(insertIndex, 0, newSection);
                    } else {
                        updatedSections.push(newSection);
                    }
                } else {
                    updatedSections.push(newSection);
                }

                // If inserted at a specific index, sync section order to backend
                if (resolvedTargetId && position !== 'end') {
                    try {
                        await updateSectionOrder({
                            variables: {
                                songId: currentSong._id.toString(),
                                sectionIds: updatedSections.map(s => s._id.toString())
                            }
                        });
                    } catch (e) {
                        console.error('Failed to sync section order:', e);
                    }
                }
                
                setCurrentSections(updatedSections);
                setCurrentSong(prev => ({
                    ...prev,
                    sections: updatedSections
                }));
                setCurrentSetlist(prev => ({
                    ...prev,
                    songs: (prev?.songs || []).map(song => String(song._id) === String(currentSong._id)
                        ? { ...song, sections: updatedSections }
                        : song
                    )
                }));
                setUserData(prev => {
                    if (!prev) return prev;
                    const updatedSetlists = (prev.setlists || []).map(setlist => {
                        if (String(setlist._id) === String(currentSetlist?._id)) {
                            return {
                                ...setlist,
                                songs: (setlist.songs || []).map(song => {
                                    if (String(song._id) === String(currentSong._id)) {
                                        return {
                                            ...song,
                                            sections: updatedSections
                                        };
                                    }
                                    return song;
                                })
                            };
                        }
                        return setlist;
                    });

                    return {
                        ...prev,
                        setlists: updatedSetlists,
                        songs: (prev.songs || []).map(song => String(song._id) === String(currentSong._id)
                            ? { ...song, sections: updatedSections }
                            : song
                        )
                    };
                });
            }
        } 
        catch (err) {
            console.error(err);
        }
        
    };

    // Create Note
    const handleCreateNote = async (child, targetSectionId = null) => {
        try {
            if (!currentSong) return;
            const targetSection = targetSectionId 
                ? currentSections?.find(s => s._id?.toString() === targetSectionId?.toString())
                : currentSection;
            if (!targetSection) return;

            const { data } = await createNote({
                variables: {
                    sectionId: targetSection._id,
                    input: { label: child.label }
                }
            });
            if (!data) return;
            const newNote = data.createNote;

            setUserData(prev => {
                const updatedSetlists = prev.setlists.map(setlist => {
                    if (setlist._id === currentSetlist._id) {
                        return {
                            ...setlist,
                            songs: setlist.songs.map(song => {
                                if (song._id === currentSong._id) {
                                    return {
                                        ...song,
                                        sections: song.sections.map(section => {
                                            if (section._id === targetSection._id) {
                                                return {
                                                    ...section,
                                                    notes: [...(section.notes || []), newNote]
                                                }
                                            }
                                            return section
                                        })
                                    }
                                }
                                return song
                            })
                        }
                    }
                    return setlist
                });

                return {
                    ...prev,
                    setlists: updatedSetlists,
                    songs: prev.songs.map(song => song._id === currentSong._id
                        ? {
                            ...song,
                            sections: song.sections.map(section => section._id === targetSection._id
                                ? { ...section, notes: [...section.notes || [], newNote] }
                                : section
                            )
                        }
                        : song
                    )
                }
            });

            setCurrentSections(prev => 
                prev.map(section => section._id === targetSection._id
                    ? { ...section, notes: [...section.notes || [], newNote] }
                    : section
                ));

            setCurrentSong(prev => ({
                ...prev,
                sections: prev.sections.map(section => section._id === targetSection._id
                    ? { ...section, notes: [...section.notes || [], newNote ] }
                    : section
                )
            }));

            setCurrentSetlist(prev => {
                const updatedSongs = prev.songs.map(song => {
                    if (song._id === currentSong._id) {
                        return {
                            ...song,
                            sections: song.sections.map(section => {
                                if (section._id === targetSection._id) {
                                    return {
                                        ...section,
                                        notes: [...(section.notes || []), newNote]
                                    }
                                }
                                return section
                            })
                        }
                    }
                    return song
                })
        
                return {
                    ...prev,
                    songs: updatedSongs
                }
            });
        } 
        catch (err) {
            console.error(err);
        }
    };
    
    const handleInputSelection = (currentTab, child) => {
        if (currentTab.label === "Sections") handleCreateSection(child);
        else handleCreateNote(child);
    }

    const handleCreateSelection = (data) => {
        if (data.type === "Section") handleCreateSection(data);
        else handleCreateNote(data);
    }

    return { 
        handleInputSelection, 
        handleCreateSelection, 
        handleCreateSection, 
        handleCreateNote 
    };
}

// Section Repetition Helpers
export function parseSectionRepetition(rawLabel = '') {
    if (!rawLabel || typeof rawLabel !== 'string') return { baseLabel: '', repeatCount: 1 };
    const trimmed = rawLabel.trim();
    // Matches "Chorus (2x)", "Chorus [3x]", "Chorus 2x", "Chorus x2", "Chorus (x2)"
    const match = trimmed.match(/^(.*?)(?:\s*(?:\((\d+)x\)|\[(\d+)x\]|\((\d+)\)|(\d+)x|x(\d+)))?$/i);
    if (!match) return { baseLabel: trimmed, repeatCount: 1 };
    const num = match[2] || match[3] || match[4] || match[5] || match[6];
    const repeatCount = num ? Math.max(1, parseInt(num, 10)) : 1;
    const baseLabel = (match[1] || trimmed).trim();
    return { baseLabel: baseLabel || trimmed, repeatCount };
}

export function formatSectionLabel(baseLabel = '', repeatCount = 1) {
    const cleanBase = baseLabel.trim();
    if (repeatCount <= 1) return cleanBase;
    return `${cleanBase} (${repeatCount}x)`;
}

// Hook to update section repetition count in local & active session state
export function useUpdateSectionRepetition() {
    const { currentSong, setCurrentSong, currentSections, setCurrentSections, currentSetlist, setCurrentSetlist } = useSong();
    const { setUserData } = useUser();

    const handleUpdateRepetition = (sectionId, newRepeatCount) => {
        const strId = String(sectionId);
        const target = currentSections.find(s => String(s._id) === strId);
        if (!target) return;
        const { baseLabel } = parseSectionRepetition(target.label);
        const newLabel = formatSectionLabel(baseLabel, newRepeatCount);

        const updatedSections = currentSections.map(s => 
            String(s._id) === strId ? { ...s, label: newLabel } : s
        );

        setCurrentSections(updatedSections);
        setCurrentSong(prev => prev ? {
            ...prev,
            sections: updatedSections
        } : prev);

        if (currentSetlist) {
            setCurrentSetlist(prev => prev ? {
                ...prev,
                songs: (prev.songs || []).map(song => 
                    String(song._id) === String(currentSong?._id) 
                        ? { ...song, sections: updatedSections }
                        : song
                )
            } : prev);
        }

        setUserData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                songs: (prev.songs || []).map(song => 
                    String(song._id) === String(currentSong?._id) 
                        ? { ...song, sections: updatedSections }
                        : song
                ),
                setlists: (prev.setlists || []).map(setlist => ({
                    ...setlist,
                    songs: (setlist.songs || []).map(song => 
                        String(song._id) === String(currentSong?._id) 
                            ? { ...song, sections: updatedSections }
                            : song
                    )
                }))
            };
        });
    };

    return handleUpdateRepetition;
}

// Delete Setlist
export function useDeleteSetlist() {
    const { setUserData, userData } = useUser();
    const { setSetlistData, setSongData } = useSongData();
    const { currentSetlist, setCurrentSetlist, currentSong, setCurrentSong, setCurrentSections, setCurrentSection } = useSong();
    const [deleteSetlistById] = useMutation(DELETE_SETLIST_BY_ID, { refetchQueries: [QUERY_ME] });

    const handleDeleteSetlist = async (setlistId) => {
        try {
            const strSetlistId = String(setlistId);
            const deletedSetlist = (userData?.setlists || []).find(s => String(s._id) === strSetlistId) || 
                                   (String(currentSetlist?._id) === strSetlistId ? currentSetlist : null);

            const isCurrentSetlist = Boolean(currentSetlist && String(currentSetlist._id) === strSetlistId);
            const isCurrentSongInDeletedSetlist = Boolean(
                currentSong && (
                    (deletedSetlist?.songs || []).some(s => String(s._id) === String(currentSong._id)) ||
                    (isCurrentSetlist && (currentSetlist?.songs || []).some(s => String(s._id) === String(currentSong._id)))
                )
            );

            await deleteSetlistById({
                variables: {
                    setlistId
                }
            });

            setUserData(prev => {
                if (!prev) return prev;
                const targetDeleted = (prev.setlists || []).find(s => String(s._id) === strSetlistId) || deletedSetlist;
                const updatedSetlists = (prev.setlists || []).filter(s => String(s._id) !== strSetlistId);
                const updatedSongs = (prev.songs || []).filter(song => 
                    !(targetDeleted?.songs || []).some(dsSong => String(dsSong._id) === String(song._id))
                );

                return {
                    ...prev,
                    songs: updatedSongs,
                    setlists: updatedSetlists
                };
            });

            // If deleting the active setlist or if the current song belonged to the deleted setlist,
            // reset all workspace state so the default empty screen appears
            if (isCurrentSetlist || isCurrentSongInDeletedSetlist) {
                setCurrentSetlist(null);
                setSetlistData({ title: "" });
                setCurrentSong(null);
                setSongData({ title: "", bpm: 120, timeSignature: "4/4", sections: [] });
                setCurrentSections([]);
                if (setCurrentSection) setCurrentSection(null);
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
    const { currentSetlist, setCurrentSetlist, currentSong, setCurrentSong, setCurrentSections } = useSong();
    const [deleteSongById] = useMutation(DELETE_SONG_BY_ID, { refetchQueries: [QUERY_ME] });

    const handleDeleteSong = async (songId) => {
        try {
            await deleteSongById({
                variables: {
                    songId
                }
            });

            if (currentSetlist) {
                setCurrentSetlist(prev => ({
                    ...prev,
                    songs: prev.songs.filter(song => song._id !== songId)
                }));
            };

            setUserData(prev => {
                const updatedSongs = prev.songs.filter(song => song._id !== songId);

                const updatedSetlists = prev.setlists.map(setlist => ({
                    ...setlist,
                    songs: (setlist.songs || []).filter(song => song._id !== songId)
                }))

                return {
                    ...prev,
                    songs: updatedSongs,
                    setlists: updatedSetlists
                }
            });

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
    const { 
        currentSetlist, 
        setCurrentSetlist, 
        currentSong, 
        setCurrentSong, 
        currentSections, 
        setCurrentSections, 
        currentSection, 
        setCurrentSection 
    } = useSong();
    const [deleteSectionById] = useMutation(DELETE_SECTION_BY_ID, { refetchQueries: [QUERY_ME] });

    const handleDeleteSection = async (sectionId) => {
        if (!sectionId) return;

        try {
            await deleteSectionById({ variables: { sectionId } });

            if (currentSection && String(currentSection._id) === String(sectionId)) {
                setCurrentSection(null);
            }

            setCurrentSections(prev => (prev || []).filter(section => String(section._id) !== String(sectionId)));
            setCurrentSong(prev => ({ 
                ...prev, 
                sections: (prev?.sections || []).filter(section => String(section._id) !== String(sectionId))
            }));
            setCurrentSetlist(prev => ({
                ...prev,
                songs: (prev?.songs || []).map(song => String(song._id) === String(currentSong?._id)
                    ? { ...song, sections: (song.sections || []).filter(section => String(section._id) !== String(sectionId)) }
                    : song
                )
            }));
            setUserData(prev => {
                if (!prev) return prev;
                const updatedSetlists = (prev.setlists || []).map(setlist => {
                    if (String(setlist._id) === String(currentSetlist?._id)) {
                        return {
                            ...setlist,
                            songs: (setlist.songs || []).map(song => {
                                if (String(song._id) === String(currentSong?._id)) {
                                    return {
                                        ...song,
                                        sections: (song.sections || []).filter(section => String(section._id) !== String(sectionId))
                                    };
                                }
                                return song;
                            })
                        };
                    }
                    return setlist;
                });

                return {
                    ...prev,
                    setlists: updatedSetlists,
                    songs: (prev.songs || []).map(song => String(song._id) === String(currentSong?._id)
                        ? { ...song, sections: (song.sections || []).filter(section => String(section._id) !== String(sectionId)) }
                        : song
                    )
                };
            });
        } 
        catch (err) {
            console.error('Error deleting section:', err);
        }
    };

    return handleDeleteSection;
}

// Deleting a Note
export function useDeleteNote() {
    const { setUserData } = useUser();
    const { currentSetlist, setCurrentSetlist, currentSong, setCurrentSong, currentSections, setCurrentSections, currentSection, setCurrentSection } = useSong();

    const [deleteNoteById] = useMutation(DELETE_NOTE_BY_ID, { refetchQueries: [QUERY_ME] });

    const handleDeleteNote = async (noteId, sectionId) => {
        try {
            await deleteNoteById({ variables: { noteId } });

            setCurrentSections(prev => (prev || []).map(section => 
                String(section._id) === String(sectionId)
                    ? { ...section, notes: (section.notes || []).filter(note => String(note._id) !== String(noteId)) }
                    : section
            ));

            if (currentSection && String(currentSection._id) === String(sectionId)) {
                setCurrentSection(prev => prev ? {
                    ...prev,
                    notes: (prev.notes || []).filter(note => String(note._id) !== String(noteId))
                } : null);
            }

            setCurrentSong(prev => ({
                ...prev,
                sections: (prev.sections || []).map(section => 
                    String(section._id) === String(sectionId)
                        ? { ...section, notes: (section.notes || []).filter(note => String(note._id) !== String(noteId)) }
                        : section
                )
            }));

            setCurrentSetlist(prev => ({
                ...prev,
                songs: (prev.songs || []).map(song => song._id === currentSong?._id
                    ? {
                        ...song,
                        sections: (song.sections || []).map(section => 
                            String(section._id) === String(sectionId)
                                ? { ...section, notes: (section.notes || []).filter(note => String(note._id) !== String(noteId)) }
                                : section
                        )
                    }
                    : song
                )
            }));

            setUserData(prev => {
                const updatedSetlists = (prev.setlists || []).map(setlist => {
                    if (setlist._id === currentSetlist?._id) {
                        return {
                            ...setlist,
                            songs: (setlist.songs || []).map(song => {
                                if (song._id === currentSong?._id) {
                                    return {
                                        ...song,
                                        sections: (song.sections || []).map(section => {
                                            if (String(section._id) === String(sectionId)) {
                                                return {
                                                    ...section,
                                                    notes: (section.notes || []).filter(note => String(note._id) !== String(noteId))
                                                }
                                            }
                                            return section;
                                        })
                                    }
                                }
                                return song;
                            })
                        }
                    }
                    return setlist;
                });

                return {
                    ...prev,
                    setlists: updatedSetlists,
                    songs: (prev.songs || []).map(song => song._id === currentSong?._id
                        ? {
                            ...song,
                            sections: (song.sections || []).map(section => 
                                String(section._id) === String(sectionId)
                                    ? { ...section, notes: (section.notes || []).filter(note => String(note._id) !== String(noteId)) }
                                    : section
                            )
                        }
                        : song
                    )
                };
            });
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

// Login
export const useLogin = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [login, { error }] = useMutation(LOGIN_USER, { refetchQueries: [QUERY_ME] });
    const loginError = error?.message?.includes("Please")

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) error.message = null;
    };

    const handleFormSubmit = async (e, input) => {
        e.preventDefault();

        try {
            const { data } = await login({
                variables: { ...input }
            });

            Auth.login(data.login.token);
        } 
        catch (err) {
            console.error(err);
        }
    };

    return { 
        formData, handleInputChange,
        error, loginError, handleFormSubmit
     };

}

// Register
export const useRegister = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: ""
    });
    const [currentStep, setCurrentStep] = useState(1);

    const [createUser, { error }] = useMutation(CREATE_USER, { refetchQueries: [QUERY_ME] });
    const userError = error?.message?.includes('Username');
    const passError = error?.message?.includes('Password');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) error.message = null;
    }

    const handlePrevStep = () => setCurrentStep(1);

    const handleNextStep = (e) => {
        e.preventDefault();
        setCurrentStep(2)
    };

    const handleFormSubmit = async (e, input) => {
        e.preventDefault();

        try {
            const { data } = await createUser({
                variables: { input }
            });

            Auth.login(data.createUser.token);
        } 
        catch (err) {
            console.error(err);
        }
    }

    return {
        formData, handleInputChange,
        currentStep, error, userError, passError, handlePrevStep, handleNextStep, handleFormSubmit
    }
}

// Update Password
export const useUpdatePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();
    const [updatePassword, { error }] = useMutation(UPDATE_PASSWORD, { refetchQueries: [QUERY_ME] });

    const currentPWError = error?.message === "Incorrect password";
    const newPWError = error?.message?.includes("character");
    const confirmPWError = error?.message === "Passwords do not match";

    const incorrectPassword = error?.message === 'Incorrect password';
    const minChar = error?.message === 'Password must be at least 8 characters long.';
    const maxChar = error?.message === 'Password cannot exceed 50 characters.';
    const specialChar = error?.message === 'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.';
    const noMatch = error?.message === 'Passwords do not match';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) error.message = null;
    }

    const handleFormSubmit = async (e) => {
        try {
            e.preventDefault();
            
            await updatePassword({
                variables: {
                    input: { ...formData }
                }
            });
            navigate('/');
        } 
        catch (err) {
            console.error(err);
        }
    }

    const cancelForm = () => {
        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });

        if (error) error.message = null;
    }

    return { 
        formData, error, 
        currentPWError, newPWError, confirmPWError,
        incorrectPassword, minChar, maxChar, specialChar, noMatch,
        handleInputChange, handleFormSubmit, cancelForm };
}

// Delete User
export const useDeleteUser = () => {
    const [confirmDelete, setConfirmDelete] = useState("");
    const [deleteUser, { error }] = useMutation(DELETE_USER, { refetchQueries: [QUERY_ME] });

    const confirmDeleteError = error?.message === "Incorrect confirmation";

    const handleInputChange = (e) => {
        const { value } = e.target;
        setConfirmDelete(value);

        if (error) error.message = null;
    }

    const handleDeleteUser = async (e, confirmDelete) => {
        e.preventDefault();

        try {
            await deleteUser({
                variables: { confirmDelete }
            });
            
            setConfirmDelete("");
            Auth.logout();
        } 
        catch (err) {
           console.error(err); 
        }
    }

    const cancelForm = () => {
        setConfirmDelete("");

        if (error) error.message = null;
    }

    return { error, confirmDeleteError, confirmDelete, handleInputChange, handleDeleteUser, cancelForm };
}

// Sensors
export function useDndSensors() {
    const sensorsList = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 5
            }
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 180,
                tolerance: 7
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    return Object.assign(sensorsList, { sensors: sensorsList });
}

// Drag Function
export function useDrag() {
    const { userData, setUserData } = useUser();
    const { currentSetlist, setCurrentSetlist, currentSong, setCurrentSong, currentSections, setCurrentSections } = useSong();

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
                setUserData(prev => {
                    const updatedSetlists = prev.setlists.map(setlist => {
                        if (setlist._id === currentSetlist?._id) {
                            return {
                                ...setlist,
                                songs: setlist.songs.map(song => song._id === currentSong?._id ?
                                    { ...song, sections: reorderedSections } : song
                                )
                            }
                        }
                        return setlist;
                    });

                    return {
                        ...prev,
                        setlists: updatedSetlists,
                        songs: prev.songs.map(song => song._id === currentSong._id ?
                            { ...song, sections: reorderedSections } : song
                        )
                    }
                });
                setCurrentSetlist(prev => ({
                    ...prev,
                    songs: prev.songs.map(song => song._id === currentSong._id ? 
                        { ...song, sections: reorderedSections } : song)
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

// createdAt & updatedAt Conversion
export function useTimeConversion() {
    const handleTimeConversion = (timestamp) => {
        const numTimestamp = Number(timestamp);
        const date = new Date(numTimestamp);

        const formattedDate = 
        `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;

        return formattedDate;
    }

    return handleTimeConversion;
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
        uri: import.meta.env?.PROD ? '/graphql' : 'http://localhost:3001/graphql'
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