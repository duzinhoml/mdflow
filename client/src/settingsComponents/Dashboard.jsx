import Nav from "./Nav/index.jsx";
import Options from "./Options/index.jsx";

function Dashboard() {
    return (
        <div className="h-100 d-flex flex-column">
            <Nav />
            <div className="rounded-bottom-2" style={{ borderBottom: '4px solid #3a3b47'}}></div>

            <div className="vh-100 d-flex">
                <Options />   
            </div>
        </div>
    );
};

export default Dashboard