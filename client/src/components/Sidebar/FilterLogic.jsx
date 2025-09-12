import { useSong } from "../../contexts/SongContext.jsx";
import { useSearch } from "../../contexts/SearchTermContext.jsx";

import Filter from "./Filter.jsx";

function FilterLogic() {
    const { currentSetlist } = useSong();
    const { searchTerm, filter, searchedItems, filteredItems } = useSearch();

    if (searchTerm && currentSetlist && filter === "Setlists") return <Filter key={currentSetlist._id} item={currentSetlist} filter={filter}/>;
    if (searchTerm && currentSetlist && filter === "Songs")
        return (currentSetlist?.songs.filter(song => song.title.toLowerCase().includes(searchTerm.toLowerCase())) || []).map(item => <Filter key={item._id} item={item} filter={filter} />);

    if (currentSetlist && filter === "Setlists") return <Filter key={currentSetlist._id} item={currentSetlist} filter={filter}/>
    if (currentSetlist && filter === "Songs") {
        if (currentSetlist?.songs.length) return (currentSetlist?.songs).map(song => <Filter key={song._id} item={song} filter={filter} />)
    }

    if (searchTerm) return searchedItems(filter).map(item => <Filter key={item._id} item={item} filter={filter} />);

    const items = filteredItems(filter);
    if (items.length && !currentSetlist) return items.map(item => <Filter key={item._id} item={item} filter={filter} />);

    return (
        <div className="text-center mt-2">
            <p className="fs-5 fw-medium text-light">No {filter} yet</p>
            <p className="text-white-50">
                Start by creating your first {filter.toLowerCase().split('').slice(0, filter.length - 1)}.
                Just enter a name and you’re good to go!
            </p>
        </div>
    );
}

export default FilterLogic;