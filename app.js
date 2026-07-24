// ==========================================
// ESTADO DE LA APLICACIÓN Y MOTOR DE AUDIO
// ==========================================
let masterVolume = 1.0; 
let isDuck = false; 
let currentAudioPlayer = 0; 

const playerA = new Audio();
const playerB = new Audio();
const players = [playerA, playerB];

// CONTEXTO DE AUDIO PARA VOLUMEN HASTA 200%
let audioCtx = null;
let gainNodeA = null;
let gainNodeB = null;
let gainNodes = [];

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNodeA = audioCtx.createGain();
    gainNodeB = audioCtx.createGain();

    const sourceA = audioCtx.createMediaElementSource(playerA);
    const sourceB = audioCtx.createMediaElementSource(playerB);

    sourceA.connect(gainNodeA);
    gainNodeA.connect(audioCtx.destination);

    sourceB.connect(gainNodeB);
    gainNodeB.connect(audioCtx.destination);

    gainNodes = [gainNodeA, gainNodeB];
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Activar el AudioContext al interactuar por primera vez con la pantalla
document.addEventListener('click', initAudioContext, { once: true });
document.addEventListener('touchstart', initAudioContext, { once: true });

// ==========================================
// LISTA DE MÚSICA PRE-CARGADA (35 CANCIONES)
// ==========================================
let playlist = JSON.parse(localStorage.getItem('radio_playlist')) || [
  { name: 'Amor De Adolescentes', src: 'musica/Amor_De_Adolescentes.mp3' },
  { name: 'Cinco Días', src: 'musica/Cinco_Días.mp3' },
  { name: 'Cómo Dejar de Amarte', src: 'musica/Cómo_Dejar_de_Amarte.mp3' },
  { name: 'Daniela', src: 'musica/Daniela.mp3' },
  { name: 'Desnudos', src: 'musica/Desnudos.mp3' },
  { name: 'El Galeón Español', src: 'musica/El_Galeón_Español.mp3' },
  { name: 'El Polvito del Amor', src: 'musica/El_Polvito_del_Amor.mp3' },
  { name: 'Esta Pegao', src: 'musica/Esta_Pegao.mp3' },
  { name: 'Ha Salido la Luna', src: 'musica/Ha_Salido_la_Luna.mp3' },
  { name: 'La Cumbia De Los Trapos', src: 'musica/La_Cumbia_De_Los_Trapos.mp3' },
  { name: 'La Hora De Bailar', src: 'musica/La_Hora_De_Bailar.mp3' },
  { name: 'La Peineta / Todos los Domingos...', src: 'musica/La_Peineta_Todos_los_Domingos_Pobre_Caminante_Cumbia_para_Adormecerte_La_Mafafa.mp3' },
  { name: 'La Temporera', src: 'musica/La_Temporera.mp3' },
  { name: 'La Vecina', src: 'musica/La_Vecina.mp3' },
  { name: 'Latinos', src: 'musica/Latinos.mp3' },
  { name: 'Loca', src: 'musica/Loca.mp3' },
  { name: 'Mama Soltera', src: 'musica/Mama_Soltera.mp3' },
  { name: 'Me Enamore', src: 'musica/Me_Enamore.mp3' },
  { name: 'Me Gusta Todo De Ti', src: 'musica/Me_Gusta_Todo_De_Ti.mp3' },
  { name: 'Me Vas a Extrañar (En Vivo)', src: 'musica/Me_Vas_a_Extrañar_(En_Vivo).mp3' },
  { name: 'Mentirosa', src: 'musica/Mentirosa.mp3' },
  { name: 'Mujeres y Cerveza', src: 'musica/Mujeres_y_Cerveza.mp3' },
  { name: 'No Podré Olvidarme De Ti', src: 'musica/No_Podré_Olvidarme_De_Ti.mp3' },
  { name: 'No Quiero Dormir', src: 'musica/No_Quiero_Dormir.mp3' },
  { name: 'No Te Lo Puedo Creer', src: 'musica/No_Te_Lo_Puedo_Creer.mp3' },
  { name: 'Nunca Me Faltes', src: 'musica/Nunca_Me_Faltes.mp3' },
  { name: 'Que Levante la Mano', src: 'musica/Que_Levante_la_Mano.mp3' },
  { name: 'Que Nadie Se Entere', src: 'musica/Que_Nadie_Se_Entere.mp3' },
  { name: 'Quiero Ser Libre', src: 'musica/Quiero_Ser_Libre.mp3' },
  { name: 'Simpática y Muy Bonita', src: 'musica/Simpática_y_Muy_Bonita.mp3' },
  { name: 'Tiburon', src: 'musica/Tiburon.mp3' },
  { name: 'Traicionera', src: 'musica/Traicionera.mp3' },
  { name: 'Una Cerveza', src: 'musica/Una_Cerveza.mp3' },
  { name: 'Yo Me Enamore', src: 'musica/Yo_Me_Enamore.mp3' },
  { name: 'Yo Tomo', src: 'musica/Yo_Tomo.mp3' }
];

