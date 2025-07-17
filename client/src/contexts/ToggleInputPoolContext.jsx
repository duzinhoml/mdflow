import { useState, useContext, createContext } from 'react';

const ToggleInputPoolContext = createContext();

export const ToggleInputPoolProvider = ({ children }) => {
    const [visible, setVisible] = useState(false);

    const toggleInputPool = () => {
        setVisible(prev => !prev);
    };

    return (
        <ToggleInputPoolContext.Provider value={{ visible, toggleInputPool }}>
            {children}
        </ToggleInputPoolContext.Provider>
    );
};

export const useToggleInputPool = () => useContext(ToggleInputPoolContext);