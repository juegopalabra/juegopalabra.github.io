// ---------------- DATOS ----------------
const WORDS = [
    "python", "algoritmo", "hilo", "variable", "funcion",
    "bucle", "clase", "objeto", "lista", "diccionario"
];

const BASE_TIME = 7;
const MAX_LIVES = 3;

// ---------------- ESTADO ----------------
let playerName = "";
let word = "";
let score = 0;
let lives = MAX_LIVES;
let timeLimit = BASE_TIME;
let startTime = 0;
let timerInterval = null;

// ---------------- UTILIDADES ----------------
function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function showMenu() {
    clearInterval(timerInterval);
    showScreen("menu");
}

function showName() {
    showScreen("nameScreen");
}

function showScores() {
    const list = document.getElementById("scoresList");
    list.innerHTML = "";

    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.forEach(s => {
        const li = document.createElement("li");
        li.textContent = `${s.name} — ${s.points} puntos`;
        list.appendChild(li);
    });

    showScreen("scoresScreen");
}

// ---------------- JUEGO ----------------
function startGame() {
    playerName = document.getElementById("playerName").value.trim();
    if (!playerName) return;

    score = 0;
    lives = MAX_LIVES;
    nextRound();
    showScreen("game");
}

function nextRound() {
    if (lives <= 0) {
        endGame();
        return;
    }

    word = WORDS[Math.floor(Math.random() * WORDS.length)];
    document.getElementById("word").textContent = word;
    document.getElementById("inputWord").value = "";
    document.getElementById("message").textContent = "";

    timeLimit = BASE_TIME * Math.pow(0.95, score);
    startTime = Date.now();

    updateHUD();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 50);
}

function updateHUD() {
    document.getElementById("score").textContent = `Puntos: ${score}`;
    document.getElementById("lives").textContent = `Vidas: ${lives}`;
}

function updateTimer() {
    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = timeLimit - elapsed;

    document.getElementById("timer").textContent =
        `Tiempo: ${remaining.toFixed(2)}s`;

    if (remaining <= 0) {
        clearInterval(timerInterval);
        lives--;
        nextRound();
    }
}

document.getElementById("inputWord").addEventListener("keydown", e => {
    if (e.key === "Enter") {
        clearInterval(timerInterval);
        const input = e.target.value.trim();

        if (input === word) {
            score++;
            document.getElementById("message").textContent = "Correcto";
        } else {
            lives--;
            document.getElementById("message").textContent = "Incorrecto";
        }

        setTimeout(nextRound, 800);
    }
});

// ---------------- FIN ----------------
const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbx7R2gQjymm-9arKpHJqeX525m00KmDpAS_hm869oc_pwgvHWE01ViHSb1yRNnvHSGW/exec";

// --- FIN DEL JUEGO: ENVIAR DATOS ---
let enviando = false; // Variable de control
function endGame() {
    if (enviando) return; // Si ya se está enviando, ignoramos el clic
    enviando = true;
    // 1. Crear un formulario oculto
    const form = document.createElement("form");
    form.method = "POST";
    form.action = URL_SCRIPT;
    form.target = "hidden_iframe"; // Esto evita que la página se recargue

    // 2. Añadir los datos como campos de texto
    const nameInput = document.createElement("input");
    nameInput.name = "name";
    nameInput.value = playerName;
    form.appendChild(nameInput);

    const pointsInput = document.createElement("input");
    pointsInput.name = "points";
    pointsInput.value = score;
    form.appendChild(pointsInput);

    // 3. Crear un iframe invisible para que no se vea el envío
    let iframe = document.getElementById("hidden_iframe");
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "hidden_iframe";
        iframe.name = "hidden_iframe";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
    }

    // 4. Enviar y avisar
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    // Bloqueamos el envío por 3 segundos para evitar spam de clics
    setTimeout(() => {
        enviando = false;
    }, 3000); 
    alert(`¡Partida guardada!\nJugador: ${playerName}\nPuntos: ${score}`);
    showMenu();
}

// --- VER PUNTUACIONES: LEER DEL EXCEL ---
// REEMPLAZA TU FUNCIÓN showScores POR ESTA
function showScores() {
    const list = document.getElementById("scoresList");
    list.innerHTML = "<li>Cargando ranking...</li>";
    showScreen("scoresScreen");

    // 1. Creamos la función que recibirá los datos desde Google
    window.renderScores = function(data) {
        list.innerHTML = "";
        if (!data || data.length === 0) {
            list.innerHTML = "<li>No hay puntuaciones aún.</li>";
        } else {
            data.forEach((s, i) => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>#${i + 1}</strong> ${s.name} — ${s.points} pts`;
                list.appendChild(li);
            });
        }
        // Limpieza: borramos el script para que no se acumulen en el HTML
        document.getElementById('google-loader')?.remove();
    };

    // 2. Creamos un elemento <script>. Esto se salta el CORS por completo.
    const script = document.createElement('script');
    script.id = 'google-loader';
    // Llamamos a la URL pasando el nombre de nuestra función en el callback
    script.src = `${URL_SCRIPT}?callback=renderScores&t=${Date.now()}`;
    
    script.onerror = () => {
        list.innerHTML = "<li>Error al conectar con el servidor de Google</li>";
    };

    document.body.appendChild(script);
}