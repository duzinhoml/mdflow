import { useDeleteUser } from '../../lib/constants';
import { useUser } from '../../contexts/UserContext';

import './index.css';

function DeleteUser() {
    const { error, confirmDeleteError, confirmDelete, handleInputChange, handleDeleteUser, cancelForm } = useDeleteUser();
    const { userData } = useUser();

    return (
        <div className="d-flex flex-column flex-grow-1 m-3">
            <h4 className='mb-3 text-light'>Delete Account</h4>
            <form 
                id="deleteUserForm" 
                className="text-light p-0 pt-4 needs-validation"
                onSubmit={(e) => handleDeleteUser(e, confirmDelete)}
                style={{ borderTop: '1px solid hsl(0, 0.00%, 36%)' }}
            >
                <div>
                    <p>
                        Are you sure you want to delete your account? <br />
                        This action is irreversible, and all your content will be <span className="delete-message">permanently</span> deleted.
                    </p>
                </div>
                <div className='mb-3 form-floating'>
                    <input 
                        id="confirmDeleteInput"
                        className={`form-control ${error && confirmDeleteError ? 'is-invalid error' : 'decision-input'}`}
                        type="text" 
                        name="confirmDelete"
                        value={confirmDelete}
                        onChange={handleInputChange}
                        placeholder={`To confirm, type "${userData?.username}"`}
                        autoComplete="off"
                        style={{ width: '60%' }}
                        required
                    />
                    <label htmlFor="confirmDeleteInput" className="fs-6" style={{ color: 'grey' }}>{`To confirm, type "${userData?.username}"`}</label>
                    {error && <div className="invalid-feedback error-feedback">{error.message}</div>}
                </div>
                <div className="mt-3">
                    <button 
                        form="deleteUserForm"
                        className="btn text-light me-3 settings-save-btn"
                        type="submit"
                    >
                        Delete Account
                    </button>
                    <button 
                        type="button" 
                        className="btn text-light settings-discard-btn" 
                        onClick={() => cancelForm()}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DeleteUser;