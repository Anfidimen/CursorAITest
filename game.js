const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Efectos visuales retro
function efectoResplandor(ctx, x, y, radio, color) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radio * 1.5);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radio * 1.5, 0, Math.PI * 2);
    ctx.fill();
}

// Función para crear una bola con propiedades físicas mejoradas
function crearBola(x, y, color) {
    return {
        x: x,
        y: y,
        radio: 20,
        velocidadX: 0,
        velocidadY: 0,
        velocidad: 6,
        gravedad: 0.5,
        friccion: 0.99,
        elasticidad: 0.9,
        masa: 1,
        saltando: false,
        color: color,
        trail: [],
        maxTrailLength: 10
    };
}

// Crear tres bolas en diferentes posiciones
const bola1 = crearBola(canvas.width / 4, canvas.height / 2, '#00ff00');
const bola2 = crearBola(canvas.width / 2, canvas.height / 2, '#ff0000');
const bola3 = crearBola((canvas.width / 4) * 3, canvas.height / 2, '#0000ff');

const teclas = {
    a: false, d: false, w: false,
    izquierda: false, derecha: false, arriba: false,
    j: false, l: false, i: false
};

// Función mejorada para calcular la colisión entre dos bolas
function resolverColision(bola1, bola2) {
    const dx = bola2.x - bola1.x;
    const dy = bola2.y - bola1.y;
    const distancia = Math.sqrt(dx * dx + dy * dy);
    const distanciaMinima = bola1.radio + bola2.radio;

    if (distancia < distanciaMinima) {
        // Factor de rebote aumentado
        const factorRebote = 1.5; // Aumentamos esto para más rebote
        
        // Normalizar el vector de colisión
        const nx = dx / distancia;
        const ny = dy / distancia;

        // Velocidad relativa
        const vx = bola1.velocidadX - bola2.velocidadX;
        const vy = bola1.velocidadY - bola2.velocidadY;
        const velocidadRelativa = vx * nx + vy * ny;

        // Si las bolas se están alejando, no hacer nada
        if (velocidadRelativa > 0) return;

        // Coeficiente de restitución aumentado
        const restitution = Math.min(bola1.elasticidad, bola2.elasticidad) * factorRebote;

        // Impulso de la colisión
        const j = -(1 + restitution) * velocidadRelativa;
        const impulso = j / (1 / bola1.masa + 1 / bola2.masa);

        // Aplicar el impulso con más fuerza
        bola1.velocidadX -= (impulso * nx) / bola1.masa * factorRebote;
        bola1.velocidadY -= (impulso * ny) / bola1.masa * factorRebote;
        bola2.velocidadX += (impulso * nx) / bola2.masa * factorRebote;
        bola2.velocidadY += (impulso * ny) / bola2.masa * factorRebote;

        // Añadir velocidad extra en dirección opuesta
        const velocidadExtra = 5;
        bola1.velocidadX -= nx * velocidadExtra;
        bola1.velocidadY -= ny * velocidadExtra;
        bola2.velocidadX += nx * velocidadExtra;
        bola2.velocidadY += ny * velocidadExtra;

        // Prevenir superposición
        const porcentaje = 1.0; // Aumentado para separación más rápida
        const solapamiento = (distanciaMinima - distancia) * porcentaje;
        const correccionX = (solapamiento * nx);
        const correccionY = (solapamiento * ny);

        bola1.x -= correccionX / 2;
        bola1.y -= correccionY / 2;
        bola2.x += correccionX / 2;
        bola2.y += correccionY / 2;

        // Reducir la fricción en la colisión para mantener más movimiento
        const friccionColision = 0.98;
        bola1.velocidadX *= friccionColision;
        bola1.velocidadY *= friccionColision;
        bola2.velocidadX *= friccionColision;
        bola2.velocidadY *= friccionColision;
    }
}

