/* ============================================================
   script.js - Try Out TPB (professional, modular, accessible)
   Features:
   - Timer 60 minutes with visual progress
   - Shuffle questions & answers
   - Navigation prev/next + thumbnails
   - Save to localStorage and resume
   - Result + explanations + CSV export
   ============================================================ */

/* ----------------------- Data Bank ------------------------- */
/* Example bank: extendable. Each entry: q, a,b,c,d, correct (key), explain */
const QUIZ_BANK = {
  math: [
    { q: "Turunan dari x² adalah ...", a: "x", b: "2x", c: "x²", d: "2", correct: "b", explain: "Turunan x² terhadap x adalah 2x." },
    { q: "Integral ∫ x dx = ?", a: "x²/2 + C", b: "x + C", c: "1/x + C", d: "ln x + C", correct: "a", explain: "Integral x dx = x²/2 + C." },
    { q: "Limit (x→1) of (x²-1)/(x-1) = ?", a: "0", b: "2", c: "1", d: "Tidak terdefinisi", correct: "b", explain: "Gunakan faktorisasi: (x+1)." },
    { q: "Jika f(x)=3x+2, maka f(5)=?", a: "17", b: "15", c: "11", d: "13", correct: "a", explain: "f(5)=3*5+2=17." },
    { q: "Pecahan 3/4 dalam desimal = ?", a: "0.5", b: "0.75", c: "0.25", d: "0.8", correct: "b", explain: "3/4 = 0.75." },
    { q: "Akar kuadrat dari 81 adalah ...", a: "8", b: "9", c: "7", d: "81", correct: "b", explain: "√81 = 9." },
    { q: "Jumlah suku aritmetika pertama n adalah ...", a: "n(a1 + an)/2", b: "n^2", c: "n(a1 - an)/2", d: "an - a1", correct: "a", explain: "Rumus jumlah deret aritmetika." },
    { q: "Bentuk kompleks i^2 = ?", a: "-1", b: "1", c: "i", d: "0", correct: "a", explain: "i^2 = -1." },
    { q: "Jika log_a(b)=c maka b = ?", a: "a^c", b: "c^a", c: "a + c", d: "a*c", correct: "a", explain: "Definisi log: a^c = b." },
    { q: "Kombinasi C(5,2) = ?", a: "10", b: "20", c: "5", d: "15", correct: "a", explain: "C(5,2)=5*4/2=10." },
    { q: "Persamaan garis melalui (0,0) dan (1,2) = ?", a: "y=2x", b: "y=x", c: "y=3x", d: "y=2x+1", correct: "a", explain: "Kemiringan 2, intercept 0." },
    { q: "Pangkat: (x^2)*(x^3) = ?", a: "x^5", b: "x^6", c: "x^1", d: "x^9", correct: "a", explain: "Tambah eksponen: 2+3=5." }
  ],
  phys: [
    { q: "Satuan SI untuk gaya adalah ...", a: "Joule", b: "Newton", c: "Pascal", d: "Watt", correct: "b", explain: "Gaya diukur dalam Newton (N)." },
    { q: "Hukum Newton III berbunyi ...", a: "F=ma", b: "Setiap aksi ada reaksi", c: "Energi kekal", d: "Kecepatan konstan", correct: "b", explain: "Aksi = reaksi." },
    { q: "Energi kinetik = ?", a: "1/2 mv^2", b: "mgh", c: "mv", d: "F*s", correct: "a", explain: "Energi kinetik = 1/2 m v^2." },
    { q: "Satuan tekanan adalah ...", a: "Newton", b: "Pascal", c: "Watt", d: "Coulomb", correct: "b", explain: "Tekanan: Pascal (Pa) = N/m²." },
    { q: "Cepat rambat gelombang (v) = ?", a: "λ / f", b: "f * λ", c: "k / ω", d: "T * λ", correct: "b", explain: "v = f × λ." },
    { q: "Suhu 0°C dalam Kelvin = ?", a: "273 K", b: "100 K", c: "273.15 K", d: "0 K", correct: "c", explain: "0°C = 273.15 K." },
    { q: "Gaya sentripetal diarahkan ...", a: "Ke luar", b: "Ke dalam (pusat)", c: "Sejajar kecepatan", d: "Tidak ada", correct: "b", explain: "Sentripetal menuju pusat." },
    { q: "Satuan energi dalam SI adalah ...", a: "Newton", b: "Watt", c: "Joule", d: "Pascal", correct: "c", explain: "Energi = Joule (J)." },
    { q: "Hukum Ohm: V = ?", a: "IR", b: "I/R", c: "R/I", d: "P*I", correct: "a", explain: "V = I × R." },
    { q: "Percepatan gravitasi dekat permukaan Bumi ~", a: "9.8 m/s²", b: "8.9 m/s²", c: "10.8 m/s²", d: "1 m/s²", correct: "a", explain: "g ≈ 9.8 m/s²." },
    { q: "Kalor jenis dilambangkan dengan ...", a: "c", b: "k", c: "Q", d: "m", correct: "a", explain: "Kalor jenis biasanya c." },
    { q: "Momentum p = ?", a: "m/v", b: "m*v", c: "1/2 mv^2", d: "F/t", correct: "b", explain: "Momentum = massa × kecepatan." }
  ],
  chem: [
    { q: "Nomor atom Oksigen adalah ...", a: "6", b: "7", c: "8", d: "9", correct: "c", explain: "O memiliki nomor atom 8." },
    { q: "Ikatan kovalen terbentuk karena ...", a: "Transfer elektron", b: "Berbagi pasangan elektron", c: "Gaya elektrostatik", d: "Perbedaan massa", correct: "b", explain: "Kovalen = berbagi elektron." },
    { q: "Air (H₂O) sifatnya ...", a: "Ionik", b: "Kovalen polar", c: "Logam", d: "Asam kuat", correct: "b", explain: "H₂O adalah molekul kovalen polar." },
    { q: "pH < 7 menunjukkan larutan ...", a: "Basa", b: "Netral", c: "Asam", d: "Alkali", correct: "c", explain: "pH rendah = asam." },
    { q: "Reaksi pembakaran sempurna produk utama ...", a: "CO₂ dan H₂O", b: "C dan O₂", c: "CO dan H₂O", d: "H₂O₂", correct: "a", explain: "Pembakaran sempurna menghasilkan CO₂ dan H₂O." },
    { q: "Titik didih air pada tekanan 1 atm ≈", a: "0°C", b: "100°C", c: "50°C", d: "200°C", correct: "b", explain: "Titik didih air ~100°C pada 1 atm." },
    { q: "Molaritas mengukur ...", a: "massa", b: "mol/L", c: "massa jenis", d: "volume", correct: "b", explain: "Molaritas = jumlah mol per liter." },
    { q: "Simbol unsur besi adalah ...", a: "Fe", b: "Bi", c: "Be", d: "Br", correct: "a", explain: "Fe = besi." },
    { q: "Ikatan ionik biasanya terbentuk antara ...", a: "Logam & non-logam", b: "Non-logam & non-logam", c: "Logam & logam", d: "Gas mulia", correct: "a", explain: "Ionik antara logam dan non-logam." },
    { q: "Hukum kekekalan massa oleh ...", a: "Avogadro", b: "Lavoisier", c: "Dalton", d: "Newton", correct: "b", explain: "Lavoisier menyatakan massa total tetap." },
    { q: "Konduktivitas tinggi umumnya pada ...", a: "Isolator", b: "Semikonduktor", c: "Logam", d: "Gas", correct: "c", explain: "Logam memiliki konduktivitas tinggi." },
    { q: "Reaksi asam-basa: penetralan menghasilkan ...", a: "Air & garam", b: "Asam kuat", c: "Gas", d: "Logam", correct: "a", explain: "Asam + basa → air + garam." }
  ]
};

