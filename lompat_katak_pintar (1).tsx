import React, { useState, useEffect } from 'react';

// Menambahkan font khusus untuk gaya kartun
const injectFonts = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap');
    .font-fredoka { font-family: 'Fredoka One', cursive; }
    .font-nunito { font-family: 'Nunito', sans-serif; }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-5px); }
      40%, 80% { transform: translateX(5px); }
    }
    .animate-shake {
      animation: shake 0.4s ease-in-out;
    }
    
    @keyframes jump {
      0% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-40px) scale(1.1); }
      100% { transform: translateY(0) scale(1); }
    }
    .animate-jump {
      animation: jump 0.5s ease-in-out;
    }
  `;
  document.head.appendChild(style);
};

// Kumpulan soal Bahasa Indonesia Kelas 3 SD
const GAME_DATA = {
  sinonim: {
    title: "Sinonim (Persamaan Kata)",
    icon: "🤝",
    color: "bg-green-400",
    questions: [
      { q: 'Kata yang memiliki arti sama dengan "Senang" adalah...', options: ['Gembira', 'Sedih', 'Marah', 'Takut'], answer: 'Gembira' },
      { q: 'Sinonim dari kata "Pintar" adalah...', options: ['Bodoh', 'Malas', 'Pandai', 'Lama'], answer: 'Pandai' },
      { q: 'Persamaan kata "Melihat" adalah...', options: ['Mendengar', 'Menatap', 'Berjalan', 'Meraba'], answer: 'Menatap' },
      { q: '"Cepat" sama artinya dengan...', options: ['Kencang', 'Lambat', 'Berhenti', 'Diam'], answer: 'Kencang' },
      { q: 'Kata "Bohong" sama artinya dengan...', options: ['Jujur', 'Benar', 'Dusta', 'Baik'], answer: 'Dusta' },
    ]
  },
  antonim: {
    title: "Antonim (Lawan Kata)",
    icon: "↔️",
    color: "bg-blue-400",
    questions: [
      { q: 'Lawan kata dari "Tinggi" adalah...', options: ['Pendek', 'Besar', 'Panjang', 'Kurus'], answer: 'Pendek' },
      { q: 'Antonim dari "Gelap" adalah...', options: ['Hitam', 'Terang', 'Malam', 'Suram'], answer: 'Terang' },
      { q: 'Lawan kata "Rajin" adalah...', options: ['Pintar', 'Cepat', 'Malas', 'Giat'], answer: 'Malas' },
      { q: 'Antonim "Panas" adalah...', options: ['Dingin', 'Hangat', 'Api', 'Terbakar'], answer: 'Dingin' },
      { q: 'Lawan kata "Menangis" adalah...', options: ['Tertawa', 'Sedih', 'Tidur', 'Makan'], answer: 'Tertawa' },
    ]
  },
  tebakKata: {
    title: "Tebak Kata",
    icon: "🤔",
    color: "bg-purple-400",
    questions: [
      { q: 'Aku adalah tempat murid-murid belajar bersama guru. Aku adalah...', options: ['Rumah', 'Pasar', 'Sekolah', 'Taman'], answer: 'Sekolah' },
      { q: 'Hewan ini berbadan besar dan memiliki belalai yang panjang. Hewan apakah ini?', options: ['Singa', 'Jerapah', 'Gajah', 'Kuda'], answer: 'Gajah' },
      { q: 'Benda ini digunakan untuk melindungi kepala dari panas dan hujan saat berjalan. Apakah itu?', options: ['Payung', 'Sepatu', 'Topi', 'Baju'], answer: 'Payung' },
      { q: 'Ayah dari ayah atau ibu kita, panggilannya adalah...', options: ['Paman', 'Kakak', 'Kakek', 'Bibi'], answer: 'Kakek' },
      { q: 'Tempat untuk membeli obat-obatan disebut...', options: ['Apotek', 'Stasiun', 'Bandara', 'Kantor Pos'], answer: 'Apotek' },
    ]
  },
  ejaan: {
    title: "Ejaan & Tanda Baca",
    icon: "📝",
    color: "bg-orange-400",
    questions: [
      { q: 'Penulisan nama orang yang benar di bawah ini adalah...', options: ['budi santoso', 'Budi Santoso', 'budi Santoso', 'Budi santoso'], answer: 'Budi Santoso' },
      { q: 'Tanda baca yang digunakan untuk mengakhiri kalimat tanya adalah...', options: ['Tanda seru (!)', 'Tanda titik (.)', 'Tanda tanya (?)', 'Tanda koma (,)'], answer: 'Tanda tanya (?)' },
      { q: '"Tolong ambilkan buku itu" Tanda baca yang tepat di akhir kalimat ini adalah...', options: ['!', '?', '.', ','], answer: '!' },
      { q: 'Penulisan nama hari yang benar adalah...', options: ['hari senin', 'hari Senin', 'Hari senin', 'Hari Senin'], answer: 'hari Senin' },
      { q: 'Tanda baca untuk memisahkan rincian (seperti: apel... jeruk... dan mangga) adalah...', options: ['Titik (.)', 'Seru (!)', 'Koma (,)', 'Tanya (?)'], answer: 'Koma (,)' },
    ]
  }
};

// Sintesis Audio menggunakan Web Audio API (Tanpa file eksternal)
const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now); osc.stop(now + 0.1);
    } else if (type === 'correct') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'win') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.setValueAtTime(400, now + 0.2);
      osc.frequency.setValueAtTime(500, now + 0.4);
      osc.frequency.setValueAtTime(600, now + 0.6);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
      osc.start(now); osc.stop(now + 1.2);
    }
  } catch(e) { console.log("Audio not supported"); }
};

export default function App() {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'win'
  const [mode, setMode] = useState(null);
  const [step, setStep] = useState(0); // Posisi katak (0 sampai 5)
  const [questions, setQuestions] = useState([]);
  const [wrongShake, setWrongShake] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    injectFonts();
  }, []);

  const startGame = (selectedMode) => {
    playSound('click');
    setMode(selectedMode);
    
    // Mengacak urutan opsi jawaban agar tidak selalu di posisi yang sama
    const shuffledQuestions = GAME_DATA[selectedMode].questions.map(q => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5)
    }));
    
    setQuestions(shuffledQuestions);
    setStep(0);
    setGameState('playing');
  };

  const handleAnswer = (selectedOption) => {
    const currentQ = questions[step];
    
    if (selectedOption === currentQ.answer) {
      playSound('correct');
      setIsJumping(true);
      
      setTimeout(() => {
        setIsJumping(false);
        if (step + 1 >= questions.length) {
          setGameState('win');
          playSound('win');
        } else {
          setStep(step + 1);
        }
      }, 500); // Waktu animasi melompat selesai
    } else {
      playSound('wrong');
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 400); // Reset animasi getar
    }
  };

  const backToMenu = () => {
    playSound('click');
    setGameState('menu');
    setStep(0);
  };

  // --- TAMPILAN MENU UTAMA ---
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-blue-100 font-nunito flex flex-col items-center py-10 px-4 relative overflow-hidden">
        {/* Latar Belakang Kartun */}
        <div className="absolute top-10 left-10 text-6xl opacity-20">☁️</div>
        <div className="absolute top-20 right-20 text-7xl opacity-20">☁️</div>
        <div className="absolute bottom-10 left-5 text-6xl opacity-40">🌱</div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-40">🍄</div>

        <div className="z-10 text-center max-w-3xl w-full">
          <h1 className="text-5xl md:text-6xl font-fredoka text-green-600 drop-shadow-lg mb-2">
            Lompat Katak Pintar 🐸
          </h1>
          <p className="text-xl md:text-2xl text-blue-800 font-bold mb-10 bg-white/50 inline-block px-6 py-2 rounded-full shadow-sm">
            Petualangan Bahasa Indonesia Kelas 3
          </p>

          <h2 className="text-2xl font-bold text-gray-700 mb-6">Pilih Misi Petualanganmu:</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full px-4">
            {Object.keys(GAME_DATA).map((key) => {
              const data = GAME_DATA[key];
              return (
                <button
                  key={key}
                  onClick={() => startGame(key)}
                  className={`${data.color} p-6 rounded-3xl shadow-[0_8px_0_0_rgba(0,0,0,0.15)] hover:bg-opacity-90 active:shadow-none active:translate-y-2 transition-all flex flex-col items-center justify-center gap-3 border-4 border-white group`}
                >
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300 animate-float">{data.icon}</span>
                  <span className="text-2xl font-fredoka text-white drop-shadow-md">{data.title}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="absolute bottom-4 text-sm font-bold text-gray-500">
          Untuk Guru dan Siswa SD Kelas 3
        </div>
      </div>
    );
  }

  // --- TAMPILAN PERMAINAN ---
  if (gameState === 'playing') {
    const currentQuestion = questions[step];
    
    // Perhitungan posisi katak berdasarkan langkah (0 - 5)
    // 0 = Awal, 5 = Akhir (Bunga Teratai)
    const maxSteps = questions.length;
    const progressPercent = (step / maxSteps) * 100;

    return (
      <div className="min-h-screen bg-sky-200 font-nunito flex flex-col items-center py-6 px-4">
        
        {/* Header Permainan */}
        <div className="w-full max-w-4xl flex justify-between items-center mb-6 bg-white/70 p-3 rounded-2xl shadow-sm border-2 border-white">
          <button 
            onClick={backToMenu}
            className="px-4 py-2 bg-red-400 text-white font-bold rounded-xl shadow-[0_4px_0_0_#b91c1c] active:translate-y-1 active:shadow-none"
          >
            ◀ Kembali
          </button>
          <h2 className="text-2xl font-fredoka text-blue-700">
            {GAME_DATA[mode].icon} {GAME_DATA[mode].title}
          </h2>
          <div className="text-xl font-bold text-green-600 bg-green-100 px-4 py-2 rounded-xl">
            {step + 1} / {maxSteps}
          </div>
        </div>

        {/* Area Kolam (Jalur Visual) */}
        <div className="w-full max-w-4xl h-48 md:h-56 bg-blue-400 rounded-3xl shadow-inner relative overflow-hidden mb-8 border-8 border-green-600 flex items-center justify-between px-4 md:px-10">
          {/* Efek air */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" style={{ backgroundSize: '20px 20px' }}></div>
          
          {/* Daun Teratai (Batu Loncatan) */}
          {[...Array(maxSteps + 1)].map((_, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center justify-center">
              {index === maxSteps ? (
                <span className="text-5xl md:text-6xl animate-pulse">🪷</span> // Tujuan Akhir
              ) : (
                <span className="text-5xl md:text-6xl opacity-80 drop-shadow-md">🍃</span>
              )}
            </div>
          ))}

          {/* Katak Sang Pahlawan */}
          <div 
            className="absolute z-20 transition-all duration-500 ease-in-out flex items-center justify-center"
            style={{ 
              left: `calc(2.5rem + ${progressPercent}% * 0.85)`, // Penyesuaian agar tidak keluar layar
              transform: 'translateX(-50%)'
            }}
          >
            <div className={`text-6xl md:text-7xl drop-shadow-xl ${isJumping ? 'animate-jump' : 'animate-float'}`}>
              🐸
            </div>
          </div>
        </div>

        {/* Area Soal dan Jawaban */}
        <div className={`w-full max-w-3xl bg-white rounded-3xl p-6 md:p-10 shadow-xl border-b-8 border-gray-300 ${wrongShake ? 'animate-shake border-red-500 bg-red-50' : ''}`}>
          
          <div className="bg-yellow-100 border-4 border-yellow-400 rounded-2xl p-6 mb-8 relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 font-bold px-6 py-1 rounded-full text-sm border-2 border-white">
              Pertanyaan
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-800 text-center leading-relaxed font-nunito">
              {currentQuestion.q}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className="bg-blue-500 text-white font-bold text-lg md:text-xl py-4 px-6 rounded-2xl shadow-[0_6px_0_0_#1d4ed8] hover:bg-blue-400 active:shadow-none active:translate-y-2 transition-all border-2 border-blue-300"
              >
                {option}
              </button>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // --- TAMPILAN MENANG (VICTORY) ---
  if (gameState === 'win') {
    return (
      <div className="min-h-screen bg-green-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Konfeti Emojis */}
        <div className="absolute top-10 left-20 text-4xl animate-float" style={{animationDelay: '0s'}}>🎉</div>
        <div className="absolute top-20 right-20 text-4xl animate-float" style={{animationDelay: '0.5s'}}>✨</div>
        <div className="absolute bottom-20 left-1/4 text-4xl animate-float" style={{animationDelay: '1s'}}>🎈</div>
        <div className="absolute top-1/3 right-1/4 text-4xl animate-float" style={{animationDelay: '1.5s'}}>⭐</div>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-8 border-yellow-400 text-center max-w-xl w-full z-10 animate-jump">
          <div className="text-8xl mb-6">🐸🪷</div>
          <h1 className="text-4xl md:text-5xl font-fredoka text-green-600 mb-4 drop-shadow-sm">
            Hore! Berhasil!
          </h1>
          <p className="text-xl text-gray-600 font-bold mb-8 font-nunito">
            Kamu telah membantu Katak mencapai Bunga Teratai Emas. Kamu sangat pintar Bahasa Indonesia!
          </p>
          
          <button 
            onClick={backToMenu}
            className="w-full bg-yellow-400 text-yellow-900 font-fredoka text-2xl py-4 px-8 rounded-2xl shadow-[0_6px_0_0_#ca8a04] hover:bg-yellow-300 active:shadow-none active:translate-y-2 transition-all border-4 border-white"
          >
            Main Lagi 🔄
          </button>
        </div>
      </div>
    );
  }

  return null;
}