import { useState, useEffect } from "react";

import { useToggleVisible } from '../../contexts/ToggleVisibleContext.jsx';

import { useWindowResize } from "../../lib/constants.js";

import Tabs from "./Tabs.jsx";
import CurrentTab from "./CurrentTab.jsx";

import './index.css';

function ArrangementSelector() {
    const [currentTab, setCurrentTab] = useState(null);
    const { visible } = useToggleVisible();
    const screenWidth = useWindowResize();

    useEffect(() => setCurrentTab(null), [visible.selector]);
    
    return (
        <div className={`bg-dark rounded-top-2 selector ${visible.selector ? 'show' : 'hide'}`} style={{ minHeight: '25vh' }}>
            <Tabs setCurrentTab={setCurrentTab} screenWidth={screenWidth}/>
            <CurrentTab currentTab={currentTab} screenWidth={screenWidth}/>
        </div>
    )
};

export default ArrangementSelector;