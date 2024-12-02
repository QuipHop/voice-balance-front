import { TestBed } from '@angular/core/testing';

import { AudioRecordingServiceService } from './audio-recording-service.service';

describe('AudioRecordingServiceService', () => {
  let service: AudioRecordingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioRecordingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
