import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { CustomerFormDialogComponent } from '../customer-form/customer-form.components';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class CustomerListComponent implements OnInit {
  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'national_id',
    'registration_date',
    'actions',
  ];
  dataSource = new MatTableDataSource<Customer>([]);
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.listCustomers().subscribe({
      next: (customers) => {
        this.dataSource.data = customers;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Müşteri listesi yüklenirken hata oluştu', 'Kapat', {
          duration: 5000,
        });
        console.error('Müşteri listesi yüklenirken hata:', error);
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(CustomerFormDialogComponent, {
      width: '600px',
      data: { mode: 'add' },
    });

    dialogRef
      .afterClosed()
      .subscribe((createdCustomer: Customer | undefined) => {
        if (createdCustomer) {
          this.dataSource.data = [...this.dataSource.data, createdCustomer];
          this.snackBar.open('Müşteri eklendi', 'Kapat', { duration: 3000 });
        }
      });
  }

  openEditDialog(customer: Customer): void {
    const dialogRef = this.dialog.open(CustomerFormDialogComponent, {
      width: '600px',
      data: { mode: 'edit', customer },
    });

    dialogRef
      .afterClosed()
      .subscribe((updatedCustomer: Customer | undefined) => {
        if (updatedCustomer) {
          this.dataSource.data = this.dataSource.data.map((c) =>
            c.id === updatedCustomer.id ? updatedCustomer : c
          );
          this.snackBar.open('Müşteri güncellendi', 'Kapat', {
            duration: 3000,
          });
        }
      });
  }

  openDeleteDialog(customer: Customer): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Müşteri Silme',
        message: `${customer.first_name} ${customer.last_name} isimli müşteriyi silmek istediğinize emin misiniz?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && customer.id) {
        this.deleteCustomer(customer.id);
      }
    });
  }

  deleteCustomer(id: number): void {
    this.customerService.deleteCustomer(id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter((c) => c.id !== id);
        this.snackBar.open('Müşteri silindi', 'Kapat', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Müşteri silinirken hata oluştu', 'Kapat', {
          duration: 5000,
        });
        console.error('Müşteri silinirken hata:', error);
      },
    });
  }
}
