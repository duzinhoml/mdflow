import { useDelete } from "../../lib/constants.js";

import { useSong } from "../../contexts/SongContext.jsx";

function Filter({ item, filter }) {
    const handleDelete = useDelete();
    
    const { handleSetCurrent } = useSong();
    
    return (
        <div key={item._id} className="d-flex align-items-center mb-3">
            <button 
                className="btn btn-lg list-group-item py-2 rounded-2 flex-grow-1 text-start" 
                onClick={() => handleSetCurrent(filter, item)}
            >
                {item.title}
            </button>
            <button className="btn btn-danger ms-2" onClick={() => handleDelete(filter, item._id)}>
                <i className="fa-solid fa-trash"></i>
            </button>
        </div>
    );
};

export default Filter;