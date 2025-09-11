import { useState } from 'react';
import { useSectionNoteCreator } from '../../lib/constants';

import './index.css';

function Custom() {
    const [creationFormData, setCreationFormData] = useState({
        type: "Section",
        label: "",
        color: "#757795"
    });
    const { handleCreateSelection } = useSectionNoteCreator();

    const handleSelectType = (type) => setCreationFormData(prev => ({ ...prev, type }));

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCreationFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleFormSubmit = () => {
        handleCreateSelection(creationFormData);
        setCreationFormData(prev => ({
            ...prev,
            label: "",
        }));
    }

    return (
        <>
            {/* Tabs */}
            <div className='d-flex justify-content-center gap-3 mb-3'>
                <button 
                    type="submit"
                    className={`btn createTabs col-1 fs-5 ${creationFormData.type === "Section" && "current"}`}
                    onClick={() => handleSelectType("Section")}
                >
                    Section
                </button>
                <button 
                    type="submit"
                    className={`btn createTabs col-1 fs-5 ${creationFormData.type === "Note" && "current"}`}
                    onClick={() => handleSelectType("Note")}
                >
                    Note
                </button>
            </div>

            {/* Inputs */}
            <div className='d-flex justify-content-center gap-3'>
                <input 
                    type="text" 
                    name="label" 
                    value={creationFormData.label}
                    className="btn-lg col-2 text-center text-light rounded-2 labelInput" 
                    style={{ border: `4px solid ${creationFormData.type === "Section" ? creationFormData.color : "hsl(235, 13%, 52%)"}` }}
                    onChange={handleInputChange} 
                    placeholder='Enter Title...'
                    autoComplete='off'
                />

                {creationFormData.type === "Section" && 
                    <div className='d-flex justify-content-start col-1'>
                        <input 
                            type="color" 
                            name="color"
                            value={creationFormData.color}
                            className="btn-lg rounded-2 text-start colorInput"
                            onChange={handleInputChange}
                        />
                    </div>}

                {/* Add Button */}
                <div className={`position-absolute end-0 me-3`}>
                    <button className={`btn add ${creationFormData.label ? "display" : "close"}`} onClick={handleFormSubmit}>
                        <i class="fa-solid fa-plus me-2"></i>
                        Add {creationFormData.type}
                    </button>
                </div>
            </div>

        </>
    );
};

export default Custom;