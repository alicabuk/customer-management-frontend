import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-form-dialog',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class CustomerFormDialogComponent implements OnInit {
  customerForm: FormGroup;
  isLoading = false;
  dialogTitle: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CustomerFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: 'add' | 'edit'; customer?: Customer },
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) {
    this.dialogTitle =
      data.mode === 'add' ? 'Yeni Müşteri Ekle' : 'Müşteri Düzenle';

    this.customerForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.maxLength(50)]],
      national_id: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{11}$')],
      ],
      registration_date: [new Date(), [Validators.required]],
    });

    if (data.mode === 'edit' && data.customer) {
      this.customerForm.patchValue({
        first_name: data.customer.first_name,
        last_name: data.customer.last_name,
        national_id: data.customer.national_id,
        registration_date: new Date(data.customer.registration_date),
      });
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.isLoading = true;

      if (this.data.mode === 'add') {
        this.addCustomer();
      } else {
        this.updateCustomer();
      }
    } else {
      this.customerForm.markAllAsTouched();
    }
  }

  addCustomer(): void {
    const customerData = {
      ...this.customerForm.value,
      registration_date: this.formatDate(
        this.customerForm.value.registration_date
      ),
    } as Customer;

    this.customerService.createCustomer(customerData).subscribe({
      next: (resp) => {
        this.dialogRef.close(resp.data);
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Müşteri eklenirken hata oluştu', 'Kapat', {
          duration: 5000,
        });
        console.error('Müşteri eklenirken hata:', error);
      },
    });
  }

  updateCustomer(): void {
    if (!this.data.customer?.id) {
      this.isLoading = false;
      return;
    }
    const customerData = {
      ...this.customerForm.value,
      registration_date: this.formatDate(
        this.customerForm.value.registration_date
      ),
    } as Customer;

    this.customerService
      .updateCustomer(this.data.customer.id, customerData)
      .subscribe({
        next: (resp) => {
          this.dialogRef.close(resp.data);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Müşteri güncellenirken hata oluştu', 'Kapat', {
            duration: 5000,
          });
          console.error('Müşteri güncellenirken hata:', error);
        },
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
