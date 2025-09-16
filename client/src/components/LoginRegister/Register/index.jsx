import { useRegister } from "../../../lib/constants";

import './index.css';
import ProgressBar from "./ProgressBar";

function Register({ setAccountStep }) {
    const { formData, handleInputChange, 
        currentStep, error, userError, passError, handlePrevStep, handleNextStep, handleFormSubmit 
    } = useRegister();

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="row w-100 justify-content-center flex-column flex-lg-row">
                <div className="col-12 col-lg-5 d-flex justify-content-center align-items-center text-center text-lg-start pe-lg-5">
                    <div className="text-center">
                        <h1 className='text-light'>MDFlow</h1>
                        <p style={{ color: '#A86FFF' }}>Nest Your Ideas, Watch Them Grow</p> 
                    </div>
                </div>

                <div className="col-12 col-lg-5 ps-lg-5">

                    <form 
                        className="border border-5 rounded p-4 position-relative needs-validation" 
                        onSubmit={currentStep === 1 ? handleNextStep : (e) => handleFormSubmit(e, formData)}
                    >
                        <h2 className="text-center mb-4 text-light">Create Account</h2>
                        <div className="row gy-3">
                            {currentStep === 1 && (
                                <>
                                    <div className="col-12 has-validation form-floating">
                                        <input
                                            id="firstNameInput"
                                            type="text"
                                            className="form-control form-control-lg register-input"
                                            name="firstName"
                                            placeholder="First Name"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            autoComplete='off'
                                            style={{ fontSize: '16px' }}
                                        />
                                        <label htmlFor="firstNameInput" className="ms-2 fs-6" style={{ color: 'grey' }}>First Name</label>
                                    </div>
                                    <div className="col-12 form-floating">
                                        <input
                                            id="lastNameInput"
                                            type="text"
                                            className="form-control form-control-lg register-input"
                                            name="lastName"
                                            placeholder="Last Name"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            autoComplete='off'
                                            style={{ fontSize: '16px' }}
                                        />
                                        <label htmlFor="lastNameInput" className="ms-2 fs-6" style={{ color: 'grey' }}>Last Name</label>
                                    </div>
                                    <div className="col-12">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg w-100 next-btn"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="col-12">
                                        <p className="text-center text-light">
                                            {'Already have an account?' + ' '} 
                                            <span className="login" onClick={() => setAccountStep('login')}>Login</span>
                                        </p>
                                    </div>
                                </>
                            )}

                            {currentStep === 2 && (
                                <>
                                    <div className="col-12 form-floating">
                                        <input
                                            id="usernameInput"
                                            type="text"
                                            className={`form-control form-control-lg ${error && userError ? 'is-invalid register-error' : 'register-input'}`}
                                            name="username"
                                            placeholder="Username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            required
                                            autoComplete='off'
                                            style={{ fontSize: '16px' }}
                                        />
                                        <label htmlFor="usernameInput" className="ms-2 fs-6" style={{ color: 'grey' }}>Username</label>
                                    </div>
                                    <div className="col-12 form-floating">
                                        <input
                                            id="passwordInput"
                                            type="password"
                                            className={`form-control form-control-lg ${error && passError ? 'is-invalid register-error' : 'register-input'}`}
                                            name="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            autoComplete='off'
                                            style={{ fontSize: '16px' }}
                                        />
                                        <label htmlFor="passwordInput" className="ms-2 fs-6" style={{ color: 'grey' }}>Password</label>
                                    </div>
                                    <div className="col-12">
                                        <button
                                            type="button"
                                            className="btn btn-lg w-100 text-light previous-btn"
                                            onClick={handlePrevStep}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-lg w-100 mt-3 text-light sign-up-btn"
                                        >
                                            Sign Up
                                        </button>
                                        {error && <div className="register-error-feedback mt-3">{error.message}</div>}
                                    </div>
                                </>
                            )}
                        </div>

                        <ProgressBar currentStep={currentStep} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;