/* ----------------------- DOM Refs ------------------------- */
const refs = {
  startBtn: document.getElementById('startBtn'),
  demoBtn: document.getElementById('demoBtn'),
  subjectSelect: document.getElementById('subject'),
  numSelect: document.getElementById('numQuestions'),
  toggleShuffle: document.getElementById('toggleShuffle'),
  selectSection: document.getElementById('select-section'),
  quizSection: document.getElementById('quiz-section'),
  resultSection: document.getElementById('result-section'),
  timerText: document.getElementById('timer-text'),
  timerFill: document.getElementById('timer-fill'),
  qIndex: document.getElementById('qIndex'),
  qTotal: document.getElementById('qTotal'),
  questionCard: document.getElementById('question-card'),
  qText: document.getElementById('qText'),
  answersForm: document.getElementById('answersForm'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  markBtn: document.getElementById('markBtn'),
  saveBtn: document.getElementById('saveBtn'),
  thumbs: document.getElementById('thumbs'),
  resultScore: document.getElementById('result-score'),
  resultTotal: document.getElementById('result-total'),
  resultPercent: document.getElementById('result-percent'),
  resultTime: document.getElementById('result-time'),
  explanations: document.getElementById('explanations'),
  retryBtn: document.getElementById('retryBtn'),
  exportBtn: document.getElementById('exportBtn'),
  btnReset: document.getElementById('btn-reset'),
  btnExportTop: document.getElementById('btn-export'),
  yearEl: document.getElementById('year')
};

/* ----------------------- App State ------------------------ */
let state = {
  subject: null,
  questions: [],       // array of question objects used in the session
  answers: [],         // user's answers (key or null)
  marked: [],          // boolean array marked for review
  currentIndex: 0,
  startedAt: null,
  remaining: 3600,     // seconds
  timerId: null,
  shuffled: true,
  numQuestions: 10
};

/* ----------------------- Utilities ------------------------ */
function uuid(len=6){ return Math.random().toString(36).substr(2,len) }
function nowStr(){ const d=new Date(); return d.toISOString() }
function formatTime(secs){
  const m = Math.floor(secs/60).toString().padStart(2,'0')
  const s = (secs%60).toString().padStart(2,'0')
  return `${m}:${s}`
}
function saveState(){
  localStorage.setItem('tpb_tryout_state', JSON.stringify(state))
}
function loadState(){
  try{
    const raw = localStorage.getItem('tpb_tryout_state')
    if(!raw) return false
    const s = JSON.parse(raw)
    Object.assign(state, s)
    return true
  }catch(e){return false}
}
function clearState(){
  localStorage.removeItem('tpb_tryout_state')
}

/* shuffle array in-place */
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1))
    [arr[i],arr[j]]=[arr[j],arr[i]]
  }
  return arr
}

