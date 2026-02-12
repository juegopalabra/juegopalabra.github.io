// ---------------- DATOS ----------------
const WORDS = [
    "mesa", "silla", "lampara", "ventana", "puerta", "cocina", "espejo", "cuadro",
    "nevera", "tenedor", "cuchara", "sarten", "almohada", "sabana", "cepillo", "jabon",
    "toalla", "percha", "armario", "alfombra", "cortina", "plato", "vaso", "botella",
    "reloj", "llave", "cartera", "mochila", "boligrafo", "libreta", "periodico", "revista",
    "manzana", "platano", "cereza", "pan", "queso", "chocolate", "arroz", "pasta",
    "hamburguesa", "pizza", "ensalada", "tomate", "patata", "cebolla", "huevo", "leche",
    "cafe", "zumo", "galleta", "pastel", "helado", "carne", "pescado", "pollo",
    "lentejas", "garbanzos", "aceite", "vinagre", "sal", "azucar", "miel", "canela",
    "perro", "gato", "caballo", "vaca", "oveja", "cerdo", "conejo", "raton",
    "leon", "tigre", "elefante", "jirafa", "cebra", "mono", "oso", "lobo",
    "aguila", "paloma", "loro", "pinguino", "delfin", "ballena", "tiburon", "pulpo",
    "tortuga", "serpiente", "rana", "abeja", "hormiga", "mariposa", "araña", "caracol",
    "montaña", "rio", "valle", "bosque", "selva", "desierto", "oceano", "playa",
    "isla", "volcan", "cueva", "cascada", "campo", "jardin", "parque", "sendero",
    "arbol", "flor", "hierba", "piedra", "arena", "tierra", "nube", "lluvia",
    "nieve", "viento", "trueno", "relampago", "estrella", "planeta", "galaxia", "universo",
    "cabeza", "brazo", "pierna", "mano", "dedo", "hombro", "espalda", "pecho",
    "corazon", "pulmon", "estomago", "cerebro", "sangre", "hueso", "musculo", "piel",
    "ojo", "oreja", "nariz", "boca", "diente", "lengua", "cuello", "rodilla",
    "medico", "enfermera", "hospital", "farmacia", "vacuna", "jarabe", "pastilla", "venda",
    "camiseta", "pantalon", "chaqueta", "abrigo", "vestido", "falda", "jersey", "camisa",
    "zapato", "bota", "sandalia", "calcetin", "guante", "gorro", "bufanda", "cinturon",
    "gafas", "anillo", "pulsera", "collar", "pendiente", "paraguas", "bolso", "maleta",
    "maestro", "policia", "bombero", "cocinero", "pintor", "musico", "actor", "escritor",
    "panadero", "barbero", "dentista", "juez", "abogado", "arquitecto", "ingeniero", "piloto",
    "calle", "avenida", "plaza", "edificio", "puente", "estacion", "aeropuerto", "museo",
    "cine", "teatro", "biblioteca", "colegio", "universidad", "tienda", "mercado", "banco",
    "coche", "camion", "autobus", "moto", "bicicleta", "tren", "metro", "tranvia",
    "barco", "avion", "helicoptero", "cohete", "submarino", "canoa", "patinete", "grua",
    "correr", "saltar", "caminar", "dormir", "comer", "beber", "cantar", "bailar",
    "reir", "llorar", "hablar", "escuchar", "mirar", "leer", "escribir", "dibujar",
    "nadar", "volar", "pensar", "soñar", "jugar", "trabajar", "estudiar", "viajar",
    "comprar", "vender", "limpiar", "cocinar", "abrir", "cerrar", "subir", "bajar",
    "felicidad", "amistad", "amor", "valentia", "esperanza", "paz", "justicia", "libertad",
    "rapido", "lento", "grande", "pequeño", "fuerte", "debil", "alto", "bajo",
    "nuevo", "viejo", "bueno", "malo", "facil", "dificil", "caliente", "frio",
    "limpio", "sucio", "brillante", "oscuro", "pesado", "ligero", "dulce", "amargo",
    "aventura", "misterio", "leyenda", "magia", "tesoro", "pirata", "castillo", "palacio",
    "escudo", "espada", "corona", "bandera", "moneda", "billete", "regalo", "fiesta",
    "musica", "guitarra", "piano", "tambor", "trompeta", "colores", "pintura", "pincel",
    "pelota", "raqueta", "ajedrez", "dados", "naipe", "rompecabezas", "juguete", "peluche"
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
let isPaused = false;

// ---------------- UTILIDADES ----------------
function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function showMenu() {
    clearInterval(timerInterval);
    isPaused = false;
    showScreen("menu");
}

function showName() {
    showScreen("nameScreen");
}

// ---------------- JUEGO ----------------
function startGame() {
    playerName = document.getElementById("playerName").value.trim();
    if (!playerName) return;

    score = 0;
    lives = MAX_LIVES;
    isPaused = false;
    nextRound();
    showScreen("game");
}

function nextRound() {
    if (lives <= 0) {
        endGame();
        return;
    }

    isPaused = false;
    word = WORDS[Math.floor(Math.random() * WORDS.length)];
    document.getElementById("word").textContent = word;
    document.getElementById("inputWord").value = "";
    document.getElementById("message").textContent = "";
    document.getElementById("inputWord").focus();

    // Dificultad progresiva
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
    if (isPaused) return;

    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = Math.max(0, timeLimit - elapsed);
    const percentage = (remaining / timeLimit) * 100;

    const bar = document.getElementById("progressBar");
    if (bar) {
        bar.style.width = percentage + "%";
        // Cambio de color gradual
        if (percentage > 60) bar.style.backgroundColor = "#4caf50";
        else if (percentage > 30) bar.style.backgroundColor = "#ffeb3b";
        else if (percentage > 15) bar.style.backgroundColor = "#ff9800";
        else bar.style.backgroundColor = "#f44336";
    }

    document.getElementById("timer").textContent = `Tiempo: ${remaining.toFixed(2)}s`;

    if (remaining <= 0) {
        handleFailure("❌ ¡Tiempo agotado!");
    }
}

function handleFailure(msg) {
    if (isPaused) return;
    isPaused = true;
    clearInterval(timerInterval);
    
    lives--;
    updateHUD();

    const messageEl = document.getElementById("message");
    messageEl.textContent = msg;
    messageEl.style.color = "#f44336";
    
    const bar = document.getElementById("progressBar");
    if (bar) bar.style.backgroundColor = "#f44336";

    if (lives <= 0) {
        setTimeout(endGame, 1000);
    } else {
        setTimeout(nextRound, 1200);
    }
}

// Único evento de teclado corregido
document.getElementById("inputWord").addEventListener("keydown", e => {
    if (e.key === "Enter" && !isPaused) {
        const input = e.target.value.trim().toLowerCase();

        if (input === word.toLowerCase()) {
            score++;
            document.getElementById("message").textContent = "✅ ¡Bien!";
            document.getElementById("message").style.color = "#4caf50";
            clearInterval(timerInterval);
            isPaused = true; // Pausa para feedback
            setTimeout(nextRound, 400);
        } else {
            handleFailure("❌ Incorrecto");
        }
    }
});

// ---------------- CONEXIÓN GOOGLE SHEETS ----------------
const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbx7R2gQjymm-9arKpHJqeX525m00KmDpAS_hm869oc_pwgvHWE01ViHSb1yRNnvHSGW/exec";
let enviando = false;

function endGame() {
    clearInterval(timerInterval);
    if (enviando) return;
    enviando = true;

    const form = document.createElement("form");
    form.method = "POST";
    form.action = URL_SCRIPT;
    form.target = "hidden_iframe";

    const nameInput = document.createElement("input");
    nameInput.name = "name";
    nameInput.value = playerName;
    form.appendChild(nameInput);

    const pointsInput = document.createElement("input");
    pointsInput.name = "points";
    pointsInput.value = score;
    form.appendChild(pointsInput);

    let iframe = document.getElementById("hidden_iframe");
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "hidden_iframe";
        iframe.name = "hidden_iframe";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    setTimeout(() => { enviando = false; }, 3000); 
    alert(`¡Fin del juego!\nJugador: ${playerName}\nPuntos: ${score}`);
    showMenu();
}

function showScores() {
    const list = document.getElementById("scoresList");
    list.innerHTML = "<li>Cargando ranking...</li>";
    showScreen("scoresScreen");

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
        document.getElementById('google-loader')?.remove();
    };

    const script = document.createElement('script');
    script.id = 'google-loader';
    script.src = `${URL_SCRIPT}?callback=renderScores&t=${Date.now()}`;
    script.onerror = () => {
        list.innerHTML = "<li>Error al conectar con el servidor</li>";
    };
    document.body.appendChild(script);
}