// ==========================================
// LISTA DE SONIDOS PRE-CARGADA (14 EFECTOS)
// ==========================================
let soundsList = JSON.parse(localStorage.getItem('radio_sounds')) || [
  { id: '1',  name: 'Abucheo',      src: 'sonidos/abucheo.mp3' },
  { id: '2',  name: 'Airhorn',      src: 'sonidos/airhorn.mp3' },
  { id: '3',  name: 'Avello 1',     src: 'sonidos/avello1.mp3' },
  { id: '4',  name: 'Avello 2',     src: 'sonidos/avello2.mp3' },
  { id: '5',  name: 'Campana',      src: 'sonidos/campana.mp3' },
  { id: '6',  name: 'Censorship',   src: 'sonidos/censorship.mp3' },
  { id: '7',  name: 'Dramatic',     src: 'sonidos/dramatic.mp3' },
  { id: '8',  name: 'Grillo',       src: 'sonidos/grillo.mp3' },
  { id: '9',  name: 'Platillos',    src: 'sonidos/platillos.mp3' },
  { id: '10', name: 'Risas',        src: 'sonidos/risas.mp3' },
  { id: '11', name: 'Sad Trombone', src: 'sonidos/sad-trombone.mp3' },
  { id: '12', name: 'Scratch',      src: 'sonidos/scratch.mp3' },
  { id: '13', name: 'Vine Boom',    src: 'sonidos/vine-boom.mp3' },
  { id: '14', name: 'Wilhelm',      src: 'sonidos/wilhelm.mp3' }
];

let playedIndices = [];
let activeSoundAudios = [];
let selectedSoundId = null;
let longPressTimer = null;

// ==========================================
// ELEMENTOS DEL DOM
// ==========================================
const volumeSlider = document.getElementById('volume-slider');
const volumeDisplay = document.getElementById('volume-display');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnNext = document.getElementById('btn-next');
const btnStopSounds = document.getElementById('btn-stop-sounds');
const btnAddSound = document.getElementById('btn-add-sound');
const soundGrid = document.getElementById('sound-grid');
const trackTitle = document.getElementById('current-track-title');

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  renderSounds();
  setupEventListeners();
  updateVolume();
});

// ==========================================
// CONTROL DE VOLUMEN Y ATENUACIÓN (DUCKING)
// ==========================================
function updateVolume() {
  masterVolume = parseFloat(volumeSlider.value) / 100;
  volumeDisplay.textContent = `${volumeSlider.value}%`;
  
  const effectiveVolume = isDuck ? (masterVolume * 0.5) : masterVolume;
  
  if (gainNodes.length > 0) {
    gainNodes.forEach(gain => {
      gain.gain.value = effectiveVolume;
    });
  } else {
    players.forEach(p => {
      p.volume = Math.min(Math.max(effectiveVolume, 0), 1);
    });
  }
}

function setDucking(active) {
  isDuck = active;
  updateVolume();
}

// ==========================================
// REPRODUCCIÓN Y CROSSFADE ENTRE TEMAS
// ==========================================
function playNextTrack(forcedSrc = null) {
  initAudioContext();

  let nextTrackSrc = forcedSrc;

  if (!nextTrackSrc) {
    if (playlist.length === 0) {
      alert("No hay canciones en la lista.");
      return;
    }
    if (playedIndices.length >= playlist.length) playedIndices = [];
    let available = playlist.map((_, i) => i).filter(i => !playedIndices.includes(i));
    let randomIndex = available[Math.floor(Math.random() * available.length)];
    playedIndices.push(randomIndex);
    
    nextTrackSrc = playlist[randomIndex].src;
    trackTitle.textContent = playlist[randomIndex].name;
  }

  const currentPlayer = players[currentAudioPlayer];
  currentAudioPlayer = (currentAudioPlayer + 1) % 2;
  const nextPlayer = players[currentAudioPlayer];

  nextPlayer.src = nextTrackSrc;
  const targetVol = isDuck ? (masterVolume * 0.5) : masterVolume;
  
  if (gainNodes.length > 0) {
    gainNodes[currentAudioPlayer].gain.value = 0;
  } else {
    nextPlayer.volume = 0;
  }

  nextPlayer.play().then(() => {
    btnPlayPause.textContent = "⏸ Pausa";
  }).catch(e => {
    console.log("Error de reproducción:", e);
  });

  // Crossfade progresivo de 6 segundos
  let step = 0;
  const fadeInterval = setInterval(() => {
    step++;
    const factor = step / 60;
    const prevIndex = (currentAudioPlayer + 1) % 2;
    
    if (gainNodes.length > 0) {
      if (currentPlayer && !currentPlayer.paused) {
        gainNodes[prevIndex].gain.value = Math.max(0, targetVol * (1 - factor));
      }
      gainNodes[currentAudioPlayer].gain.value = Math.max(0, targetVol * factor);
    } else {
      if (currentPlayer && !currentPlayer.paused) {
        currentPlayer.volume = Math.min(1, Math.max(0, targetVol * (1 - factor)));
      }
      nextPlayer.volume = Math.min(1, Math.max(0, targetVol * factor));
    }

    if (step >= 60) {
      clearInterval(fadeInterval);
      if (currentPlayer) currentPlayer.pause();
    }
  }, 100);
}

