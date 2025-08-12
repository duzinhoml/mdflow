import { useState, useContext, createContext } from 'react';

const ToggleVisibleContext = createContext();

export const ToggleVisibleProvider = ({ children }) => {
    const [visible, setVisible] = useState({
        selector: false,
        sidebar: false
    });

    const toggleVisible = (element) => {
        setVisible(prev => ({
            ...prev,
            [element]: !prev[element]
        }));

        if (element === 'selector') setVisible(prev => ({ ...prev, sidebar: false}))
        if (element === 'sidebar') setVisible(prev => ({ ...prev, selector: false}))
    };

    return (
        <ToggleVisibleContext.Provider value={{ visible, setVisible, toggleVisible }}>
            {children}
        </ToggleVisibleContext.Provider>
    );
};

export const useToggleVisible = () => useContext(ToggleVisibleContext);