// Collection of deeply authentic, immersive, and character-driven quotes from the Harry Potter companion mascots

export interface MascotQuoteItem {
  quote: string;
  category: 'Spesial Maskot' | 'Mood Harian' | 'Healer Mindset' | 'Anti-Burnout' | 'Tips Klinis' | 'Semangat UKMPPD';
}

export interface MascotOption {
  id: string;
  label: string;
  icon: string;
}

export const AVATAR_OPTIONS: MascotOption[] = [
  { id: '🦉 Hedwig', label: 'Hedwig', icon: '🦉' },
  { id: '⚡ Harry Potter', label: 'Harry Potter', icon: '⚡' },
  { id: '📚 Hermione Granger', label: 'Hermione Granger', icon: '📚' },
  { id: '♟️ Ron Weasley', label: 'Ron Weasley', icon: '♟️' },
  { id: '🧙‍♂️ Albus Dumbledore', label: 'Albus Dumbledore', icon: '🧙‍♂️' },
  { id: '🧪 Severus Snape', label: 'Severus Snape', icon: '🧪' },
  { id: '🐱 Minerva McGonagall', label: 'Minerva McGonagall', icon: '🐱' },
  { id: '🧦 Dobby', label: 'Dobby', icon: '🧦' },
];

export const MOOD_OPTIONS = [
  '🟢 Online',
  '⛔ Jangan Ganggu',
  '🌙 Sedang Istirahat',
  '📚 Sedang Belajar',
  '🏥 Sedang Dinas',
  '☕ Rehat Kopi'
];

export function isMascotSelected(currentAvatar: string | undefined, opt: MascotOption): boolean {
  if (!currentAvatar) return false;
  return (
    currentAvatar === opt.id ||
    currentAvatar.includes(opt.label) ||
    currentAvatar.startsWith(opt.icon) ||
    (Boolean(opt.icon) && currentAvatar.includes(opt.icon))
  );
}

export function isMoodSelected(currentMood: string | undefined, moodOption: string): boolean {
  if (!currentMood) return false;
  return currentMood.trim() === moodOption.trim();
}