// ==========================================
// BOTONERA DE EFECTOS
// ==========================================
function playSound(src) {
  initAudioContext();

  const sound = new Audio(src);
  activeSoundAudios.push(sound);
  
  setDucking(true);

  sound.play().catch(e => console.log("Error al reproducir sonido:", e));

  sound.onended = () => {
    activeSoundAudios = activeSoundAudios.filter(s => s !== sound);
    if (activeSoundAudios.length === 0) {
      setDucking(false);
    }
  };
}

btnStopSounds.addEventListener('click', () => {
  activeSoundAudios.forEach(s => {
    s.pause();
    s.currentTime = 0;
  });
  activeSoundAudios = [];
  setDucking(false);
});

function renderSounds() {
  soundGrid.innerHTML = '';
  soundsList.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-sound';
    btn.textContent = s.name;

    btn.addEventListener('click', () => playSound(s.src));

    const startPress = () => {
      longPressTimer = setTimeout(() => openEditSoundModal(s.id), 800);
    };
    const cancelPress = () => clearTimeout(longPressTimer);

    btn.addEventListener('touchstart', startPress);
    btn.addEventListener('touchend', cancelPress);
    btn.addEventListener('mousedown', startPress);
    btn.addEventListener('mouseup', cancelPress);
    btn.addEventListener('mouseleave', cancelPress);

    soundGrid.appendChild(btn);
  });
  
  localStorage.setItem('radio_sounds', JSON.stringify(soundsList));
}

// ==========================================
// EVENTOS Y MODALES
// ==========================================
function setupEventListeners() {
  volumeSlider.addEventListener('input', updateVolume);

  btnPlayPause.addEventListener('click', () => {
    initAudioContext();
    const activeP = players[currentAudioPlayer];
    if (activeP.paused) {
      if (!activeP.src) playNextTrack();
      else activeP.play();
      btnPlayPause.textContent = "⏸ Pausa";
    } else {
      activeP.pause();
      btnPlayPause.textContent = "▶ Play";
    }
  });

  btnNext.addEventListener('click', () => playNextTrack());

  // Cargar MP3 desde almacenamiento local
  document.getElementById('input-music-file').addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(f => {
      playlist.push({ name: f.name.replace(/\.[^/.]+$/, ""), src: URL.createObjectURL(f) });
    });
    localStorage.setItem('radio_playlist', JSON.stringify(playlist));
    alert(`${files.length} canción(es) agregada(s).`);
    closeModals();
  });

  // Cargar por URL o Stream directo
  document.getElementById('btn-add-yt').addEventListener('click', () => {
    const url = prompt("Pega la URL del audio (.mp3 o stream directo):");
    if (url) {
      const title = prompt("Escribe el nombre del tema:") || "Audio por URL";
      playlist.push({ name: title, src: url });
      localStorage.setItem('radio_playlist', JSON.stringify(playlist));
      playNextTrack(url);
      trackTitle.textContent = title;
      closeModals();
    }
  });

  // Abrir Modal de Playlist
  document.getElementById('btn-playlist').addEventListener('click', () => {
    const list = document.getElementById('playlist-items');
    list.innerHTML = '';
    if (playlist.length === 0) {
      list.innerHTML = '<li>No hay canciones guardadas</li>';
    } else {
      playlist.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${item.name}`;
        li.onclick = () => { 
          playNextTrack(item.src); 
          trackTitle.textContent = item.name;
          closeModals(); 
        };
        list.appendChild(li);
      });
    }
    document.getElementById('modal-playlist').style.display = 'flex';
  });

  document.getElementById('btn-add-music').addEventListener('click', () => {
    document.getElementById('modal-add-music').style.display = 'flex';
  });

  btnAddSound.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const newSound = {
          id: Date.now().toString(),
          name: file.name.replace(/\.[^/.]+$/, ""),
          src: URL.createObjectURL(file)
        };
        soundsList.push(newSound);
        renderSounds();
      }
    };
    input.click();
  });

  document.querySelectorAll('.close-modal').forEach(b => {
    b.onclick = closeModals;
  });
}

function openEditSoundModal(id) {
  selectedSoundId = id;
  const sound = soundsList.find(s => s.id === id);
  if (sound) {
    document.getElementById('input-sound-name').value = sound.name;
    document.getElementById('modal-edit-sound').style.display = 'flex';
  }
}

document.getElementById('btn-save-sound-name').onclick = () => {
  const newName = document.getElementById('input-sound-name').value;
  if (newName.trim() !== '') {
    soundsList = soundsList.map(s => s.id === selectedSoundId ? { ...s, name: newName } : s);
    renderSounds();
  }
  closeModals();
};

document.getElementById('btn-delete-sound').onclick = () => {
  soundsList = soundsList.filter(s => s.id !== selectedSoundId);
  renderSounds();
  closeModals();
};

function closeModals() {
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}
