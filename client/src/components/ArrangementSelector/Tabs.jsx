import { INPUT_POOL } from "../../lib/constants.js";

import './index.css';

function Tabs({ setCurrentTab, screenWidth }) {

    return (
        <div className='justify-content-center my-3 mx-0 px-2 row gap-2'>
            {INPUT_POOL.map(input => (
                <button 
                    key={input.id}
                    onClick={() => setCurrentTab(input)} 
                    className={`btn mx-1 col-3 flex-grow-1 flex-md-grow-0 labels d-flex justify-content-center align-items-center`} 
                    data-bs-toggle="collapse" 
                    data-bs-target={`#collapseExample${input.id}`} 
                    aria-expanded="false" 
                    aria-controls="collapseExample"
                    style={{ fontSize: screenWidth >= 768 ? '20px' : '16px' }}
                >
                    {input.label}
                    <i className={`${input.icon} ms-2`}></i>
                </button>
            ))}
        </div>
    );
};

export default Tabs;