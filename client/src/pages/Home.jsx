import Login from "../components/LoginRegister/Login.jsx";
import Dashboard from "../components/Dashboard.jsx";

import { ToggleInputPoolProvider } from "../contexts/ToggleInputPoolContext.jsx";
import { CurrentSongProvider } from "../contexts/CurrentSongContext.jsx";

import { useLoginCheck } from "../lib/constants.js";

function Home() {
    const { loginCheck, loading } = useLoginCheck();

    if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><h1 className="text-light">Loading...</h1></div>;

    return (
        <>
            {!loginCheck ? (
                <Login />
            ) : (
                <ToggleInputPoolProvider>
                    <CurrentSongProvider>
                        <Dashboard />
                    </CurrentSongProvider>
                </ToggleInputPoolProvider>
            )}
        </>
    )
};

export default Home;