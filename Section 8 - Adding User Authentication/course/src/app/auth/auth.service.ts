import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private token: string;
    private authStatusListener = new Subject<boolean>();
    private isAuthenticated = false;
    private tokenTimer: any;

    getToken() {
        return this.token;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getIsAuth() {
        return this.isAuthenticated;
    }


    constructor(private http: HttpClient, private router: Router) {
    }

    createUser(email: string, password: string) {
        const authData: AuthData = {
            email,
            password
        };
        this.http.post('http://localhost:3000/api/users/signup', authData).subscribe(response => {
            console.log(response);
        });
    }


    login(email: string, password: string) {
        const authData: AuthData = {
            email,
            password
        };
        this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/users/login', authData)
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                if (token) {
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(token, expirationDate);
                    this.router.navigate(['/']);
                }
            });

    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expierationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.setAuthTimer(expiresIn / 1000);
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
        }
    }

    private setAuthTimer(duration: number) {
        // the below will log the user out once the token expires
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expierationDate = localStorage.getItem('expiration');
        if (!token || !expierationDate) {
            return;
        }
        return {
            token,
            expierationDate: new Date(expierationDate)
        };
    }

}
