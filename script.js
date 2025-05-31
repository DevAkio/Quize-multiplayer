let ably = new Ably.Realtime('mGqkmA.KJ1Vgw:lH83_2jysjcWLBdTRdT4_IztQo9kQ8Yz1ujhBq6aqLk');
let channel;
let roomId = '';
let currentQuestion = 0;
let score = 0;
let totalQuestions = 100;

const questions = Array.from({ length: totalQuestions }, (_, i) => ({
  question: `Pergunta ${i + 1}?`,
  options: ["A", "B", "C", "D"],
  correct: 0
}));

function createRoom() {
  roomId = Math.random().toString(36).substring(2, 7);
  initChannel(roomId);
  alert(`Sala criada: ${roomId}`);
}

function joinRoom() {
  roomId = document.getElementById("roomCode").value.trim();
  if (!roomId) return alert("Digite o código da sala");
  initChannel(roomId);
  channel.publish("ready", "join");
}

function initChannel(id) {
  channel = ably.channels.get("quiz-" + id);
  channel.subscribe("ready", () => {
    document.getElementById("lobby").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    loadQuestion();
  });
  channel.subscribe("answer", data => {
    // Lógica multiplayer (sincronização, pontuação etc)
  });
}

function loadQuestion() {
  if (currentQuestion >= totalQuestions) return endGame();

  const q = questions[currentQuestion];
  document.getElementById("questionBox").innerText = q.question;
  const optionsBox = document.getElementById("options");
  optionsBox.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => handleAnswer(i);
    optionsBox.appendChild(btn);
  });
}

function handleAnswer(index) {
  if (index === questions[currentQuestion].correct) score++;
  currentQuestion++;
  loadQuestion();
}

function endGame() {
  document.getElementById("game").classList.add("hidden");
  const resultBox = document.getElementById("result");
  resultBox.classList.remove("hidden");
  resultBox.innerText = `Fim de jogo! Pontuação: ${score}/${totalQuestions}`;
}
