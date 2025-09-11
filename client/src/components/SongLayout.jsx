function SongLayout({ children }) {
    return (
        <div className="flex-grow-1 d-flex overflow-x-auto ml-bg">
            <div 
                className="d-flex rounded-5 m-3 mt-2" 
                style={{ border: 'solid 5px hsl(235, 13%, 42%)', boxShadow: '0px 0px 2px 2px hsl(235, 13%, 27%)' }}
            >
                {children}
            </div>
        </div>
    );
};

export default SongLayout;