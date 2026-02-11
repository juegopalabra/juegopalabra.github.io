// ---------------- DATOS ----------------
const WORDS = [
    // --- Cotidianas y Hogar ---
    "mesa", "silla", "lampara", "ventana", "puerta", "cocina", "espejo", "cuadro",
    "nevera", "tenedor", "cuchara", "sarten", "almohada", "sabana", "cepillo", "jabon",
    "toalla", "percha", "armario", "alfombra", "cortina", "plato", "vaso", "botella",
    "reloj", "llave", "cartera", "mochila", "boligrafo", "libreta", "periodico", "revista",

    // --- Comida y Bebida ---
    "manzana", "platano", "cereza", "pan", "queso", "chocolate", "arroz", "pasta",
    "hamburguesa", "pizza", "ensalada", "tomate", "patata", "cebolla", "huevo", "leche",
    "cafe", "zumo", "galleta", "pastel", "helado", "carne", "pescado", "pollo",
    "lentejas", "garbanzos", "aceite", "vinagre", "sal", "azucar", "miel", "canela",

    // --- Animales ---
    "perro", "gato", "caballo", "vaca", "oveja", "cerdo", "conejo", "raton",
    "leon", "tigre", "elefante", "jirafa", "cebra", "mono", "oso", "lobo",
    "aguila", "paloma", "loro", "pinguino", "delfin", "ballena", "tiburon", "pulpo",
    "tortuga", "serpiente", "rana", "abeja", "hormiga", "mariposa", "araña", "caracol",

    // --- Naturaleza y Geografía ---
    "montaña", "rio", "valle", "bosque", "selva", "desierto", "oceano", "playa",
    "isla", "volcan", "cueva", "cascada", "campo", "jardin", "parque", "sendero",
    "arbol", "flor", "hierba", "piedra", "arena", "tierra", "nube", "lluvia",
    "nieve", "viento", "trueno", "relampago", "estrella", "planeta", "galaxia", "universo",

    // --- Cuerpo Humano y Salud ---
    "cabeza", "brazo", "pierna", "mano", "dedo", "hombro", "espalda", "pecho",
    "corazon", "pulmon", "estomago", "cerebro", "sangre", "hueso", "musculo", "piel",
    "ojo", "oreja", "nariz", "boca", "diente", "lengua", "cuello", "rodilla",
    "medico", "enfermera", "hospital", "farmacia", "vacuna", "jarabe", "pastilla", "venda",

    // --- Ropa y Accesorios ---
    "camiseta", "pantalon", "chaqueta", "abrigo", "vestido", "falda", "jersey", "camisa",
    "zapato", "bota", "sandalia", "calcetin", "guante", "gorro", "bufanda", "cinturon",
    "gafas", "anillo", "pulsera", "collar", "pendiente", "paraguas", "bolso", "maleta",

    // --- Profesiones y Ciudad ---
    "maestro", "policia", "bombero", "cocinero", "pintor", "musico", "actor", "escritor",
    "panadero", "barbero", "dentista", "juez", "abogado", "arquitecto", "ingeniero", "piloto",
    "calle", "avenida", "plaza", "edificio", "puente", "estacion", "aeropuerto", "museo",
    "cine", "teatro", "biblioteca", "colegio", "universidad", "tienda", "mercado", "banco",

    // --- Transportes ---
    "coche", "camion", "autobus", "moto", "bicicleta", "tren", "metro", "tranvia",
    "barco", "avion", "helicoptero", "cohete", "submarino", "canoa", "patinete", "grua",

    // --- Verbos y Acciones ---
    "correr", "saltar", "caminar", "dormir", "comer", "beber", "cantar", "bailar",
    "reir", "llorar", "hablar", "escuchar", "mirar", "leer", "escribir", "dibujar",
    "nadar", "volar", "pensar", "soñar", "jugar", "trabajar", "estudiar", "viajar",
    "comprar", "vender", "limpiar", "cocinar", "abrir", "cerrar", "subir", "bajar",

    // --- Conceptos y Adjetivos ---
    "felicidad", "amistad", "amor", "valentia", "esperanza", "paz", "justicia", "libertad",
    "rapido", "lento", "grande", "pequeño", "fuerte", "debil", "alto", "bajo",
    "nuevo", "viejo", "bueno", "malo", "facil", "dificil", "caliente", "frio",
    "limpio", "sucio", "brillante", "oscuro", "pesado", "ligero", "dulce", "amargo",

    // --- Palabras Variadas ---
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
