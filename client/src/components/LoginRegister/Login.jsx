import { useMutation } from "@apollo/client";

import { LOGIN_USER } from "../../lib/utils/mutations.js";
import Auth from "../../lib/utils/auth.js";

import { useInputChange } from "../../lib/constants.js";

function Login() {
    const [login, { loading, error }] = useMutation(LOGIN_USER);
    const { formData, handleInputChange } = useInputChange();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login({
                variables: { ...formData }
            });

            Auth.login(data.login.token);
        } 
        catch (err) {
            console.error("Login error:", err);
        }
    };

    return (
         <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="row w-100 justify-content-center flex-column flex-md-row">
                <div className="col-12 col-md-5 d-flex justify-content-center align-items-center text-center text-md-start pe-md-5">
                    <div className="text-center">
                        <h1 className='text-light'>MDFlow</h1>
                        <p style={{ color: '#F63366' }}>Nest Your Ideas, Watch Them Grow</p> 
                    </div>
                </div>

                <div className="col-12 col-md-5 ps-md-5">
                    <form className="border border-5 rounded p-4 needs-validation" onSubmit={handleFormSubmit}>
                        <h2 className="text-center mb-4 text-light">Login</h2>
                        <div className="row gy-3">
                            <div className="col-12 has-validation form-floating">
                                <input
                                    id="usernameLoginInput"
                                    type="text"
                                    className={`form-control form-control-lg login-input`}
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    autoComplete='off'
                                    style={{ fontSize: '16px' }}
                                />
                                <label htmlFor="usernameLoginInput" className="ms-2" style={{ color: 'grey' }}>Username</label>
                            </div>

                            <div className="col-12 form-floating">
                                <input
                                    id="passwordLoginInput"
                                    type="password"
                                    className={`form-control form-control-lg login-input`}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    autoComplete='off'
                                    style={{ fontSize: '16px' }}
                                />
                                <label htmlFor="passwordLoginInput" className="ms-2" style={{ color: 'grey' }}>Password</label>
                            </div>

                            <div className="col-12">
                                <button
                                    type="submit"
                                    className="btn btn-lg w-100 text-light login-btn"
                                >
                                    Login
                                </button>
                            </div>

                            <div className="col-12">
                                <p className="text-center text-light">
                                    Don't have an account? <span style={{ cursor: 'pointer', textDecoration: 'underline', color: '#F63366' }}>Sign up</span>
                                </p>
                                {error && <div className="login-error-feedback mt-3 mb-2">{error.message}</div>}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;