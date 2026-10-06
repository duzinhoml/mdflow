import { createContext, useContext, useState } from 'react';

const PaletteDragContext = createContext({
    activePaletteItem: null,
    setActivePaletteItem: () => {},
    isDraggingPalette: false,
    isSwipingPalette: false,
    setIsSwipingPalette: () => {},
});

export function PaletteDragProvider({ children }) {
    const [activePaletteItem, setActivePaletteItem] = useState(null);
    const [isSwipingPalette, setIsSwipingPalette] = useState(false);

    const value = {
        activePaletteItem,
        setActivePaletteItem,
        isDraggingPalette: !!activePaletteItem,
        isSwipingPalette,
        setIsSwipingPalette
    };

    return (
        <PaletteDragContext.Provider value={value}>
            {children}
        </PaletteDragContext.Provider>
    );
}

export function usePaletteDrag() {
    return useContext(PaletteDragContext);
}

export default PaletteDragContext;
