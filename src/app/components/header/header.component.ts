import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // proprieté pour gérer l'état du menu
  isMenuOpen = false;

  // méthode pour basculer l'état du menu pour l'afficher ou le masquer
  // sur les ecrans de petite taille
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // méthode pour fermer le menu lorsqu'un lien est cliqué
  closeMenu() {
   this.isMenuOpen = false;
  }
}