/* clone & shuffle answers inside a question to randomize choices while keeping track of correct letter */
function buildQuestionWithShuffledChoices(q){
  // q: {q,a,b,c,d,correct,explain}
  const keys = ['a','b','c','d']
  const choices = keys.map(k=>({key:k,text:q[k]}))
  shuffle(choices)
  // find new key where original correct moved
  const newCorrectKey = choices.find(ch => ch.text === q[q.correct]).key
  // produce object with a,b,c,d new mapping and correct pointing to new key
  const res = {
    q: q.q,
    explain: q.explain
  }
  // map into a/b/c/d sequentially but keep key labels as 'a','b','c','d'
  choices.forEach((ch,i)=>{ res[keys[i]] = ch.text })
  // Determine which label (a/b/c/d) holds original correct text
  const origCorrectText = q[q.correct]
  const mappedKey = keys.find(k => res[k] === origCorrectText)
  res.correct = mappedKey
  return res
}

/* ----------------------- UI Helpers ----------------------- */
function showSection(id){
  document.querySelectorAll('section.panel').forEach(s=>s.classList.remove('active'))
  const el = document.getElementById(id)
  if(el) el.classList.add('active')
}

/* render thumbs */
function renderThumbs(){
  refs.thumbs.innerHTML = ''
  state.questions.forEach((q,i)=>{
    const btn = document.createElement('button')
    btn.className = 'thumb' + (state.answers[i] ? ' answered' : '') + (state.currentIndex===i ? ' current' : '') + (state.marked[i] ? ' marked' : '')
    btn.setAttribute('aria-label', `Soal ${i+1}${state.marked[i] ? ' ditandai' : ''}${state.answers[i] ? ' sudah dijawab' : ' belum dijawab'}`)
    btn.textContent = i+1
    btn.addEventListener('click', ()=>{ goTo(i) })
    refs.thumbs.appendChild(btn)
  })
}

