function Nav({ visible, setVisible }) {

    return (
        <nav className="navbar bg-danger-subtle px-2">
            <span className='navbar-brand'>MDFlow</span>
            <button onClick={() => setVisible(prev => !prev)} className="btn btn-primary align-self-start">{!visible ? 'Open' : 'Close'}</button>
        </nav>
    );
};

export default Nav;