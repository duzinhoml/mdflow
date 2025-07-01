import { jwtDecode } from 'jwt-decode';

class AuthService {
    getProfile() {
        return jwtDecode(this.getToken());
    };

    loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    };

    isTokenExpired(token) {
        try {
            const decoded = jwtDecode(token);

            if (decoded?.exp && decoded?.exp < Date.now() / 1000) return true;
        } 
        catch (err) {
            return false;
        }
    };

    getToken() {
        const loggedUser = localStorage.getItem('id_token') || '';
        return loggedUser;
    };

    login(idToken) {
        localStorage.setItem('id_token', idToken);
        window.location.assign('/');
    };

    logout() {
        localStorage.removeItem('id_token');
        window.location.assign('/');
    };
};

export default new AuthService();