// 1. Core character quotes reflecting true canon personality and medical journey
export const mascotQuotesMap: Record<string, MascotQuoteItem[]> = {
  // 🦉 HEDWIG: Setia, burung hantu pintar pengantar surat kelulusan, suka mematuk jarimu sayang saat telat istirahat
  '🦉': [
    {
      quote: '*Hoo-hoo!* (Hedwig menggigit jarimu pelan dengan sayang) Jangan cuma menatap buku dok, minumlah seteguk air hangat dulu! 🦉☕',
      category: 'Anti-Burnout'
    },
    {
      quote: '*Hoo-hoo-hoo!* Aku baru saja terbang melintasi menara penguji. Ada firasat kuat namamu bakal tercetak LULUS UKMPPD di surat resmi! 💌📜',
      category: 'Semangat UKMPPD'
    },
    {
      quote: '(Hedwig bertengger di atas stetoskopmu dan merapikan bulu saljunya) Sayapku siap terbangkan lembar jawaban terbaik ke hadapan dewan penguji! 🦉✨',
      category: 'Spesial Maskot'
    },
    {
      quote: '*Hoo!* Kalau kamu begadang tanpa tidur, aku bakal menyembunyikan pulpenmu di sangkar! Istirahatlah yang cukup, dokter hebat 💤🦉',
      category: 'Anti-Burnout'
    },
    {
      quote: '(Hedwig mengedipkan mata bulatnya dengan bangga) Aku melihat perjuanganmu tiap malam stase. Dokter yang gigih pasti menuai hasil indah! 🦉🌿',
      category: 'Healer Mindset'
    },
    {
      quote: '*Hoo-hoo!* Pesan kilat dari masa depan: Semua hafalan farmakologi yang bikin kepalamu berasap malam ini akan menyelamatkan banyak nyawa! 🦉🩺',
      category: 'Tips Klinis'
    },
    {
      quote: '(Hedwig membentangkan sayap putihnya melindungimu dari cemas) Tenang dok, Dementor keraguan diri tak akan berani mendekat saat aku bersamamu! 🦉🛡️',
      category: 'Spesial Maskot'
    },
    {
      quote: '*Hoo!* Selesaikan 10 butir soal tryout lagi hari ini, setelah itu Hedwig izinkan kamu rehat sambil ngemil kue manis! 🦉🍪',
      category: 'Semangat UKMPPD'
    }
  ],

  // ⚡ HARRY POTTER: Pemimpin DA yang berani, solider, mengusir Dementor keraguan diri, pantang menyerah
  '⚡': [
    {
      quote: '*Expecto Patronum!* Usir semua sindrom imposter dan rasa ragu itu, dok! Di ruang resusitasi nanti, keberanianmu adalah cahaya perak terkuat ⚡🦌',
      category: 'Spesial Maskot'
    },
    {
      quote: 'Waktu pertama kali menghadapi Dementor, kakiku gemetar. Rasa takut itu wajar dok, tapi niat muliamu menyembuhkan orang lain jauh lebih besar! ⚡✨',
      category: 'Healer Mindset'
    },
    {
      quote: 'Aku tidak memenangkan perang sendirian, dok. Ada teman, ada proses, ada latihan tiap hari di Room of Requirement. Begitu juga jalanmu menuju sumpah dokter! ⚡🦁',
      category: 'Semangat UKMPPD'
    },
    {
      quote: 'Kalau kita bisa menaklukkan naga Horntail Hungaria dan Turnamen Triwizard, soal Tryout CBT 150 butir ini pasti bisa kita lewati bersama! ⚡🏆',
      category: 'Spesial Maskot'
    },
    {
      quote: 'Tarik napas panjang, dok. Pegang stetoskopmu seperti memegang Firebolt di tengah badai Quidditch: fokus pada target, jangan goyah! ⚡🧹',
      category: 'Tips Klinis'
    },
    {
      quote: 'Jangan biarkan satu hasil tryout buruk menjatuhkan mentalmu. Bahkan pedang Gryffindor hanya muncul bagi mereka yang tetap bangkit bertarung! ⚡🗡️',
      category: 'Healer Mindset'
    },
    {
      quote: 'Kamu bukan sekadar menghafal buku, dok. Kamu sedang melatih dirimu menjadi perisai hidup bagi pasien yang membutuhkan bantuanmu ⚡🩺',
      category: 'Tips Klinis'
    },
    {
      quote: 'Percayalah pada insting dan persiapanmu. Di saat genting, ketenangan pikiran dokter adalah penyelamat nomor satu! ⚡💪',
      category: 'Anti-Burnout'
    }
  ],

  // 📚 HERMIONE GRANGER: Perfeksionis, kutubuku, logis, cerewet soal silabus dan detail dosis presisi
  '📚': [
    {
      quote: 'Dengar dok! Pelafalannya itu *Levi-O-sa*, bukan *Levio-SA*! Sama halnya dengan terapi: dosisnya harus tepat miligram, jangan main tebak! 📚🧪',
      category: 'Tips Klinis'
    },
    {
      quote: 'Kalau kamu bingung mendiagnosis sindrom nefrotik vs nefritik, pergilah ke buku teks! Kriteria laboratoriumnya sudah tertulis sangat jelas di pedoman! 📚💡',
      category: 'Tips Klinis'
    },
    {
      quote: 'Secara statistik, spaced repetition dan bedah Error Book meningkatkan retensi memori jangka panjang hingga 80%. Jangan malas mencatat soal salah! 📚📑',
      category: 'Healer Mindset'
    },
    {
      quote: 'Buku dan kepintaran! Memang ada hal yang lebih penting seperti persahabatan dan empati, tapi tanpa membaca grimoire, bagaimana kamu mau mendiagnosis pasien?! 📚🩺',
      category: 'Spesial Maskot'
    },
    {
      quote: 'Kalau aku punya Time-Turner cadangan, pasti kupinjamkan padamu dok. Tapi karena tidak ada, manajemen waktu dan drill 20 soal sehari adalah kunci mutlak! ⏳✨',
      category: 'Semangat UKMPPD'
    },
    {
      quote: 'Berhenti menatap layar dengan tatapan kosong! Minum teh chamomile-mu, regangkan leher, lalu kita telaah algoritma syok anafilaktik bersama! 🍵📚',
      category: 'Anti-Burnout'
    },
    {
      quote: 'Buku setebal 1.000 halaman itu tidak dibaca dalam semalam, dok. Dibaca per bab, dipahami patofisiologinya, lalu diuji dengan latihan soal. Kamu pasti bisa! 📚🌟',
      category: 'Healer Mindset'
    },
    {
      quote: 'Aku sudah memeriksa jadwal belajarmu: jika kamu konsisten menuntaskan target sistem hari ini, peluang kelulusan first-taker mendekati 100%! 📚🎓',
      category: 'Semangat UKMPPD'
    }
  ],

  // ♟️ RON WEASLEY: Santai, lucu, setia kawan, doyan makan paha ayam, anggap belajar stase seperti catur sihir
  '♟️': [
    {
      quote: '*Bloody hell*, dok! Tebal banget buku pedoman SKDI itu! Tapi tenang, ibuku di The Burrow selalu bilang: dokter hebat lahir dari orang yang tabah! ♟️🍗',
      category: 'Spesial Maskot'
    },
    {
      quote: 'Jangan belajar terus tanpa makan, dok! Otakmu bakal berasap kayak telinga waktu minum ramuan Pepperup. Yuk comot paha ayam dan butterbeer hangat dulu! 🍗🍺',
      category: 'Anti-Burnout'
    },
    {
      quote: 'Ujian UKMPPD ini persis kayak catur sihir raksasa. Kamu harus tenang, lindungi bidak konsistensimu, lalu skakmat soal-soal sulit itu di akhir ronde! ♟️👑',
      category: 'Tips Klinis'
    },
    {
      quote: 'Tenang dok, jangan panik kayak waktu aku ketemu laba-laba raksasa di Forbidden Forest! Tarik napas, baca pertanyaannya pelan-pelan 🕷️☕',
      category: 'Anti-Burnout'
    },
    {
      quote: 'Bahkan Fred dan George pun bakal kagum lihat dedikasimu belajar tiap hari, dok. Kamu keren banget, serius! ♟️✨',
      category: 'Healer Mindset'
    },
    {
      quote: 'Nilai tryout-mu sempat turun? Santai dok! Sapu terbang Nimbus aja kadang oleng kalau kena angin kencang. Yang penting kita tancap gas lagi hari ini! 🧹💪',
      category: 'Healer Mindset'
    },
    {
      quote: 'Nanti kalau dok sudah lulus dan disumpah dokter, aku bakal jadi orang pertama yang tepuk tangan paling keras di aula besar! Semangat! ♟️🎉',
      category: 'Semangat UKMPPD'
    },
    {
      quote: 'Pusing ngafal antibiotik? Anggap aja penisilin itu ksatria pelindung dan resistensi bakteri itu bidak pion lawan yang harus kita singkirkan! ♟️💊',
      category: 'Tips Klinis'
    }
  ],

  // 🧙‍♂️ ALBUS DUMBLEDORE: Sangat bijaksana, tenang, penuh teka-teki indah, suka permen lemon drop
  '🧙‍♂️': [
    {
      quote: 'Kebahagiaan dapat ditemukan bahkan di saat-saat paling gelap stase, jika seseorang hanya ingat untuk menyalakan cahaya harapan 🌟🕯️',
      category: 'Healer Mindset'
    },
    {
      quote: 'Pilihan kitalah, dokter muda, yang menunjukkan siapa kita sebenarnya, jauh melebihi kemampuan dan kepintaran alami kita 🧙‍♂️📜',
      category: 'Spesial Maskot'
    },
    {
      quote: 'Kata-kata dan empati seorang dokter adalah sumber keajaiban yang tak pernah habis, mampu menyembuhkan luka yang tak terlihat oleh mata 🧙‍♂️💖',
      category: 'Tips Klinis'
    },
    {
      quote: 'Ambillah sebutir permen lemon drop 🍋. Bernapaslah perlahan. Ingatlah bahwa ujian hanyalah cermin kecil, bukan batas akhir dari potensi besarmu 🧙‍♂️✨',
      category: 'Anti-Burnout'
    },
    {
      quote: 'Jangan pernah meratapi soal yang salah di tryout. Kesalahan yang disadari adalah lentera paling terang yang menuntunmu menuju kebijaksanaan klinis 🧙‍♂️💡',
      category: 'Tips Klinis'
    },
    {
      quote: 'Menjadi seorang penyembuh bukanlah beban yang harus kamu pikul dalam ketakutan, melainkan sebuah anugerah mulia untuk menebarkan cinta kasih 🧙‍♂️🕊️',
      category: 'Healer Mindset'
    },
    {
      quote: 'Di balik setiap halaman hafalan yang kamu baca malam ini, ada masa depan banyak orang yang diam-diam sedang kamu selamatkan 🧙‍♂️🌿',
      category: 'Semangat UKMPPD'
    },
    {
      quote: 'Jangan biarkan masa lalu menghantui pikiranmu, dok. Hari ini adalah kanvas bersih untuk menorehkan pemahaman baru yang lebih sempurna 🧙‍♂️✨',
      category: 'Healer Mindset'
    }
  ],

  // 🧪 SEVERUS SNAPE: Sinis, dingin, sarkastik, menuntut presisi tanpa ampun, benci ceroboh, tapi loyal ("Always")
  '🧪': [
    {
      quote: 'Buka grimoire halaman 394! Aku tidak menoleransi tebakan acak di ujian CBT. Pahami farmakokinetiknya atau ramuanmu akan menjadi racun! 🧪📖',
      category: 'Spesial Maskot'
    },
    {
      quote: 'Apakah kamu mengira gelar dokter akan jatuh dari langit seperti bulu burung, tanpa repetisi hafalan yang disiplin? Duduk dan selesaikan 15 soal lagi! 🧪🖤',
      category: 'Semangat UKMPPD'
    },
    {
      quote: 'Ketelitian pikiran adalah benteng pertahanan seorang penyembuh. Satu tetes kelebihan dosis obat dapat merenggut nyawa pasien. Jangan ceroboh! 🧪⚡',
      category: 'Tips Klinis'
    },
    {
      quote: 'Disiplin mengulang materi setiap hari adalah pembeda mutlak antara seorang amatir yang berisik dan seorang maestro klinis sejati 🧪🩺',
      category: 'Healer Mindset'
    },
    {
      quote: 'Kamu merasa lelah? Dunia medis tidak peduli pada keluhanmu. Pasienmu kelak hanya peduli apakah kamu tahu cara menyelamatkan mereka atau tidak 🧪🌿',
      category: 'Tips Klinis'
    },
    {
      quote: 'Jangan menatapku seperti itu. Aku mengujimu dengan kasus-kasus rumit sekarang agar tanganmu tidak gemetar saat menghadapi dewan penguji nanti 🧪🗡️',
      category: 'Spesial Maskot'
    },
    {
      quote: 'Bahkan setelah ratusan stase yang melelahkan, apakah tekadmu untuk menjadi dokter masih menyala? Tunjukkan padaku bahwa jawabannya adalah: *Always*. 🧪🖤',
      category: 'Healer Mindset'
    },
    {
      quote: 'Kendalikan emosimu, tutup celah kebingunganmu. *Occlumency* pikiranmu dari panik saat membaca skenario soal kasus gawat darurat! 🧪🧠',
      category: 'Tips Klinis'
    }
  ],

  // 🐱 MINERVA MCGONAGALL: Tegas, berwibawa, kepala asrama Gryffindor, tidak suka alasan, bangga pada murid gigih
  '🐱': [
    {
      quote: 'Sepuluh poin untuk ketepatan diagnosis bandingmu hari ini! Pertahankan standar keunggulan itu sampai hari ujian tiba! 🐱✨',
      category: 'Spesial Maskot'
    },
    {
      quote: 'Duduk tegak, rapikan jas stetoskopmu, dan hadapi stase ini dengan martabat serta integritas seorang profesional medis sejati! 🐱🩺',
      category: 'Healer Mindset'
    },
    {
      quote: 'Ambil biskuit jahe ini 🍪 dan istirahatlah sepuluh menit. Setelah itu, aku ingin melihatmu kembali menuntaskan 20 soal latihan tanpa mengeluh! 🐱🍵',
      category: 'Anti-Burnout'
    },
    {
      quote: 'Aku tidak akan membiarkan anak didikku melangkah masuk ke ruang ujian UKMPPD dengan persiapan setengah matang. Buka kembali catatan OSCE-mu! 🐱📜',
      category: 'Tips Klinis'
    },
    {
      quote: 'Ketegasan, ketenangan, dan ketelitian adalah tiga pilar utama seorang dokter saat memimpin penanganan darurat di IGD 🐱💪',
      category: 'Tips Klinis'
    },
    {
      quote: 'Kamu memiliki potensi yang luar biasa, dok. Jangan berani-berani meremehkan dirimu sendiri di hadapanku! Buktikan kemampuanmu di tryout ini! 🐱🦁',
      category: 'Semangat UKMPPD'
    },
    {
      quote: 'Dunia kedokteran membutuhkan orang-orang dengan keteguhan hati sepertimu. Jadilah kebanggaan kami di hari pengumuman kelulusan nanti! 🐱🏛️',
      category: 'Semangat UKMPPD'
    },
    {
      quote: 'Sebagai Kepala Asrama, aku menuntut disiplin tinggi: satu hari terlewat tanpa belajar adalah sepuluh langkah mundur dari target kelulusanmu! 🐱⚡',
      category: 'Healer Mindset'
    }
  ],

  // 🧦 DOBBY: Peri rumah yang luar biasa setia, tulus, memuja dokter, khawatir jika dokter sakit
  '🧦': [
    {
      quote: 'Dobby sudah menyeterika jas putih dokter sampai licin dan bersih! Dobby yakin dokter akan menjadi dokter paling hebat di seluruh dunia! 🧦✨',
      category: 'Spesial Maskot'
    },
    {
      quote: 'Dokter yang baik hati tidak boleh memaksakan diri begadang tanpa tidur! Dobby akan sangat sedih kalau dokter sampai jatuh sakit 🧦🍵',
      category: 'Anti-Burnout'
    },
    {
      quote: 'Dobby akan menjaga catatan dan grimoire dokter baik-baik! Dobby percaya dokter pasti lulus UKMPPD dengan nilai tertinggi! 🧦🌸',
      category: 'Semangat UKMPPD'
    },
    {
      quote: 'Dobby sangat bangga melihat dokter belajar begitu rajin setiap hari! Dokter adalah orang yang paling mulia dan penuh kebaikan! 🧦💖',
      category: 'Healer Mindset'
    },
    {
      quote: 'Tidak ada soal tryout yang terlalu sulit untuk dokter hebat seperti tuan dokter! Dobby akan menyemangati dokter di setiap butir soal! 🧦🌟',
      category: 'Semangat UKMPPD'
    },
    {
      quote: 'Dobby membawakan kaus kaki hangat dan teh madu untuk menemani dokter belajar malam ini! Semangat belajarnya ya, dok! 🧦🍯',
      category: 'Anti-Burnout'
    },
    {
      quote: 'Dobby tahu dokter sedang berjuang keras. Dokter tidak sendirian, Dobby akan selalu berdiri di samping dokter sampai hari sumpah dokter tiba! 🧦🕊️',
      category: 'Healer Mindset'
    },
    {
      quote: 'Dobby melihat nama dokter bercahaya terang di daftar kelulusan! Dobby akan melompat gembira merayakannya bersama dokter! 🧦🎉',
      category: 'Spesial Maskot'
    }
  ]
};

