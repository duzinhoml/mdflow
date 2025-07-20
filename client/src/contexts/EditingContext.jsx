import { useState, useContext, createContext } from 'react';

const EditingContext = createContext();

export const EditingProvider = ({ children }) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <EditingContext.Provider value={{ isEditing, setIsEditing}}>
            {children}
        </EditingContext.Provider>
    );
};

export const useEditing = () => useContext(EditingContext);