import { useState, useEffect } from "react";

import { useToggleVisible } from '../../contexts/ToggleVisibleContext.jsx';

import Tabs from "./Tabs.jsx";
import CurrentTab from "./CurrentTab.jsx";

import './index.css';

function ArrangementSelector() {
    const [currentTab, setCurrentTab] = useState(null);
    const { visible } = useToggleVisible();

    useEffect(() => setCurrentTab(null), [visible.selector]);
    
    return (
        <div className={`rounded-top-2 selector ${visible.selector ? 'show' : 'hide'}`}>
            <Tabs setCurrentTab={setCurrentTab} />
            <CurrentTab currentTab={currentTab} />
        </div>
    )
};

export default ArrangementSelector;