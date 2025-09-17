import { useUpdatePassword } from "../../../lib/constants";

import '../../../settingsComponents/Selection/index.css';
import './index.css';

function UpdatePassword({ setOption, setActivePage }) {
    const { 
        formData, error, 
        currentPWError, newPWError, confirmPWError,
        incorrectPassword, minChar, maxChar, specialChar, noMatch,
        handleInputChange, handleFormSubmit, cancelForm 
    } = useUpdatePassword();

    return (
        <div className="d-flex flex-column flex-grow-1 m-3 mt-2">
            <button className="btn btn-sm exit align-self-start mb-3" onClick={() => setOption("")}>
                <i className="fa-solid fa-angle-left me-2"></i>
                Go Back
            </button>
            <h4 className='mb-3 text-light'>Change Password</h4>
            <form 
                id="updatePasswordForm" 
                className="text-light p-0 pt-4 needs-validation"
                onSubmit={() => {
                    handleFormSubmit()
                    setActivePage("Home")
                }}
                style={{ 
                    borderTop: '1px solid hsl(0, 0.00%, 36%)',
                }}
            >
                <div className='mb-3 form-floating'>
                    <input 
                        id="currentPWInput"
                        className={`form-control ${error && currentPWError ? 'is-invalid error' : 'decision-input'}`}
                        type="password" 
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder='Enter old password'
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="currentPWInput" className="fs-6" style={{ color: 'grey' }}>Enter old password</label>
                    {error && incorrectPassword ? <div className="invalid-feedback error-feedback fs-6">Incorrect Password</div> : ''}
                </div>
                <div className='mb-3 form-floating'>
                    <input 
                        id="newPWInput"
                        className={`form-control ${error && newPWError ? 'is-invalid error' : 'decision-input'}`}
                        type="password" 
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder='Enter new password'
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="newPWInput" className="fs-6" style={{ color: 'grey' }}>Enter new password</label>
                    {error && minChar ? <div className="invalid-feedback error-feedback fs-6">Password must be at least 8 characters long.</div> : ''}
                    {error && maxChar ? <div className="invalid-feedback error-feedback fs-6">Password cannot exceed 50 characters.</div> : ''}
                    {error && specialChar ? <div className="invalid-feedback error-feedback fs-6">Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.</div> : ''}
                </div>
                <div className='form-floating'>
                    <input 
                        id="confirmPWInput"
                        className={`form-control ${error && confirmPWError ? 'is-invalid error' : 'decision-input'}`}
                        type="password" 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder='Confirm new password'
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="confirmPWInput" className="fs-6" style={{ color: 'grey' }}>Confirm new password</label>
                    {error && noMatch ? <div className="invalid-feedback error-feedback fs-6">Passwords do not match</div> : ''}
                </div>
                <div className="mt-3">
                    <button 
                        form="updatePasswordForm"
                        className="btn me-3 settings-save-btn"
                        type="submit"
                    >
                        Save Changes
                    </button>
                    <button 
                        type="button" 
                        className="btn settings-discard-btn" 
                        onClick={() => cancelForm()}
                    >
                        Discard Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UpdatePassword;