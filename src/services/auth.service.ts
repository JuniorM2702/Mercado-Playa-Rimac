import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    register(newUser: { nomusuario: string; nombres: string; apellidos: string; email: string; password: string; }) {
      throw new Error('Method not implemented.');
    }
    private currentUser: User | null = null;
    private baseUrl = 'http://localhost:8080/api/v1/auth';
    private apiUrl = 'http://localhost:8080/api/v1/user/save-user'; 


    constructor(private http: HttpClient) {}

    generarSesionAnonima(): Observable<any> {
    return this.http.get(`${this.baseUrl}/session`, {});
    
    }

    login(nomusuario: string, password: string): Observable<User> {
    return this.http.get<User>(`http://localhost:8080/api/v1/auth/login?usuario=${nomusuario}&password=${password}`);
    }

    setCurrentUser(user: User): void {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    getCurrentUser(): User | null {
        if (!this.currentUser) {
          const userData = localStorage.getItem('currentUser');
          this.currentUser = userData ? JSON.parse(userData) : null;
        }
        return this.currentUser;
    }

    registerUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
      }

    obtenerToken(): string | null {
    return localStorage.getItem('token') && localStorage.getItem('usuario');
    }

    logout(): void {
        this.currentUser = null;
        localStorage.removeItem('currentUser'); 
    }
}