function actualizarBola(bola, izquierda, derecha, arriba) {
    // Guardar posición anterior para la estela
    bola.trail.unshift({x: bola.x, y: bola.y});
    if (bola.trail.length > bola.maxTrailLength) {
        bola.trail.pop();
    }

    // Aplicar gravedad
    bola.velocidadY += bola.gravedad;
    
    // Aumentar la velocidad de salto para más diversión
    if (teclas[arriba] && !bola.saltando) {
        bola.velocidadY = -15;
        bola.saltando = true;
    }
    
    // Aumentar la velocidad horizontal para más dinamismo
    if (teclas[izquierda]) bola.velocidadX -= bola.velocidad * 1.2;
    if (teclas[derecha]) bola.velocidadX += bola.velocidad * 1.2;
    
    // Aplicar fricción
    bola.velocidadX *= bola.friccion;
    bola.velocidadY *= bola.friccion;
    
    // Actualizar posición
    bola.x += bola.velocidadX;
    bola.y += bola.velocidadY;
    
    // Colisiones con bordes
    if (bola.x + bola.radio > canvas.width) {
        bola.x = canvas.width - bola.radio;
        bola.velocidadX *= -bola.elasticidad;
    }
    if (bola.x - bola.radio < 0) {
        bola.x = bola.radio;
        bola.velocidadX *= -bola.elasticidad;
    }
    if (bola.y + bola.radio > canvas.height) {
        bola.y = canvas.height - bola.radio;
        bola.velocidadY *= -bola.elasticidad;
        bola.saltando = false;
    }
    if (bola.y - bola.radio < 0) {
        bola.y = bola.radio;
        bola.velocidadY *= -bola.elasticidad;
    }
}

function dibujarBola(bola) {
    // Dibujar estela
    for (let i = 0; i < bola.trail.length; i++) {
        const alpha = (1 - i / bola.trail.length) * 0.3;
        ctx.beginPath();
        ctx.arc(bola.trail[i].x, bola.trail[i].y, bola.radio * (1 - i / bola.trail.length), 0, Math.PI * 2);
        ctx.fillStyle = `${bola.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
    }

    // Dibujar resplandor
    efectoResplandor(ctx, bola.x, bola.y, bola.radio, bola.color + '40');

    // Dibujar bola
    ctx.beginPath();
    ctx.arc(bola.x, bola.y, bola.radio, 0, Math.PI * 2);
    ctx.fillStyle = bola.color;
    ctx.fill();
    
    // Efecto de brillo
    const gradient = ctx.createRadialGradient(
        bola.x - bola.radio/3, 
        bola.y - bola.radio/3, 
        bola.radio/10,
        bola.x,
        bola.y,
        bola.radio
    );
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fill();
}

function dibujar() {
    // Efecto CRT
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar líneas de escáner
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for(let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, canvas.width, 2);
    }
    
    // Dibujar las bolas
    dibujarBola(bola1);
    dibujarBola(bola2);
    dibujarBola(bola3);
}

function gameLoop() {
    // Actualizar las bolas
    actualizarBola(bola1, 'a', 'd', 'w');
    actualizarBola(bola2, 'izquierda', 'derecha', 'arriba');
    actualizarBola(bola3, 'j', 'l', 'i');
    
    // Comprobar colisiones entre todas las bolas
    resolverColision(bola1, bola2);
    resolverColision(bola2, bola3);
    resolverColision(bola1, bola3);
    
    dibujar();
    requestAnimationFrame(gameLoop);
}

// Eventos de teclado
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'a': teclas.a = true; break;
        case 'd': teclas.d = true; break;
        case 'w':
            if (!bola1.saltando) {
                bola1.velocidadY = -12;
                bola1.saltando = true;
            }
            break;
        case 'arrowleft': teclas.izquierda = true; break;
        case 'arrowright': teclas.derecha = true; break;
        case 'arrowup':
            if (!bola2.saltando) {
                bola2.velocidadY = -12;
                bola2.saltando = true;
            }
            break;
        case 'j': teclas.j = true; break;
        case 'l': teclas.l = true; break;
        case 'i':
            if (!bola3.saltando) {
                bola3.velocidadY = -12;
                bola3.saltando = true;
            }
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
        case 'a': teclas.a = false; break;
        case 'd': teclas.d = false; break;
        case 'arrowleft': teclas.izquierda = false; break;
        case 'arrowright': teclas.derecha = false; break;
        case 'j': teclas.j = false; break;
        case 'l': teclas.l = false; break;
    }
});

// Iniciar el juego
gameLoop(); 