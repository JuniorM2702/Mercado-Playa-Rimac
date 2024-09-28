import { AfterViewInit, Component, ElementRef, NgModule, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule, NgFor, NgForOf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgForm, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements AfterViewInit, OnInit {
  registerForm: FormGroup;
  nomusuario: string = '';
  password: string = '';
  error: string = '';
  nombres: string = '';
  apellidos: string = '';
  email: string = '';
  
  constructor(private el: ElementRef, private authservice: AuthService, private router: Router, private fb: FormBuilder,) {
    this.registerForm = this.fb.group({
      nomusuario: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.authservice.generarSesionAnonima().subscribe(response => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', response.usuario);

    });
  }

  onRegister(): void {
  
    // Crear el objeto User para enviar al backend
    const newUser: User = {
      idusuario: 0, // O cualquier valor predeterminado si se requiere
      nomusuario: this.registerForm.value.nomusuario,
      nombres: this.registerForm.value.nombres,
      apellidos: this.registerForm.value.apellidos,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };
  
    // Llamar al servicio para registrar el usuario
    this.authservice.registerUser(newUser).subscribe({
      next: response => {
        console.log('Usuario registrado con éxito:', response);
        // Redirigir al login tras el registro exitoso
        this.router.navigate(['/home']);
      },
      error: error => {
        console.error('Error al registrar el usuario:', error);
        alert('Hubo un error al intentar registrar el usuario.');
      }
    });
  }

  onLogin(): void {
    this.authservice.login(this.nomusuario, this.password).subscribe({
      next: (response: User) => {
        console.log('Inicio de sesión exitoso', response);
        this.authservice.setCurrentUser(response); // Guarda el usuario actual
        this.router.navigate(['/home']); // Redirigir al home
      },
      error: (err) => {
        console.error('Error de inicio de sesión', err);
        this.error = 'Credenciales incorrectas, inténtalo de nuevo.';
      }
    });
  }
  ngAfterViewInit() {
    this.setupPasswordVisibilityToggle();
    this.setupAuthFormToggle();
    
  }
  private setupPasswordVisibilityToggle(): void {
    const pwShowHide = this.el.nativeElement.querySelectorAll('.showHidePw') as NodeListOf<HTMLElement>;
    const pwFields = this.el.nativeElement.querySelectorAll('.password') as NodeListOf<HTMLInputElement>;

    pwShowHide.forEach((eyeIcon) => {
      eyeIcon.addEventListener('click', () => {
        pwFields.forEach((pwField) => {
          if (pwField.type === 'password') {
            pwField.type = 'text';
            pwShowHide.forEach((icon) => {
              icon.classList.replace('uil-eye-slash', 'uil-eye');
            });
          } else {
            pwField.type = 'password';
            pwShowHide.forEach((icon) => {
              icon.classList.replace('uil-eye', 'uil-eye-slash');
            });
          }
        });
      });
    });
  }

  private setupAuthFormToggle(): void {
    const container = document.querySelector('.container') as HTMLElement;
    const signUp = document.querySelector('.signup-link') as HTMLElement;
    const login = document.querySelector('.login-link') as HTMLElement;

    signUp.addEventListener('click', (e: Event) => {
      e.preventDefault();
      container.classList.add('active');
    });

    login.addEventListener('click', (e: Event) => {
      e.preventDefault();
      container.classList.remove('active');
    });
  }
}