import { UserInterface } from './UserInterface';

export class GameUI extends UserInterface {
  private gameScreen: HTMLElement;

  constructor() {
    super('game-gui');
    this.bindMethods();
    this.gameScreen = document.getElementById('game-screen');
    window.addEventListener('resize', this.onWindowResize);
  }

  public setGameCanvas(canvas: HTMLCanvasElement): void {
    this.gameScreen.appendChild(canvas);
    this.onWindowResize(null);
  }

  private onWindowResize(event: UIEvent): void {
    this.dispatchEvent(new MessageEvent('resize', {
      data: {
        width: this.gameScreen.clientWidth,
        height: this.gameScreen.clientHeight
      }
    }));
  }

  protected createHTMLString(): string {
    return `
    <div class="game-top-ui">
      <div id="game-screen">
      </div>
      <div id="game-panels">
      </div>
    </div>
    <div class="game-bottom-ui">
      <div id="game-text">
        <ul>
          <li>Scifi Dungeon Crawler</li>
          <li>Loading world...</li>
        </ul>
      </div>
      <div id="game-controls">
        <button id="skill-1">Skill 1</button>
        <button id="skill-2">Skill 2</button>
        <button id="skill-3">Skill 3</button>
        <button id="turn-left">Turn Left</button>
        <button id="move-forward">Mode Forward</button>
        <button id="turn-right">Turn Right</button>
        <button id="move-left">Mode Left</button>
        <button id="move-back">Mode Back</button>
        <button id="move-right">Mode Right</button>
      </div>
    </div>
    `;
  }

  private bindMethods(): void {
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  public destructor(): void {
    window.removeEventListener('resize', this.onWindowResize);
    this.gameScreen.removeChild(this.gameScreen.firstChild);
    this.gameScreen = null;
    super.destructor();
  }
}
