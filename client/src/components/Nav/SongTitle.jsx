import { useSongData } from '../../contexts/SongDataContext.jsx';
import { useCurrentSong } from '../../contexts/CurrentSongContext.jsx';
import { useUpdateTitle } from '../../lib/constants.js';

function SongTitle() {
    const { songData } = useSongData();
    const { currentSong } = useCurrentSong();
    const handleInputChange = useUpdateTitle();

    return (
        <>
            {currentSong ? (
                <input 
                    type="text" 
                    className='text-light text-center p-1 border-2 border-primary rounded'
                    onChange={handleInputChange} 
                    value={songData.title}
                    style={{ 
                        border: 'none',
                        backgroundColor: 'transparent',
                        outlineColor: 'grey',
                        cursor: 'text'
                    }}
                />
            ) : (
                <input 
                    type="text" 
                    className='text-light text-center p-1 border-2 border-primary rounded'
                    placeholder='Song Title'
                    onChange={handleInputChange} 
                    value={songData.title}
                    style={{ 
                        border: 'none',
                        backgroundColor: 'transparent',
                        outlineColor: 'grey',
                        cursor: 'text'
                    }}
                /> 
            )
            }
        </>
    );
};

export default SongTitle;