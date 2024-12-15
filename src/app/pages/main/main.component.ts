import { Component, inject, NgZone } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { AudioRecordingService } from '../../services/audio-recording-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from '../../components/categories/categories.component';
import { MatList, MatListItem } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmTransactionDialogComponent } from '../../components/confirm-transaction-dialog/confirm-transaction-dialog.component';
import { SpinnerService } from '../../spinner.service';
import { StatisticsComponent } from '../statistics/statistics.component';

@Component({
  standalone: true,
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIcon,
    MatList,
    MatListItem,
    CategoriesComponent,
    StatisticsComponent
  ],
})
export class MainComponent {

  transactions: any[] = [];
  isRecording = false;
  wavFile: File | null = null;
  categories: any[] = [];
  newCategoryName = '';
  newCategoryType = '';
  dialog = inject(MatDialog);

  constructor(
    private audioRecordingService: AudioRecordingService,
    private userService: UserService,
    private spinner: SpinnerService,
    private zone: NgZone
  ) {
    // Subscribe to audioBlob$ to automatically handle WAV generation
    this.audioRecordingService.audioBlob$.subscribe((wavBlob) => {
      this.spinner.show();
      const wavFile = new File([wavBlob], `${new Date().toUTCString()}.wav`, { type: 'audio/wav' });
      console.log('Generated WAV File:', wavFile);
      // Optionally play the audio for verification
      // const audioUrl = URL.createObjectURL(wavFile);
      // const audio = new Audio(audioUrl);
      // this.downloadFile(wavFile);
      // audio.play();
      // Automatically upload the WAV file after recording
      this.uploadFile(wavFile);
    });
    this.fetchTransactions();
  }

  fetchTransactions() {
    this.userService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data
          .flat()
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      },
      error: (err) => {
        console.error('Error fetching transactions:', err);
      },
    });
  }
  

  async startRecording() {
    try {
      this.isRecording = true;
      console.log('Starting recording...');
      await this.audioRecordingService.startRecording();
      console.log('Recording started successfully.');
    } catch (err) {
      this.isRecording = false;
      console.error('Error starting recording:', err);
    }
  }

  async stopRecording() {
    try {
      if (!this.isRecording) {
        console.warn('Recording was not started!');
        return;
      }

      this.isRecording = false;
      console.log('Stopping recording...');
      await this.audioRecordingService.stopRecording();
    } catch (err) {
      console.error('Error stopping recording:', err);
    }
  }

  uploadFile(file: File) {
    this.userService.sendVoice(file).subscribe({
      next: (response) => {
        console.log('Voice uploaded successfully:', response);
      
        if (response?.action) {
          this.showConfirmationPopup(response.action);
        } else {
          console.error('Unexpected response format:', response);
        }
        this.fetchTransactions();
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error uploading voice:', err);
        this.spinner.hide();
      },
    });
  }

  showConfirmationPopup(action: any) {
    this.zone.run(() => {
      const dialogRef = this.dialog.open(ConfirmTransactionDialogComponent, {
        width: '400px',
        data: {
          amount: action.amount,
          category: action.category,
          description: action.description,
          type: action.type,
        },
      });
    
      dialogRef.afterClosed().subscribe((confirmed: any) => {
        if (!!confirmed) {
          console.log(this.userService.categories, action);
          const cat = this.userService.categories.find(cat => cat.Type == action.type && cat.Name == action.category);
          console.log("cat", cat);
          const trans = {
            "amount": parseFloat(action.amount),
            "categoryID": cat.ID,
            "description": cat.Type + " " + cat.Name + " " + action.amount,
            "userID": cat.UserID
          };
          if (cat.ID) this.userService.createTransaction(trans).subscribe(() => this.fetchTransactions());
        }
      });
    });
  }

  downloadFile(file: File) {
    const url = URL.createObjectURL(file); // Create a URL for the file
    const a = document.createElement('a'); // Create a temporary link
    a.href = url;
    a.download = file.name; // Set the download filename
    document.body.appendChild(a); // Append the link to the DOM
    a.click(); // Trigger the download
    document.body.removeChild(a); // Clean up the DOM
    console.log(`WAV file saved locally: ${file.name}`);
  }

}
