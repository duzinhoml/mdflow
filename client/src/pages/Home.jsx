import { useState } from "react";

import Login from "../components/LoginRegister/Login/index.jsx";
import Register from "../components/LoginRegister/Register/index.jsx";
import Dashboard from "../components/Dashboard.jsx";
import SmallDashboard from "../smallComponents/Dashboard.jsx";

import { useWindowResize, useLoginCheck } from "../lib/constants.js";

function Home() {
    const [accountStep, setAccountStep] = useState("login");
    const { isMobile } = useWindowResize();
    const { loginCheck, loading } = useLoginCheck();

    if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><h1 className="text-light">Loading...</h1></div>;

    return (
        <>
            {!loginCheck ? (
                accountStep === "login" ? <Login setAccountStep={setAccountStep} /> : <Register setAccountStep={setAccountStep} />
            ) : (
                isMobile ? <SmallDashboard /> : <Dashboard /> 
            )}
        </>
    )
};

export default Home;