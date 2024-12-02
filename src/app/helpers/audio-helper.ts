export function bufferToWave(abuffer: AudioBuffer, len: number): Blob {
  const numOfChan = abuffer.numberOfChannels;
  const sampleRate = abuffer.sampleRate;

  // Calculate required buffer length
  const dataLength = len * numOfChan * 2; // 2 bytes per sample (16-bit PCM)
  const bufferLength = 44 + dataLength; // WAV header (44 bytes) + PCM data
  const buffer = new ArrayBuffer(bufferLength);
  const view = new DataView(buffer);

  // Helper functions to write data
  let pos = 0;
  const writeString = (str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(pos++, str.charCodeAt(i));
    }
  };
  const writeUint32 = (data: number) => {
    view.setUint32(pos, data, true);
    pos += 4;
  };
  const writeUint16 = (data: number) => {
    view.setUint16(pos, data, true);
    pos += 2;
  };

  // Write RIFF header
  writeString('RIFF'); // ChunkID
  writeUint32(bufferLength - 8); // ChunkSize
  writeString('WAVE'); // Format

  // Write 'fmt ' sub-chunk
  writeString('fmt '); // Subchunk1ID
  writeUint32(16); // Subchunk1Size (PCM header size)
  writeUint16(1); // AudioFormat (1 = PCM)
  writeUint16(numOfChan); // NumChannels
  writeUint32(sampleRate); // SampleRate
  writeUint32(sampleRate * numOfChan * 2); // ByteRate
  writeUint16(numOfChan * 2); // BlockAlign
  writeUint16(16); // BitsPerSample

  // Write 'data' sub-chunk
  writeString('data'); // Subchunk2ID
  writeUint32(dataLength); // Subchunk2Size

  // Interleave PCM data
  const channels: Float32Array[] = [];
  for (let i = 0; i < numOfChan; i++) {
    channels.push(abuffer.getChannelData(i));
  }

  let offset = 0;
  while (offset < len) {
    for (let i = 0; i < numOfChan; i++) {
      const sample = Math.max(-1, Math.min(1, channels[i][offset])); // Clamp sample
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff; // Scale to 16-bit PCM
      view.setInt16(pos, intSample, true); // Write 16-bit sample
      pos += 2;
    }
    offset++;
  }

  // Create and return WAV Blob
  return new Blob([buffer], { type: 'audio/wav' });
}
