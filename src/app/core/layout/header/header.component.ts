import { Component, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../../../features/change-password/change-password-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule],
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  authService = inject(AuthService);

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService
          .changePassword(result.currentPassword, result.newPassword)
          .subscribe({
            next: () => {
              this.snackBar.open('Şifre başarıyla değiştirildi.', 'Kapat', {
                duration: 3000,
              });
              this.authService.logout();
              this.router.navigate(['/login']);
            },
            error: (res) =>
              this.snackBar.open(res.error.error, 'Kapat', {
                duration: 3000,
              }),
          });
      }
    });
  }

  get username(): string {
    return this.authService.currentUserValue?.username || '';
  }
}
