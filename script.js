// // Variables for speech synthesis
// let synth = window.speechSynthesis;
// let voices = [];
// let selectedVoice;
// const textInput = document.getElementById('text');

// // Initialize the list of voices and store previous text
// const populateVoices = () => {
//   voices = synth.getVoices();
//   const voicesDropdown = document.getElementById('voices');
//   voicesDropdown.innerHTML = voices
//     .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
//     .join('');
// };

// const saveToLocalStorage = () => {
//   const text = textInput.value;
//   localStorage.setItem('previousText', text);
// };

// const restorePreviousText = () => {
//   const savedText = localStorage.getItem('previousText');
//   if (savedText) {
//     textInput.value = savedText;
//   } else {
//     alert("No previous text found.");
//   }
// };

// document.getElementById('restore').addEventListener('click', restorePreviousText);

// // Initialize speech synthesis
// synth.onvoiceschanged = populateVoices;

// // Speech synthesis controls
// const speakText = () => {
//   if (synth.speaking) return;
//   const utterThis = new SpeechSynthesisUtterance(textInput.value);
//   utterThis.voice = voices.find(voice => voice.name === selectedVoice);
//   utterThis.volume = document.getElementById('volume').value;
//   utterThis.rate = document.getElementById('rate').value;
//   utterThis.pitch = document.getElementById('pitch').value;
//   synth.speak(utterThis);
//   saveToLocalStorage();
// };

// document.getElementById('start').addEventListener('click', speakText);
// document.getElementById('pause').addEventListener('click', () => synth.pause());
// document.getElementById('resume').addEventListener('click', () => synth.resume());
// document.getElementById('cancel').addEventListener('click', () => synth.cancel());

// document.getElementById('voices').addEventListener('change', (e) => {
//   selectedVoice = e.target.value;
// });

// // Download the text as MP3
// const downloadTextAsMp3 = () => {
//   const utterThis = new SpeechSynthesisUtterance(textInput.value);
//   utterThis.voice = voices.find(voice => voice.name === selectedVoice);
//   utterThis.volume = document.getElementById('volume').value;
//   utterThis.rate = document.getElementById('rate').value;
//   utterThis.pitch = document.getElementById('pitch').value;

//   const blob = new Blob([utterThis.text], { type: 'audio/mpeg' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = 'text.mp3';
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// document.getElementById('download').addEventListener('click', downloadTextAsMp3);

// Variables for speech synthesis
let synth = window.speechSynthesis;
let voices = [];
let selectedVoice;
let utterThis; // SpeechSynthesisUtterance object
const textInput = document.getElementById('text');
const musicSeeker = document.getElementById('music-seeker');
let seekerInterval; // Interval to update the seeker

// Initialize the list of voices and store previous text
const populateVoices = () => {
  voices = synth.getVoices();
  const voicesDropdown = document.getElementById('voices');
  voicesDropdown.innerHTML = voices
    .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
    .join('');
};

const saveToLocalStorage = () => {
  const text = textInput.value;
  localStorage.setItem('previousText', text);
};

const restorePreviousText = () => {
  const savedText = localStorage.getItem('previousText');
  if (savedText) {
    textInput.value = savedText;
  } else {
    alert("No previous text found.");
  }
};

document.getElementById('restore').addEventListener('click', restorePreviousText);

// Initialize speech synthesis
synth.onvoiceschanged = populateVoices;

// Function to speak the text and start seeker functionality
const speakText = () => {
  if (synth.speaking) return; // Prevents overlapping of speeches

  utterThis = new SpeechSynthesisUtterance(textInput.value);
  utterThis.voice = voices.find(voice => voice.name === selectedVoice);
  utterThis.volume = document.getElementById('volume').value;
  utterThis.rate = document.getElementById('rate').value;
  utterThis.pitch = document.getElementById('pitch').value;

  // Start speaking and save the text to local storage
  synth.speak(utterThis);
  saveToLocalStorage();

  // Reset seeker max and value
  musicSeeker.max = utterThis.text.length;
  musicSeeker.value = 0;

  // Start the interval to update the seeker based on speech progress
  seekerInterval = setInterval(updateSeeker, 100); // Update every 100ms

  // Stop the interval when speech is done
  utterThis.onend = () => {
    clearInterval(seekerInterval);
    musicSeeker.value = musicSeeker.max; // Set seeker to max when speech finishes
  };
};

// Function to update seeker as speech progresses
const updateSeeker = () => {
  if (!synth.speaking) {
    clearInterval(seekerInterval);
    return;
  }
  // Update seeker based on the uttered characters so far
  musicSeeker.value += 1; // Simple increment for demonstration (more complex for actual timing)
};

// Pause/Resume/Cancel functions with seeker management
document.getElementById('pause').addEventListener('click', () => {
  synth.pause();
  clearInterval(seekerInterval); // Pause the seeker
});

document.getElementById('resume').addEventListener('click', () => {
  synth.resume();
  seekerInterval = setInterval(updateSeeker, 100); // Resume seeker
});

document.getElementById('cancel').addEventListener('click', () => {
  synth.cancel();
  clearInterval(seekerInterval); // Reset seeker when canceled
  musicSeeker.value = 0;
});

// Update the selected voice
document.getElementById('voices').addEventListener('change', (e) => {
  selectedVoice = e.target.value;
});

// Manually adjusting the seeker will update the speech (optional feature)
musicSeeker.addEventListener('input', () => {
  if (utterThis && !synth.speaking) {
    // Adjust the position of speech (restart with modified text)
    const textToSpeak = textInput.value.slice(musicSeeker.value);
    utterThis = new SpeechSynthesisUtterance(textToSpeak);
    utterThis.voice = voices.find(voice => voice.name === selectedVoice);
    utterThis.volume = document.getElementById('volume').value;
    utterThis.rate = document.getElementById('rate').value;
    utterThis.pitch = document.getElementById('pitch').value;
    synth.speak(utterThis);
  }
});

// Download the text as MP3 (this part is not achievable via client-side JavaScript alone)
const downloadTextAsMp3 = () => {
  const utterThis = new SpeechSynthesisUtterance(textInput.value);
  utterThis.voice = voices.find(voice => voice.name === selectedVoice);
  utterThis.volume = document.getElementById('volume').value;
  utterThis.rate = document.getElementById('rate').value;
  utterThis.pitch = document.getElementById('pitch').value;

  const blob = new Blob([utterThis.text], { type: 'audio/mpeg' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'text.mp3';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

document.getElementById('download').addEventListener('click', downloadTextAsMp3);

// Start speech when the start button is clicked
document.getElementById('start').addEventListener('click', speakText);




