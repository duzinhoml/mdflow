import { useSongData } from "../../contexts/SongDataContext";
import { useSong } from "../../contexts/SongContext";
import { useUpdateSetlistTitle } from "../../lib/constants";

import './index.css';

function SetlistTitle() {
    const { setlistData } = useSongData();
    const { currentSetlist } = useSong();
    const handleInputChange = useUpdateSetlistTitle();

    return (
        <div className="d-flex justify-content-center">
            {currentSetlist ? (
                <input 
                    name='currentSetlistTitle'
                    type="text" 
                    className='text-light text-center p-1 border-2 border-primary rounded setlist-input'
                    onChange={handleInputChange} 
                    value={setlistData.title}
                    style={{ 
                        border: 'none',
                        backgroundColor: 'transparent',
                        outlineColor: 'hsl(235, 13%, 42%)',
                        cursor: 'text'
                    }}
                    autoComplete='off'
                />
            ) : (
                <input 
                    name='setlistTitle'
                    type="text" 
                    className='text-light text-center p-1 border-2 border-primary rounded setlist-input'
                    placeholder='Enter setlist name...'
                    onChange={handleInputChange} 
                    value={setlistData.title}
                    style={{ 
                        border: 'none',
                        backgroundColor: 'transparent',
                        outlineColor: 'grey',
                        cursor: 'text'
                    }}
                    autoComplete='off'
                /> 
            )
            }
        </div>
    );
};

export default SetlistTitle;