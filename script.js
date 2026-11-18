const mario = document.getElementById('mario');
const obstacle = document.getElementById('obstacle');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let isGameOver = false;
let isJumping = false;

// --- НАСТРОЙКИ ПРЕПЯТСТВИЙ ---
// Массив с разными вариантами препятствий
const obstacleTypes = [
    { width: 30, height: 40, color: '#4CAF50', name: 'Маленькая труба' }, // Зеленая
    { width: 40, height: 70, color: '#FF9800', name: 'Высокий кактус' },   // Оранжевая
    { width: 60, height: 30, color: '#9C27B0', name: 'Широкий блок' },    // Фиолетовая
    { width: 25, height: 90, color: '#F44336', name: 'Очень высокая палка' } // Красная
];

let currentObstacleType = obstacleTypes[0];
let obstacleLeft = 800;
let obstacleSpeed = 6; // Базовая скорость

// Функция выбора случайного препятствия
function setRandomObstacle() {
    const randomIndex = Math.floor(Math.random() * obstacleTypes.length);
    currentObstacleType = obstacleTypes[randomIndex];
    
    // Применяем стили к элементу
    obstacle.style.width = currentObstacleType.width + 'px';
    obstacle.style.height = currentObstacleType.height + 'px';
    obstacle.style.backgroundColor = currentObstacleType.color;
}

// --- ПРЫЖОК ---
function jump() {
    if (isGameOver || isJumping) return; 
    isJumping = true;
    mario.classList.add('jump');
    setTimeout(() => {
        mario.classList.remove('jump');
        isJumping = false;
    }, 600); // Время должно совпадать с анимацией в CSS
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault();
        jump();
    }
});

// --- ИГРОВОЙ ЦИКЛ ---
function gameLoop() {
    if (isGameOver) return;

    // Движение препятствия
    obstacleLeft -= obstacleSpeed;
    obstacle.style.left = obstacleLeft + 'px';

    // Если препятствие ушло за экран
    if (obstacleLeft < -100) {
        obstacleLeft = 800; // Возвращаем вправо
        score++;
        scoreElement.textContent = 'Счет: ' + score;
        
        // Увеличиваем скорость со временем
        if (obstacleSpeed < 15) obstacleSpeed += 0.3; 
        
        // Выбираем новое препятствие
        setRandomObstacle();
    }

    // Проверка столкновений
    const marioBottom = parseInt(window.getComputedStyle(mario).getPropertyValue('bottom'));
    const obstacleHeight = currentObstacleType.height;
    const obstacleWidth = currentObstacleType.width;

    // Логика: если Марио на земле (bottom < 100) и препятствие рядом...
    // Учитываем ширину препятствия, чтобы столкновение было честным
    const isMarioOnGround = marioBottom < 120; 
    
    // Координаты Марио по X: от 50 до 90 (ширина 40)
    // Координаты препятствия по X: obstacleLeft до obstacleLeft + obstacleWidth
    const isCollidingX = obstacleLeft < 90 && (obstacleLeft + obstacleWidth) > 50;
    
    // Если Марио низко (не перепрыгнул) и по X они пересеклись
    if (isMarioOnGround && isCollidingX) {
        gameOver();
        return;
    }

    requestAnimationFrame(gameLoop);
}

// --- КОНЕЦ ИГРЫ ---
function gameOver() {
    isGameOver = true;
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
}

// --- ПЕРЕЗАПУСК ---
restartBtn.addEventListener('click', () => {
    score = 0;
    isGameOver = false;
    isJumping = false;
    obstacleSpeed = 6;
    obstacleLeft = 800;
    
    scoreElement.textContent = 'Счет: 0';
    gameOverElement.style.display = 'none';
    mario.classList.remove('jump');
    
    // Сбрасываем препятствие
    setRandomObstacle();
    obstacle.style.left = '800px';
    
    requestAnimationFrame(gameLoop);
});

// Инициализация при загрузке
setRandomObstacle();
requestAnimationFrame(gameLoop);
