import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgModule, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Product } from '../../model/product.model';
import { ProductService } from '../../services/product.services';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements AfterViewInit, OnInit {
  ofertas: Product[] = [];
  userName: string | null = localStorage.getItem('userName'); 
  isProfileMenuOpen = false;
  index: number = 0;
  slideWidth: number = 200;
  totalSlides: number = 6;


  constructor(private productService: ProductService, private authService : AuthService, private router : Router) {}

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen; 
  }

  editProfile(): void {
    this.router.navigate(['/editar-perfil']); 
    this.isProfileMenuOpen = false; 
  }

  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['/home']); 
    this.isProfileMenuOpen = false; 
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.userName = user ? user.nombres : null;

    this.startAutoSlide();
    this.loadOfertas();
  }

  loadOfertas(): void {
    this.productService.getOfertas().subscribe(
      (data) => {
        this.ofertas = data;
      },
      (error) => {
        console.error('Error al obtener las ofertas', error);
      }
    );
  }

  tips = [
    { titulo: 'Mantenimiento de Ropa', descripcion: 'Lava tu ropa con agua fría para preservar los colores y la calidad de las telas.' },
    { titulo: 'Almacenamiento de Alimentos', descripcion: 'Utiliza recipientes herméticos para mantener la frescura de tus alimentos por más tiempo.' },
    { titulo: 'Cuidados de Mascotas', descripcion: 'Realiza chequeos regulares en la salud de tus mascotas y asegúrate de darles una alimentación balanceada.' },
    { titulo: 'Consejos de Compras', descripcion: 'Siempre compara precios antes de realizar una compra para obtener la mejor oferta.' }
  ];

  slides = [
    { img: 'assets/images/banner1.webp', title: '¿Qué tal?', text: '¡Bienvenido!' },
    { img: 'assets/images/banner2.webp', title: '¡Recuerda!', text: '¡No olvides que contamos con descuentos en frutas!' },
    { img: 'assets/images/banner3.webp', title: '¡Vaya!', text: 'Liquidación en prendas' },
    { img: 'assets/images/banner4.webp', title: '¡Asombroso!', text: '75% Descuento en camisas' },
    { img: 'assets/images/banner5.webp', title: '¡Imperdible!', text: '15% Rebajas en frutas' },
    { img: 'assets/images/banner6.webp', title: '¡Aprovecha!', text: '90% Descuento en collares' }
  ];

  hoverEffect(tip: any) {
    tip.hover = true;
}

resetEffect(tip: any) {
    tip.hover = false;
}

  currentSlide = 0;
  slideInterval: any;

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000); 
  }

  ngAfterViewInit() {
    this.showMenu('nav-toggle', 'nav-menu');
    const sliderTrack = document.querySelector('.logo-slider-track') as HTMLElement;


    setInterval(() => {
      this.index++;
      if (this.index >= this.totalSlides) {
        this.index = 0; 
      }
      sliderTrack.style.transition = 'transform 0.5s ease-in-out';
      sliderTrack.style.transform = `translateX(-${this.index * this.slideWidth}px)`;
    }, 4000); 

    this.cloneSlides();
  }

  cloneSlides() {
    const sliderTrack = document.querySelector('.logo-slider-track') as HTMLElement;
    const slides = document.querySelectorAll('.logo-slide');

    slides.forEach(slide => {
      const clone = slide.cloneNode(true) as HTMLElement;
      sliderTrack.appendChild(clone);
    });

    sliderTrack.style.width = `${(this.totalSlides * 2) * this.slideWidth}px`;
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
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
}
