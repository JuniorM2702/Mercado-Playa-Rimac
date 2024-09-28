import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-contactanos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contactanos.component.html',
  styleUrl: './contactanos.component.css',
  encapsulation: ViewEncapsulation.None
})


export class ContactanosComponent implements AfterViewInit, OnInit {

  contactForm: FormGroup;
  userName: string | null = localStorage.getItem('userName'); 
  isProfileMenuOpen = false;


  constructor(private authService : AuthService, private router : Router, private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', Validators.required],
    });
  }


  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Formulario enviado', this.contactForm.value);
      this.contactForm.reset();
    }
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen; 
  }

  editProfile(): void {
    this.router.navigate(['/editar-perfil']); 
    this.isProfileMenuOpen = false; 
  }

  logout(): void {
    localStorage.removeItem('userName'); 
    localStorage.clear(); 
    this.authService.logout(); 

    this.router.navigate(['/contactanos']); 
    this.isProfileMenuOpen = false; 
}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.userName = user ? user.nombres : null;

  }

  ngAfterViewInit() {
    this.showMenu('nav-toggle', 'nav-menu');
  }

  showMenu(toggleId: string, navId: string) {
    const toggle = document.getElementById(toggleId);
    const nav = document.getElementById(navId);

    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('show-menu');
        toggle.classList.toggle('show-icon');
      });
    } else {
      console.error('Element not found');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/contactanos']);
  }
}
