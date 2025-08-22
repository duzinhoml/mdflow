import { useSongData } from '../contexts/SongDataContext.jsx';
import { useSong } from '../contexts/SongContext.jsx';
import { useUpdateSongTitle } from '../lib/constants.js';

function SongTitle() {
    const { songData } = useSongData();
    const { currentSetlist, currentSong } = useSong();
    const handleInputChange = useUpdateSongTitle();

    return (
        <div className='d-flex justify-content-center align-items-center my-2'>
            <i className="fa-solid fa-angle-left text-light" style={{ cursor: 'pointer' }}></i>
            {currentSong ? (
                <input 
                    name='currentSongTitle'
                    type="text" 
                    className='text-light text-center mx-4 p-1 border-2 border-primary rounded'
                    onChange={handleInputChange} 
                    value={songData.title}
                    style={{ 
                        border: 'none',
                        backgroundColor: 'transparent',
                        outlineColor: 'grey',
                        cursor: 'text'
                    }}
                    autoComplete='off'
                />
            ) : (
                <input 
                    name='songTitle'
                    type="text" 
                    className='text-light text-center mx-4 p-1 border-2 border-primary rounded'
                    placeholder={currentSetlist ? "Enter song name..." : "Need a setlist first"}
                    onChange={handleInputChange} 
                    value={songData.title}
                    style={{ 
                        border: 'none',
                        backgroundColor: 'transparent',
                        outlineColor: 'grey',
                        cursor: currentSetlist ? 'text' : 'default'
                    }}
                    autoComplete='off'
                    disabled={currentSetlist ? false : true}
                /> 
            )
            }
            <i className="fa-solid fa-angle-right text-light" style={{ cursor: 'pointer' }}></i>
        </div>
    );
}

export default SongTitle;