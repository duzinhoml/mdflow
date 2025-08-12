import { useState } from "react";

import { useWindowResize } from "../../lib/constants.js";

import Tabs from "./Tabs.jsx";
import CurrentTab from "./CurrentTab.jsx";

function ArrangementSelector() {
    const [currentTab, setCurrentTab] = useState(null);
    const screenWidth = useWindowResize();
    
    return (
        <div className='bg-dark rounded-top-2' style={{ minHeight: '25vh' }}>
            <Tabs setCurrentTab={setCurrentTab} screenWidth={screenWidth}/>
            <CurrentTab currentTab={currentTab} screenWidth={screenWidth}/>
        </div>
    )
};

export default ArrangementSelector;