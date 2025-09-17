import { useSongData } from '../../contexts/SongDataContext.jsx';
import { useSong } from '../../contexts/SongContext.jsx';
import { useUpdateSetlistTitle } from '../../lib/constants.js';

function SetlistTitle() {
    const { setlistData } = useSongData();
    const { currentSetlist } = useSong();
    const handleInputChange = useUpdateSetlistTitle();

    return (
        <>
            {currentSetlist ? (
                <input 
                    name='currentSetlistTitle'
                    type="text" 
                    className='text-light text-center p-1 border-2 border-primary rounded position-absolute top-50 start-50 translate-middle'
                    onChange={handleInputChange} 
                    value={setlistData.title}
                    style={{ 
                        border: 'none',
                        backgroundColor: 'transparent',
                        boxShadow: '0px 0px 2px 2px hsl(235, 10%, 15%)',
                        outlineColor: 'hsl(235, 13%, 42%)',
                        cursor: 'text'
                    }}
                    autoComplete='off'
                />
            ) : (
                <input 
                    name='setlistTitle'
                    type="text" 
                    className='text-light text-center p-1 border-2 border-primary rounded position-absolute top-50 start-50 translate-middle'
                    placeholder='Enter setlist name...'
                    onChange={handleInputChange} 
                    value={setlistData.title}
                    style={{ 
                        border: 'none',
                        backgroundColor: 'transparent',
                        boxShadow: '0px 0px 2px 2px hsl(235, 10%, 15%)',
                        outlineColor: 'grey',
                        cursor: 'text'
                    }}
                    autoComplete='off'
                /> 
            )
            }
        </>
    );
};

export default SetlistTitle;