import { Clock } from 'three';
import { Connection } from '../Connection';
import { World } from '../World';
import { State } from './State';

export class GameState extends State {
  private gameScreen: HTMLElement;
  private clock: Clock;
  private world: World;
  private connection: Connection;
  private onConnectClose: () => void;
  private onConnectError: () => void;

  public constructor(connection: Connection,
                     onConnectClose: () => void,
                     onConnectError: () => void) {
    super('game-gui');
    this.gameScreen = document.getElementById('game-screen');
    this.clock = new Clock();
    this.world = new World();
    this.connection = connection;
    this.onConnectClose = onConnectClose;
    this.onConnectError = onConnectError;

    this.connection.addEventListener('message', this.onMessage);
    this.connection.addEventListener('error', this.onConnectError);
    this.connection.addEventListener('close', this.onConnectClose);
    window.addEventListener('resize', this.onWindowResize);
  }

  public start(): void {
    this.gameScreen.appendChild(this.world.getCanvas());
    this.onWindowResize();
    requestAnimationFrame(this.update);
  }

  private update(): void {
    requestAnimationFrame(this.update);
    this.world.update();
  }

  private onMessage(event: MessageEvent): void {
    const data = event.data;
    console.log(event.data);
    if (data.type) {

    }
  }

  private onWindowResize(): void {
    this.world.resizeRenderer(
      this.gameScreen.clientWidth,
      this.gameScreen.clientHeight
    );
  }

  protected bindMethods(): void {
    this.update = this.update.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
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

  public destructor(): void {
    this.connection.removeEventListener('message', this.onMessage);
    this.connection.removeEventListener('error', this.onConnectError);
    this.connection.removeEventListener('close', this.onConnectClose);
    window.removeEventListener('resize', this.onWindowResize);

    this.gameScreen.removeChild(this.gameScreen.firstChild);
    this.gameScreen = null;

    this.clock = null;
    this.connection = null;
    this.onConnectClose = null;
    super.destructor();
  }
}