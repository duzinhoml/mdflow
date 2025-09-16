import SetlistTitle from "./SetlistTitle.jsx";
import SongTitle from "./SongTitle.jsx";
import DndDashboard from "./DndComponents/DndDashboard.jsx"

import ArrangementSelector from "../../components/ArrangementSelector/index.jsx";
import MusicSelector from "./MusicSelector/index.jsx";

function Body() {

    return (
        <div className="h-100 d-flex flex-column">
            <SetlistTitle />
            <SongTitle />
            <DndDashboard />
            {/*  */}
            <ArrangementSelector />
            <MusicSelector />
        </div>
    );
};

export default Body;