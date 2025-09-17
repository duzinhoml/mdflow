import { useState } from "react";

import Options from "./Options.jsx";
import UpdatePassword from "./UpdatePassword.jsx";
import DeleteUser from "./DeleteUser.jsx";

function Settings({ setActivePage }) {
    const [option, setOption] = useState("");

    return (
        <>
            {!option && <Options setOption={setOption} />}
            {option && 
                (option === "update" ? <UpdatePassword setOption={setOption} setActivePage={setActivePage}/>
                : <DeleteUser setOption={setOption} />)}
        </>
    );
}

export default Settings;