import { useState } from "react";

import Draggable from "../dndComponents/Draggable.jsx";
import { INPUT_POOL, useWindowResize } from "../lib/constants.js";

function InputPool() {
    const [currentTab, setCurrentTab] = useState(null);
    const screenWidth = useWindowResize();

    return (
        <div className='bg-dark mb-2' style={{ minHeight: '25vh' }}>
            <div className='justify-content-center my-3 mx-0 px-2 row'>
                {INPUT_POOL.map(input => (
                    <button 
                        key={input.id}
                        onClick={() => setCurrentTab(input)} 
                        className="btn btn-secondary mx-1 col-3 flex-grow-1 flex-md-grow-0" 
                        data-bs-toggle="collapse" 
                        data-bs-target={`#collapseExample${input.id}`} 
                        aria-expanded="false" 
                        aria-controls="collapseExample"
                        style={{ fontSize: screenWidth >= 768 ? '20px' : '16px' }}
                    >
                        {input.label}
                    </button>
                ))}
            </div>

            <div className="collapse" id={`collapseExample${currentTab?.id}`}>
                <div className="p-2 row m-0 pt-0">
                    {currentTab?.children.map((child, index) => (
                        <Draggable 
                            key={index} 
                            id={child.label} 
                            className="btn btn-dark m-1 flex-grow-1 col-3" 
                            inputStyle={{
                                color: child.color,
                                borderColor: child.color,
                                fontSize: screenWidth >= 768 ? '20px' : '16px'
                            }}
                        >
                            {child.label}
                        </Draggable>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default InputPool;