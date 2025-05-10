import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterOutlet, CommonModule, RouterLink],
})
export class SidebarComponent {
  menuItems = [
    {
      title: 'Müşteriler',
      icon: 'people',
      link: '/customer',
    },
  ];
}
