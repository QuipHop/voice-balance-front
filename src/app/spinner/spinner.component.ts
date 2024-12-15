import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { SpinnerService } from '../spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, FormsModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  public isLoading: Observable<boolean>;

  constructor(private spinnerService: SpinnerService) {
    this.isLoading = this.spinnerService.isLoading; // Subscribe to isLoading from SpinnerService
  }
}