// 2. Character-specific reactions to Discord-style Status presets
export const characterMoodReactions: Record<string, Record<string, string>> = {
  '🦉': {
    'online': '*Hoo-hoo!* Hedwig meluncur turun ke mejamu, siap menyimak lembar demi lembar latihan soal hari ini! 🦉🟢',
    'jangan ganggu': '*Hoo!* Pintu kamar belajar tertutup rapat. Hedwig bertengger di jendela agar tak ada yang mengganggu fokus dokter! 🦉⛔',
    'istirahat': '(Hedwig mematuk selimutmu pelan) Tidurlah lelap dok, biar Hedwig yang menjaga mejamu sampai fajar tiba 🦉🌙',
    'belajar': '*Hoo-hoo!* Grimoire terbuka lebar. Sayapku siap membantumu membalik halaman hafalan klinis berikutnya! 🦉📚',
    'dinas': '*Hoo!* Semangat dinas di rumah sakit dok! Hedwig menunggumu pulang dengan kabar baik dari stase bangsal 🦉🏥',
    'kopi': '(Hedwig mengendus aroma kopi hangatmu) Nikmati seruputannya dok, kafein segar bikin mata awas membaca soal! 🦉☕'
  },
  '⚡': {
    'online': 'Status aktif! Ayo dok, kita kumpulkan kekuatan seperti latihan DA di Room of Requirement! ⚡🟢',
    'jangan ganggu': 'Fokus penuh! Aku pasang mantra Pelindung *Protego* di sekeliling mejamu agar tidak ada distraksi! ⚡⛔',
    'istirahat': 'Rehatlah dok. Bahkan pencarian Horcrux pun butuh jeda tidur agar pikiran tetap jernih dan tajam ⚡🌙',
    'belajar': 'Bagus dok! Setiap topik yang kamu pahami hari ini adalah mantra penakluk ujian kelak! ⚡📚',
    'dinas': 'Jaga stase bangsal dengan berani dok! Jadilah pelindung bagi pasien yang membutuhkan pertolonganmu ⚡🏥',
    'kopi': 'Secangkir kopi hangat dulu dok, lalu kita tancap gas lagi menaklukkan arena Tryout CBT! ⚡☕'
  },
  '📚': {
    'online': 'Bagus, kamu sudah online! Aku sudah menyusun prioritas topik SKDI yang wajib kita selesaikan hari ini! 📚🟢',
    'jangan ganggu': 'Mode konsentrasi tinggi! Jangan buka media sosial, selesaikan 20 soal farmakologi ini sekarang juga! 📚⛔',
    'istirahat': 'Secara ilmiah, tidur 7 jam membantu konsolidasi memori di hipokampus. Tutup bukumu dan tidurlah, dok! 📚🌙',
    'belajar': 'Bagus sekali! Catat kata kunci penting dan jangan lupa masukkan soal-soal jebakan ke Error Book! 📚✨',
    'dinas': 'Semangat dinas dok! Terapkan ilmu dari jurnal dan pedoman tatalaksana terbaru saat berhadapan dengan pasien 📚🏥',
    'kopi': 'Kafein secukupnya saja ya dok! Otak tetap butuh hidrasi air putih agar sintesis neurotransmitter optimal 📚☕'
  },
  '♟️': {
    'online': 'Asyik, dokternya sudah online! Yuk kita mulai belajarnya biar cepat kelar dan bisa nyantai lagi! ♟️🟢',
    'jangan ganggu': 'Ssst! Jangan ganggu dokternya, lagi mode dewa bedah kasus! Aku jaga pintunya dari luar! ♟️⛔',
    'istirahat': 'Nah ini dia yang kutunggu! Tarik selimut dok, mimpi indah makan pesta tart treacle di Great Hall ♟️🌙',
    'belajar': 'Mantap dok! Baca soalnya pelan-pelan ya, jangan kayak aku yang sering buru-buru kena jebakan bidak catur! ♟️📚',
    'dinas': 'Semangat dinas dok! Jangan lupa kantongi cokelat di saku jas dokter buat jaga-jaga kalau lelah pas jaga malam! ♟️🏥',
    'kopi': 'Aroma kopinya mantap banget dok! Temani sama biskuit jahe atau pai labu hangat biar makin nendang! ♟️☕'
  },
  '🧙‍♂️': {
    'online': 'Selamat datang kembali, dokter muda. Mari kita jelajahi samudera pengetahuan medis dengan hati yang jernih 🧙‍♂️🟢',
    'jangan ganggu': 'Di dalam keheningan yang mendalam, pemahaman sejati menemukan akarnya yang kokoh 🧙‍♂️⛔',
    'istirahat': 'Tidurlah dengan damai. Di dalam istirahat yang tenang, jiwa kita menemukan kesegaran untuk menyembuhkan esok hari 🧙‍♂️🌙',
    'belajar': 'Membaca adalah dialog sunyi dengan para penyembuh terdahulu. Resapi setiap kebijaksanaan klinis ini perlahan 🧙‍♂️📚',
    'dinas': 'Bawalah kehangatan dan kebaikan hatimu ke hadapan pasien. Kehadiran dokter yang tulus adalah setengah dari kesembuhan 🧙‍♂️🏥',
    'kopi': 'Secangkir kehangatan di tengah dinginnya perjuangan. Nikmati setiap tetesnya dengan rasa syukur 🧙‍♂️☕'
  },
  '🧪': {
    'online': 'Akhirnya kamu hadir. Jangan buang waktuku dengan kemalasan. Tunjukkan bahwa kamu siap belajar dengan serius 🧪🟢',
    'jangan ganggu': 'Konsentrasi penuh. Jika ada yang berani mengganggu sesi belajarmu, akan kupastikan mereka menyesal 🧪⛔',
    'istirahat': 'Istirahatlah secukupnya. Jangan jadikan rasa kantuk sebagai dalih untuk melalaikan kewajibanmu esok hari 🧪🌙',
    'belajar': 'Bagus. Teliti setiap kontraindikasi obat dan efek sampingnya. Tidak ada ruang untuk kelalaian di bawah pengawasanku 🧪📚',
    'dinas': 'Waspadalah selama dinas. Setiap keputusan klinis yang kamu ambil membawa konsekuensi nyata bagi nyawa manusia 🧪🏥',
    'kopi': 'Menyesap stimulan lagi? Pastikan kadar kafein itu tidak mengaburkan ketelitian diagnosis bandingmu 🧪☕'
  },
  '🐱': {
    'online': 'Waktunya belajar! Duduk tegak, fokuskan perhatianmu pada silabus hari ini! 🐱🟢',
    'jangan ganggu': 'Fokus penuh tanpa distraksi. Sikap yang pantas diapresiasi dari calon dokter berintegritas tinggi! 🐱⛔',
    'istirahat': 'Istirahatlah sekarang juga. Aku tidak ingin melihat anak didikku pingsan karena kelelahan saat ronde bangsal besok 🐱🌙',
    'belajar': 'Buka catatanmu dan telaah kasus klinis ini dengan cermat. Tunjukkan ketajaman analisis khas asrama Gryffindor! 🐱📚',
    'dinas': 'Jaga integritas dan martabat profesionalmu selama bertugas di rumah sakit dok. Kami mengandalkanmu! 🐱🏥',
    'kopi': 'Nikmati kopimu sejenak, rapikan meja belajarmu, lalu kita kembali drill soal dengan semangat membara! 🐱☕'
  },
  '🧦': {
    'online': 'Dokter yang baik hati sudah online! Dobby siap membantu membawakan semua buku dan catatan dokter! 🧦🟢',
    'jangan ganggu': 'Dobby akan berdiri tegak di depan pintu! Tidak ada yang boleh mengganggu konsentrasi dokter hebat! 🧦⛔',
    'istirahat': 'Dobby sudah merapikan bantal dokter! Dokter harus tidur nyenyak agar esok bangun dengan tubuh yang segar dan sehat 🧦🌙',
    'belajar': 'Dobby sangat kagum melihat dokter membaca begitu tekun! Dobby yakin dokter akan lulus dengan nilai A! 🧦📚',
    'dinas': 'Dobby berdoa agar dokter selalu dilindungi selama dinas dan semua pasien dokter lekas sembuh! 🧦🏥',
    'kopi': 'Dobby membawakan cangkir hangat untuk dokter! Jangan lupa diminum pelan-pelan ya dok, masih panas! 🧦☕'
  }
};

