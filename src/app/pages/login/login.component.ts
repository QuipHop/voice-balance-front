import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http'; // Import this

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    // Angular Modules
    FormsModule,
    HttpClientModule, // Add HttpClientModule here

    // Material Modules
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private userService: UserService, private router: Router) {}

  login() {
    this.userService.login(this.email, this.password).subscribe({
      next: (response) => {
        const { access_token, refresh_token } = response;
        this.userService.saveTokens(access_token, refresh_token);
        this.router.navigate(['/main']); // Redirect to main page
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Invalid email or password. Please try again.');
      },
    });
  }
}
