import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  isAssembler: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phone: [''],
      address: [''],
      role: ['customer', Validators.required],
      // Assembler specific fields
      specialization: [''],
      description: [''],
      location: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password?.value !== confirmPassword?.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onRoleChange(): void {
    this.isAssembler = this.registerForm.value.role === 'assembler';
    
    if (this.isAssembler) {
      this.registerForm.get('specialization')?.setValidators(Validators.required);
      this.registerForm.get('description')?.setValidators(Validators.required);
      this.registerForm.get('location')?.setValidators(Validators.required);
    } else {
      this.registerForm.get('specialization')?.clearValidators();
      this.registerForm.get('description')?.clearValidators();
      this.registerForm.get('location')?.clearValidators();
    }
    
    this.registerForm.get('specialization')?.updateValueAndValidity();
    this.registerForm.get('description')?.updateValueAndValidity();
    this.registerForm.get('location')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const formData = { ...this.registerForm.value };
    
    // Remove confirmPassword and assembler fields if not needed
    delete formData.confirmPassword;
    
    if (!this.isAssembler) {
      delete formData.specialization;
      delete formData.description;
      delete formData.location;
    }

    this.authService.register(formData).subscribe({
      next: () => {
        // Redirect based on user role
        const user = this.authService.currentUser;
        if (user?.role === 'customer') {
          this.router.navigate(['/dashboard-customer']);
        } else if (user?.role === 'assembler') {
          this.router.navigate(['/dashboard-assembler']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.errorMessage = err.message || 'Registration failed. Please try again.';
      }
    });
  }
}