function getCharacterCustomStatusResponse(charKey: string, customMood: string): string {
  switch (charKey) {
    case '🧪':
      return `Status "${customMood}"? Apapun kondisimu, jangan biarkan fokus analisismu kendor barang sedetik pun 🧪🖤`;
    case '📚':
      return `Aku mencatat statusmu: "${customMood}". Tetap perhatikan jadwal belajar dan jangan abaikan target harian ya dok! 📚✨`;
    case '♟️':
      return `Wih, statusnya "${customMood}"! Semangat terus dok, yang penting jangan lupa ngemil biar tetap berenergi! ♟️🍗`;
    case '🧙‍♂️':
      return `Melihat statusmu "${customMood}", semoga langkahmu hari ini senantiasa dipenuhi ketenangan dan kebijaksanaan 🧙‍♂️🌿`;
    case '🐱':
      return `Status "${customMood}" tercatat. Tunjukkan keteguhan hatimu dan selesaikan tugas-tugas klinismu dengan bangga! 🐱✨`;
    case '🧦':
      return `Dobby melihat dokter sedang "${customMood}"! Dobby akan mendoakan dan menyemangati dokter dari dekat! 🧦💖`;
    case '⚡':
      return `Status "${customMood}"! Bersama-sama, tidak ada rintangan yang tak bisa kita taklukkan hari ini dok! ⚡🦁`;
    case '🦉':
    default:
      return `*Hoo-hoo!* Hedwig mencatat status "${customMood}". Terus terbang tinggi mengejar impian sumpah doktermu! 🦉✨`;
  }
}