/* render question */
function renderQuestion(){
  const idx = state.currentIndex
  const q = state.questions[idx]
  refs.qIndex.textContent = idx+1
  refs.qTotal.textContent = state.questions.length
  refs.qText.textContent = q.q
  // build answers
  refs.answersForm.innerHTML = ''
  const keys = ['a','b','c','d']
  keys.forEach(k=>{
    const id = `opt-${idx}-${k}`
    const label = document.createElement('label')
    label.htmlFor = id
    label.innerHTML = `<input type="radio" id="${id}" name="answer" value="${k}" ${state.answers[idx]===k ? 'checked' : ''}/> ${q[k]}`
    // keyboard accessibility: clicking label checks radio
    refs.answersForm.appendChild(label)
  })
  // update thumb states
  renderThumbs()
  // mark button state
  refs.markBtn.textContent = state.marked[idx] ? 'Batal Tandai' : 'Tandai'
}

/* move to given index */
function goTo(i){
  if(i<0) i=0
  if(i>=state.questions.length) i=state.questions.length-1
  state.currentIndex = i
  renderQuestion()
  saveState()
}

/* next/prev */
function next(){
  // save current selection
  saveCurrentAnswer()
  if(state.currentIndex < state.questions.length - 1){
    state.currentIndex++
    renderQuestion()
  } else {
    // finish
    finish()
  }
  saveState()
}
function prev(){
  saveCurrentAnswer()
  if(state.currentIndex>0){ state.currentIndex--; renderQuestion() }
  saveState()
}

/* save current selected answer */
function saveCurrentAnswer(){
  const sel = refs.answersForm.querySelector('input[name="answer"]:checked')
  const idx = state.currentIndex
  state.answers[idx] = sel ? sel.value : null
  renderThumbs()
}

/* mark for review toggle */
function toggleMark(){
  state.marked[state.currentIndex] = !state.marked[state.currentIndex]
  renderThumbs()
  refs.markBtn.textContent = state.marked[state.currentIndex] ? 'Batal Tandai' : 'Tandai'
  saveState()
}

/* start timer */
function startTimer(){
  // clear any existing
  if(state.timerId) clearInterval(state.timerId)
  state.startedAt = state.startedAt || Date.now()
  state.timerId = setInterval(()=>{
    state.remaining--
    if(state.remaining<=0){
      state.remaining = 0
      clearInterval(state.timerId)
      onTimeUp()
    }
    updateTimerUI()
    saveState()
  },1000)
  updateTimerUI()
}

/* update timer UI and fill */
function updateTimerUI(){
  refs.timerText.textContent = formatTime(state.remaining)
  const pct = (state.remaining / (60*60)) * 100
  refs.timerFill.style.width = pct + '%'
  // color gradient
  refs.timerFill.style.background = pct < 20 ? '#f44336' : (pct < 50 ? '#ff9800' : '#43a047')
}

/* time up handler: auto finish */
function onTimeUp(){
  alert('Waktu habis — Try Out disubmit otomatis.')
  finish()
}

/* finish and compute results */
function finish(){
  // ensure current saved
  saveCurrentAnswer()
  // compute score
  let correctCount = 0
  state.questions.forEach((q,i)=>{
    if(state.answers[i] && state.answers[i] === q.correct) correctCount++
  })
  // show result
  showSection('result-section')
  refs.resultScore.textContent = correctCount
  refs.resultTotal.textContent = state.questions.length
  refs.resultPercent.textContent = Math.round((correctCount/state.questions.length)*100) + '%'
  const usedSeconds = 3600 - state.remaining
  refs.resultTime.textContent = formatTime(usedSeconds)
  // build explanations
  refs.explanations.innerHTML = ''
  state.questions.forEach((q,i)=>{
    const user = state.answers[i] || '(Tidak dijawab)'
    const correctText = q[q.correct]
    const div = document.createElement('div')
    div.className = 'explain'
    div.innerHTML = `<p><strong>Soal ${i+1}:</strong> ${q.q}</p>
      <p><strong>Jawaban Anda:</strong> ${user !== '(Tidak dijawab)' ? q[user] : '(Tidak dijawab)'}</p>
      <p><strong>Jawaban Benar:</strong> ${correctText}</p>
      <p><em>${q.explain}</em></p><hr>`
    refs.explanations.appendChild(div)
  })
  // stop timer
  if(state.timerId) { clearInterval(state.timerId); state.timerId = null }
  saveState()
}

