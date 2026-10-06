import { useSong } from "../../contexts/SongContext.jsx";
import { useSearch } from "../../contexts/SearchTermContext.jsx";
import Filter from "./Filter.jsx";

function FilterLogic() {
    const { currentSetlist } = useSong();
    const { searchTerm, filter, searchedItems, filteredItems } = useSearch();

    // 1. Search Active
    if (searchTerm) {
        if (currentSetlist && filter === "Songs") {
            const matches = (currentSetlist?.songs || []).filter(song =>
                song.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (matches.length > 0) {
                return matches.map(item => <Filter key={item._id} item={item} filter={filter} />);
            }
        }

        const searched = searchedItems(filter);
        if (searched && searched.length > 0) {
            return searched.map(item => <Filter key={item._id} item={item} filter={filter} />);
        }

        return (
            <div className="text-center py-4 px-2">
                <i className="fa-solid fa-magnifying-glass text-muted mb-2" style={{ fontSize: '20px' }}></i>
                <p className="text-light fw-medium mb-1" style={{ fontSize: '14px' }}>No matches found</p>
                <p className="text-muted" style={{ fontSize: '12px' }}>
                    No {filter.toLowerCase()} match "{searchTerm}"
                </p>
            </div>
        );
    }

    // 2. Setlists View: Show all setlists in user's library (with active highlighted)
    if (filter === "Setlists") {
        const allSetlists = filteredItems("Setlists");
        if (allSetlists && allSetlists.length > 0) {
            return allSetlists.map(item => <Filter key={item._id} item={item} filter={filter} />);
        }

        return (
            <div className="text-center py-4 px-2">
                <i className="fa-solid fa-folder-plus text-muted mb-2" style={{ fontSize: '22px' }}></i>
                <p className="text-light fw-medium mb-1" style={{ fontSize: '14px' }}>No Setlists Yet</p>
                <p className="text-muted" style={{ fontSize: '12px' }}>
                    Type a setlist name in the top bar to create your first setlist.
                </p>
            </div>
        );
    }

    // 3. Songs View: If setlist is active, show its songs; otherwise show all user songs
    if (filter === "Songs") {
        if (currentSetlist) {
            const setlistSongs = currentSetlist.songs || [];
            if (setlistSongs.length > 0) {
                return (
                    <div className="d-flex flex-column">
                        <div className="d-flex align-items-center justify-content-between mb-2 px-1 text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <span>In: {currentSetlist.title}</span>
                            <span>{setlistSongs.length} songs</span>
                        </div>
                        {setlistSongs.map(song => (
                            <Filter key={song._id} item={song} filter={filter} />
                        ))}
                    </div>
                );
            }

            return (
                <div className="text-center py-4 px-2">
                    <i className="fa-solid fa-music text-muted mb-2" style={{ fontSize: '22px' }}></i>
                    <p className="text-light fw-medium mb-1" style={{ fontSize: '14px' }}>Empty Setlist</p>
                    <p className="text-muted" style={{ fontSize: '12px' }}>
                        Add a new song to "{currentSetlist.title}".
                    </p>
                </div>
            );
        }

        // No active setlist, show all songs in library
        const allSongs = filteredItems("Songs");
        if (allSongs && allSongs.length > 0) {
            return (
                <div className="d-flex flex-column">
                    <div className="mb-2 px-1 text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <span>All Songs in Library ({allSongs.length})</span>
                    </div>
                    {allSongs.map(item => (
                        <Filter key={item._id} item={item} filter={filter} />
                    ))}
                </div>
            );
        }

        return (
            <div className="text-center py-4 px-2">
                <i className="fa-solid fa-compact-disc text-muted mb-2" style={{ fontSize: '22px' }}></i>
                <p className="text-light fw-medium mb-1" style={{ fontSize: '14px' }}>No Songs in Library</p>
                <p className="text-muted" style={{ fontSize: '12px' }}>
                    Create a setlist and start building your songs.
                </p>
            </div>
        );
    }

    return null;
}

export default FilterLogic;