const gameArea = document.getElementById('gameArea');
const character = document.getElementById('character');
const food = document.getElementById('food');

let isMoving = false;
let velocity = { x: 0, y: 0 };
let characterPosition = { x: gameArea.offsetWidth / 2, y: gameArea.offsetHeight - 50 };

// ゲームエリアの高さを取得し、速度を計算
const gameHeight = gameArea.offsetHeight;
const targetVelocityY = gameHeight / 3600; // 1時間で到達する速度 (px/秒)

function moveCharacter() {
    if (!isMoving) return;

    // キャラクターの位置を更新
    characterPosition.x += velocity.x;
    characterPosition.y += velocity.y;

    // キャラクターの位置を画面上に反映
    character.style.left = `${characterPosition.x}px`;
    character.style.top = `${characterPosition.y}px`;

    // キャラクターと食べ物の距離を計算
    const foodRect = food.getBoundingClientRect();
    const characterRect = character.getBoundingClientRect();
    const distanceX = foodRect.left + foodRect.width / 2 - (characterRect.left + characterRect.width / 2);
    const distanceY = foodRect.top + foodRect.height / 2 - (characterRect.top + characterRect.height / 2);
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // 食べ物が一定距離内に近づいた場合に左に移動
    if (distance < 70) {
        const moveDistance = 3; // 左に移動する距離
        const newFoodX = food.offsetLeft - moveDistance;

        // 食べ物の新しい位置を設定（画面外への移動も許可）
        food.style.left = `${newFoodX}px`;
    }

    // 画面外に出たらリセット
    if (
        characterPosition.x < 0 ||
        characterPosition.x > gameArea.offsetWidth ||
        characterPosition.y < 0 ||
        characterPosition.y > gameArea.offsetHeight
    ) {
        resetCharacter();
        return;
    }

    // 次のフレームで再度移動
    requestAnimationFrame(moveCharacter);
}

function resetCharacter() {
    isMoving = false;
    characterPosition = { x: gameArea.offsetWidth / 2, y: gameArea.offsetHeight - 50 };
    character.style.left = `${characterPosition.x}px`;
    character.style.top = `${characterPosition.y}px`;
}

function launchCharacter(event) {
    if (isMoving) return;

    // タップ位置から速度を計算
    const rect = gameArea.getBoundingClientRect();
    const targetX = event.clientX - rect.left;
    const targetY = event.clientY - rect.top;

    const dx = targetX - characterPosition.x;
    const dy = targetY - characterPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 一定速度に基づく方向ベクトルを計算
    velocity.x = (dx / distance) * targetVelocityY;
    velocity.y = (dy / distance) * targetVelocityY;

    isMoving = true;
    moveCharacter();
}

// ゲームエリアをクリックしたらキャラクターを発射
gameArea.addEventListener('click', launchCharacter);