export function getAllQuotesForMascot(avatar?: string, mood?: string): MascotQuoteItem[] {
  // 1. Identify which character is selected
  let charKey = '🦉';
  if (avatar) {
    if (avatar.includes('⚡') || avatar.includes('Harry')) charKey = '⚡';
    else if (avatar.includes('📚') || avatar.includes('Hermione')) charKey = '📚';
    else if (avatar.includes('♟️') || avatar.includes('Ron')) charKey = '♟️';
    else if (avatar.includes('🧙‍♂️') || avatar.includes('Dumbledore')) charKey = '🧙‍♂️';
    else if (avatar.includes('🧪') || avatar.includes('Snape')) charKey = '🧪';
    else if (avatar.includes('🐱') || avatar.includes('McGonagall')) charKey = '🐱';
    else if (avatar.includes('🧦') || avatar.includes('Dobby')) charKey = '🧦';
    else if (avatar.includes('🦉') || avatar.includes('Hedwig')) charKey = '🦉';
  }

  // 2. Get character's core quotes
  const coreQuotes = mascotQuotesMap[charKey] || mascotQuotesMap['🦉'];
  const result: MascotQuoteItem[] = [...coreQuotes];

  // 3. If mood exists, put the character's reaction right at the top
  if (mood && mood.trim()) {
    const charReactions = characterMoodReactions[charKey] || characterMoodReactions['🦉'];
    let matchedReaction: string | null = null;

    for (const [key, quote] of Object.entries(charReactions)) {
      if (mood.toLowerCase().includes(key.toLowerCase())) {
        matchedReaction = quote;
        break;
      }
    }

    if (matchedReaction) {
      result.unshift({
        quote: matchedReaction,
        category: 'Mood Harian'
      });
    } else {
      result.unshift({
        quote: getCharacterCustomStatusResponse(charKey, mood),
        category: 'Mood Harian'
      });
    }
  }

  return result;
}
