import { useSong } from "../../contexts/SongContext.jsx";
import { INPUT_POOL, useWindowResize } from "../../lib/constants.js";

import './index.css';

function Tabs({ setCurrentTab }) {
    const { currentSong } = useSong();
    const { screenWidth } = useWindowResize();

    return (
        <div className='justify-content-center my-3 mx-3 row gap-2'>
            {INPUT_POOL.map(input => {
                if (input.id === 4 && !currentSong) return;
                return (
                    <button 
                        key={input.id}
                        onClick={() => setCurrentTab(input)} 
                        className={`btn mx-0 col-lg-2 col-4 flex-grow-1 flex-md-grow-1 labels d-flex justify-content-center align-items-center`} 
                        data-bs-toggle="collapse" 
                        data-bs-target={`#collapseExample${input.id}`} 
                        aria-expanded="false" 
                        aria-controls="collapseExample"
                        style={{ fontSize: screenWidth >= 768 ? '20px' : '16px' }}
                    >
                        {input.label}
                        <i className={`${input.icon} ms-2`}></i>
                    </button>
                )
            })}
        </div>
    );
};

export default Tabs;