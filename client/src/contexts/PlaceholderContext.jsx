import { useState, useContext, createContex } from 'react';

const PlaceholderContext = createContex();

export const PlaceholderProvider = ({ children }) => {
    const [isSelecting, setIsSelecting] = useState(false);

    // const handlePlaceholder = () => {
        
    // }

    return (
        <PlaceholderContext.Provider value={{ isSelecting, setIsSelecting }}>
            {children}
        </PlaceholderContext.Provider>
    );
};

export const usePlaceholder = () => useContext(PlaceholderContext);