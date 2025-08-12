

function SongLayout({ children }) {

    return (
        <div 
            className="flex-grow-1 d-flex overflow-x-auto temp-bg"
        >
                <div className="d-flex border border-dark-subtle border-5 rounded-5 m-3" style={{ boxShadow: 'inset 2px 2px 6px black' }}>
                    {children}
                </div>
        </div>
    );
};

export default SongLayout;