/* export CSV */
function exportCSV(){
  // Ensure finished results exist
  const rows = []
  rows.push(['No','Soal','Jawaban Anda','Jawaban Benar','Benar?','Pembahasan'])
  state.questions.forEach((q,i)=>{
    const userKey = state.answers[i]
    const userText = userKey ? q[userKey] : ''
    const correctText = q[q.correct]
    const ok = userKey && userKey === q.correct ? 'YA' : 'TIDAK'
    rows.push([i+1, q.q, userText, correctText, ok, q.explain])
  })
  // meta
  const meta = [['Try Out TPB Smart'], [`Mata Kuliah: ${state.subject}`], [`Waktu: ${new Date().toLocaleString()}`],[]]
  const csvContent = meta.map(r=>r.join(',')).join('\n') + '\n' + rows.map(r => r.map(cell => `"${(cell||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tryout_${state.subject}_${(new Date()).toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(url)
  a.remove()
}

/* demo: quick sample without timer (for preview) */
function runDemo(){
  // a tiny set
  state.subject = 'math'
  state.questions = QUIZ_BANK.math.slice(0,3).map(q => buildQuestionWithShuffledChoices(q))
  state.answers = new Array(state.questions.length).fill(null)
  state.marked = new Array(state.questions.length).fill(false)
  state.currentIndex = 0
  state.remaining = 300 // 5 minutes demo
  showSection('quiz-section')
  renderQuestion()
  startTimer()
}

/* initialize session */
function initSession(){
  // set year
  refs.yearEl.textContent = new Date().getFullYear()
  // attach handlers
  refs.startBtn.addEventListener('click', onStart)
  refs.demoBtn.addEventListener('click', runDemo)
  refs.nextBtn.addEventListener('click', next)
  refs.prevBtn.addEventListener('click', prev)
  refs.markBtn.addEventListener('click', toggleMark)
  refs.saveBtn.addEventListener('click', ()=>{ saveCurrentAnswer(); saveState(); alert('Jawaban disimpan.') })
  refs.retryBtn.addEventListener('click', ()=>{ clearState(); location.reload() })
  refs.exportBtn.addEventListener('click', exportCSV)
  refs.btnExportTop.addEventListener('click', exportCSV)
  refs.btnReset.addEventListener('click', ()=>{ if(confirm('Hapus progress dan reset aplikasi?')){ clearState(); location.reload() } })

  // if previously saved state, prompt to resume
  const resumed = loadState()
  if(resumed && state.questions && state.questions.length){
    if(confirm('Ada sesi Try Out sebelumnya. Lanjutkan?')){
      // go to quiz or resume where left
      showSection('quiz-section')
      renderQuestion()
      startTimer()
    } else {
      clearState()
    }
  } else {
    showSection('select-section')
  }
}

/* onStart: prepare questions and start timer */
function onStart(){
  const subj = refs.subjectSelect.value
  if(!subj) return alert('Pilih mata kuliah terlebih dahulu.')
  state.subject = subj
  state.numQuestions = parseInt(refs.numSelect.value,10) || 10
  state.shuffled = refs.toggleShuffle.checked

  // generate questions
  let pool = QUIZ_BANK[subj].slice() // clone
  if(pool.length < state.numQuestions){
    // if insufficient, cycle pool
    while(pool.length < state.numQuestions){
      pool = pool.concat(QUIZ_BANK[subj].slice())
    }
  }
  // pick first N after shuffling pool
  if(state.shuffled) shuffle(pool)
  const picked = pool.slice(0, state.numQuestions)
  // optionally shuffle choices inside each question
  state.questions = state.shuffled ? picked.map(q => buildQuestionWithShuffledChoices(q)) : picked.map(q => ({...q}))
  // init answers & marked
  state.answers = new Array(state.questions.length).fill(null)
  state.marked = new Array(state.questions.length).fill(false)
  state.currentIndex = 0
  // timer reset
  state.remaining = 60*60
  state.startedAt = Date.now()
  showSection('quiz-section')
  renderQuestion()
  startTimer()
  saveState()
}

/* ------------------ bootstrap ------------------ */
document.addEventListener('DOMContentLoaded', ()=>{
  // wire refs shorter
  refs.qIndex = document.getElementById('qIndex')
  refs.qTotal = document.getElementById('qTotal')
  refs.btnExportTop = document.getElementById('btn-export')
  initSession()
  // expose debug for console if needed
  window.TPB = { state, QUIZ_BANK, shuffle, saveState, loadState }
})
