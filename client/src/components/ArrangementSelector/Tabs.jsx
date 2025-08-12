import { INPUT_POOL } from "../../lib/constants.js";

function Tabs({ setCurrentTab, screenWidth }) {

    return (
        <div className='justify-content-center my-3 mx-0 px-2 row gap-2'>
            {INPUT_POOL.map(input => (
                <button 
                    key={input.id}
                    onClick={() => setCurrentTab(input)} 
                    className="btn btn-secondary mx-1 col-3 flex-grow-1 flex-md-grow-0" 
                    data-bs-toggle="collapse" 
                    data-bs-target={`#collapseExample${input.id}`} 
                    aria-expanded="false" 
                    aria-controls="collapseExample"
                    style={{ fontSize: screenWidth >= 768 ? '20px' : '16px', textShadow: '2px 2px 4px black' }}
                >
                    {input.label}
                </button>
            ))}
        </div>
    );
};

export default Tabs;