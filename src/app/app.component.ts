import { Component, inject, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/auth/services/auth.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { HeaderComponent } from './core/layout/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet,
    MatSidenavModule,
    CommonModule,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
  ],
  standalone: true,
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isLoggedIn = false;

  authService = inject(AuthService);
  constructor(private router: Router) {
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.sidenav && this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }

  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }
}
