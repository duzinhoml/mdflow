

function SongLayout({ children }) {

    return (
        <div className="flex-grow-1 d-flex overflow-x-auto" style={{ backgroundColor: '#6c757d' }}>
            <div className="d-flex border border-dark-subtle border-5 rounded-5 m-3">
                {children}
            </div>
        </div>
    );
};

export default SongLayout;