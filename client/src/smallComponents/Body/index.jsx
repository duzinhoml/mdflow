import SetlistTitle from "./SetlistTitle.jsx";
import SongTitle from "./SongTitle.jsx";
import DndDashboard from "./DndComponents/DndDashboard.jsx"

import ArrangementSelector from "../../components/ArrangementSelector/index.jsx";
import MusicSelector from "./MusicSelector/index.jsx";
import Settings from "./Settings/index.jsx";

function Body({ activePage }) {

    return (
        <div className="h-100 d-flex flex-column">
            {activePage !== "Settings" ? 
                <>
                    <SetlistTitle />
                    <SongTitle />
                    <DndDashboard />
                    <ArrangementSelector />
                    <MusicSelector />
                </>
                :
                <Settings />}
        </div>
    );
};

export default Body;