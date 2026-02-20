export class GameLogic {
  puck = { x: 0, y: 0, w: 26, h: 26, vx: 0, vy: 0 };
  player = { x: 20, y: 0, w: 18, h: 80 };
  enemy = { x: 0, y: 0, w: 18, h: 80 };

  onGoal: (type: "win" | "lose") => void;
  onHit: () => void;
  onWallHit: () => void;
  width: number;
  height: number;
  isPortrait: boolean;

  reflectCount = 0;
  maxReflectCount = 0;

  isGameOver = false;

  enemySpeed: number;
  speedMultiplier: number;

  constructor(
    width: number,
    height: number,
    enemySpeed: number,
    speedMultiplier: number,
    isPortrait: boolean,
    onGoal: (type: "win" | "lose") => void,
    onHit: () => void,
    onWallHit: () => void,
  ) {
    this.width = width;
    this.height = height;
    this.isPortrait = isPortrait;
    this.onGoal = onGoal;
    this.onHit = onHit;
    this.onWallHit = onWallHit;

    const scale = this.height / 450;

    this.enemySpeed = enemySpeed * scale;
    this.speedMultiplier = speedMultiplier * scale;

    this.player.h *= scale;
    this.enemy.h *= scale;
    this.puck.w *= scale;
    this.puck.h *= scale;

    this.resetRound(true);
  }

  resetRound(initial = false) {
    const baseSpeed = 5 * this.speedMultiplier;

    this.isGameOver = false;

    this.puck.x = this.width / 2 - this.puck.w / 2;
    this.puck.y = this.height / 2 - this.puck.h / 2;

    if (this.isPortrait) {
      if (this.player.h > this.player.w) {
        [this.player.w, this.player.h] = [this.player.h, this.player.w];
        [this.enemy.w, this.enemy.h] = [this.enemy.h, this.enemy.w];
      }

      const angle = Math.random() * (Math.PI / 3) - Math.PI / 6;

      // 横方向はかなり弱くする（ほぼ真上）
      this.puck.vx = Math.cos(angle) * baseSpeed * 0.3;

      // 上方向はしっかり
      this.puck.vy = -Math.abs(Math.sin(angle) * baseSpeed * 1.2);

      const playerBottomOffset = this.height * 0.01;
      const enemyTopOffset = this.height * 0.01;

      this.player.x = this.width / 2 - this.player.w / 2;
      this.player.y = this.height - this.player.h - playerBottomOffset;

      this.enemy.x = this.width / 2 - this.enemy.w / 2;
      this.enemy.y = enemyTopOffset;
    }
  }

  collide(a: any, b: any): boolean {
    return !(
      a.x + a.w < b.x ||
      a.x > b.x + b.w ||
      a.y + a.h < b.y ||
      a.y > b.y + b.h
    );
  }

  update(): "reset" | undefined {
    if (this.isGameOver) return;

    const MAX_SPEED = 12; // ★ 少し下げて安定性UP
    const sideOffset = this.width * 0.01;
    const bottomOffset = this.height * 0.01;

    this.puck.x += this.puck.vx;
    this.puck.y += this.puck.vy;

    // 壁反射
    if (this.isPortrait) {
      const leftLimit = sideOffset;
      const rightLimit = this.width - this.puck.w - sideOffset;

      if (this.puck.x <= leftLimit) {
        this.puck.x = leftLimit;
        this.puck.vx *= -1;
        this.onWallHit();
      }
      if (this.puck.x >= rightLimit) {
        this.puck.x = rightLimit;
        this.puck.vx *= -1;
        this.onWallHit();
      }
    }

    // ゴール判定
    const goalZoneVertical = this.height * 0.01;

    if (this.isPortrait) {
      if (
        this.puck.y <= goalZoneVertical ||
        this.puck.y + this.puck.h >= this.height - goalZoneVertical
      ) {
        this.isGameOver = true;
        this.puck.vx = 0;
        this.puck.vy = 0;

        // ★ 反射回数で勝敗
        if (this.reflectCount >= 100) {
          this.onGoal("win");
        } else {
          this.onGoal("lose");
        }

        return "reset";
      }
    }

    // ★ 反射回数に応じた安定した加速
    const speedBoost = 1 + Math.min(this.reflectCount * 0.005, 0.5);

    // プレイヤー衝突
    if (this.collide(this.puck, this.player)) {
      this.onHit();
      this.reflectCount++;
      this.maxReflectCount = Math.max(this.maxReflectCount, this.reflectCount);

      const offset =
        this.puck.x + this.puck.w / 2 - (this.player.x + this.player.w / 2);

      const baseVX = offset * 0.05;
      this.puck.vx = Math.max(-MAX_SPEED, Math.min(baseVX, MAX_SPEED));

      const baseVY = Math.abs(this.puck.vy);
      this.puck.vy = -Math.min(baseVY * speedBoost, MAX_SPEED);
    }

    // 敵衝突
    if (this.collide(this.puck, this.enemy)) {
      this.onHit();
      this.reflectCount++;
      this.maxReflectCount = Math.max(this.maxReflectCount, this.reflectCount);

      const offset =
        this.puck.x + this.puck.w / 2 - (this.enemy.x + this.enemy.w / 2);

      const angleRandom = (Math.random() - 0.5) * 0.4; // ★ 安定性UP
      const baseVX = offset * 0.05 + angleRandom;

      this.puck.vx = Math.max(-MAX_SPEED, Math.min(baseVX, MAX_SPEED));

      const baseVY = Math.abs(this.puck.vy);
      this.puck.vy = Math.min(baseVY * speedBoost, MAX_SPEED);
    }

    // AI
    const puckCenter = this.puck.x + this.puck.w / 2;
    this.enemy.x = puckCenter - this.enemy.w / 2;

    // 壁制限
    const leftLimit = sideOffset;
    this.player.x = Math.max(
      leftLimit,
      Math.min(this.player.x, this.width - this.player.w - sideOffset),
    );
    this.enemy.x = Math.max(
      leftLimit,
      Math.min(this.enemy.x, this.width - this.enemy.w - sideOffset),
    );
  }

  movePlayer(pos: number) {
    this.player.x = pos - this.player.w / 2;
  }
}
