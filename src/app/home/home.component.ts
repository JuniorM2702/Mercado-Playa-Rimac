import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements AfterViewInit {

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
}