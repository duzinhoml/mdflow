import { useState, useEffect } from "react";

import { useUser } from "../contexts/UserContext.jsx";

import Header from "./Header/index.jsx";
import Body from "./Body/index.jsx";
import Footer from "./Footer/index.jsx";

function SmallDashboard() {
    const [activePage, setActivePage] = useState("Home");
    const { user, userData, setUserData } = useUser();

    useEffect(() => { if (!userData) setUserData(user) }, []);

    return (
        <div className="d-flex flex-column vh-100">
            <Header />
            <Body activePage={activePage} setActivePage={setActivePage} />
            <Footer activePage={activePage} setActivePage={setActivePage} />
        </div>
    );
};

export default SmallDashboard;