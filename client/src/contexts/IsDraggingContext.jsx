import { useState, useContext, createContext } from "react";

const IsDraggingContext = createContext();

export const IsDraggingProvider = ({ children }) => {
    const [draggingId, setDraggingId] = useState(null);

    return (
        <IsDraggingContext.Provider value={{ draggingId, setDraggingId }}>
            {children}
        </IsDraggingContext.Provider>
    );
};

export const useDragging = () => useContext(IsDraggingContext);