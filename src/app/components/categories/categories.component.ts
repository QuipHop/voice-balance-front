import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatLabel, MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatListModule,
    MatOptionModule,
    MatButtonModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  categories: any[] = [];
  newCategoryName = '';
  newCategoryType = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories() {
    this.userService.getCategories().subscribe({
      next: (response) => {
        if (response.status !== 'error') {
          this.categories = response.data;
          this.userService.categories = this.categories;
          console.log(this.categories);
        } else {
          console.log(response.message);
          this.categories = [];
        }
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });
  }

  addCategory() {
    if (!this.newCategoryName || !this.newCategoryType) {
      console.error('Both name and type are required.');
      return;
    }

    this.userService.addCategory(this.newCategoryName || '', this.newCategoryType || '').subscribe({
      next: () => {
        console.log('Category added successfully');
        this.newCategoryName = '';
        this.newCategoryType = '';
        this.fetchCategories(); // Refresh the category list
      },
      error: (err) => {
        console.error('Error adding category:', err);
      },
    });
  }
}
