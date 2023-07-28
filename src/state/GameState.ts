import { Clock, Vector2, Vector3 } from 'three';
import { Connection } from '../Connection';
import { ClientAction, Entity } from '../Interfaces';
import { World } from '../World';
import { State } from './State';

export class GameState extends State {
  private gameScreen: HTMLElement;
  private logoutButton: HTMLElement;
  private moveForwardButton: HTMLElement;
  private moveBackButton: HTMLElement;
  private moveLeftButton: HTMLElement;
  private moveRightButton: HTMLElement;
  private turnLeftButton: HTMLElement;
  private turnRightButton: HTMLElement;

  private clock: Clock;
  private world: World;
  private playerEntity: Entity;
  private connection: Connection;
  private onConnectClose: () => void;
  private onConnectError: () => void;
  private frameHandle: number;

  public constructor(connection: Connection,
                     onConnectClose: () => void,
                     onConnectError: () => void) {
    super('game-state');
    this.gameScreen = document.getElementById('game-screen');
    this.logoutButton = document.getElementById('logout');
    this.moveForwardButton = document.getElementById('move-forward');
    this.moveBackButton = document.getElementById('move-back');
    this.moveLeftButton = document.getElementById('move-left');
    this.moveRightButton = document.getElementById('move-right');
    this.turnLeftButton = document.getElementById('turn-left');
    this.turnRightButton = document.getElementById('turn-right');

    this.clock = new Clock();
    this.playerEntity = null;
    this.world = new World();
    this.connection = connection;
    this.onConnectClose = onConnectClose;
    this.onConnectError = onConnectError;

    this.connection.addEventListener('message', this.onMessage);
    this.connection.addEventListener('error', this.onConnectError);
    this.connection.addEventListener('close', this.onConnectClose);
    window.addEventListener('resize', this.onWindowResize);
    document.addEventListener('keypress', this.onKeyPress);

    this.logoutButton.addEventListener('click', this.onClickLogout);
    this.moveForwardButton.addEventListener('click', this.onClickMovement);
    this.moveBackButton.addEventListener('click', this.onClickMovement);
    this.moveLeftButton.addEventListener('click', this.onClickMovement);
    this.moveRightButton.addEventListener('click', this.onClickMovement);
    this.turnLeftButton.addEventListener('click', this.onClickMovement);
    this.turnRightButton.addEventListener('click', this.onClickMovement);
  }

  public start(): void {
    this.clock.start();
    this.gameScreen.appendChild(this.world.getCanvas());
    this.onWindowResize();
    this.frameHandle = requestAnimationFrame(this.update);
  }

  private update(): void {
    this.frameHandle = requestAnimationFrame(this.update);
    this.world.update(this.clock);
  }

  private onMessage(event: MessageEvent): void {
    const data: any = JSON.parse(event.data);
    console.log(data);
    switch(data.type) {
    case 'addAction':
      this.world.addAction(data.action);
      break;
    case 'addChunks':
      this.world.addChunks(data.chunks);
      break;
    case 'addEntities':
      this.world.addEntities(data.entities);
      break;
    case 'removeEntities':
      break;
    case 'updateEntities':
      break;
    case 'removeChunks':
      break;
    case 'playerReady':
      this.playerEntity = this.world.playerReady(data.networkId);
      break;
    }
  }

  private onClickMovement(event: MouseEvent): void {
    const movement: string = (event.target as HTMLButtonElement).id;
    let type: string = movement.includes('move') ? 'move' : 'turn';
    let direction: string = movement.replace('move-', '').replace('turn-', '');

    // send move or turn action
    this.connection.send(JSON.stringify({
      networkId: this.playerEntity.networkId,
      type: type,
      direction: direction
    }));
  }

  private onKeyPress(event: KeyboardEvent): void {
    let movement: string;
    switch(event.code) {
    case 'KeyW':
      movement = 'move-forward';
      break;
    case 'KeyS':
      movement = 'move-back';
      break;
    case 'KeyA':
      movement = 'move-left';
      break;
    case 'KeyD':
      movement = 'move-right';
      break;
    case 'KeyQ':
      movement = 'turn-left';
      break;
    case 'KeyE':
      movement = 'turn-right';
      break;
    default:
      return;
    }

    const type: string = movement.includes('move') ? 'move' : 'turn';
    const direction: string = movement.replace('move-', '').replace('turn-', '');

    // send move or turn action
    this.connection.send(JSON.stringify({
      networkId: this.playerEntity.networkId,
      type: type,
      direction: direction
    }));
  }

  private onWindowResize(): void {
    const width = Math.min(this.gameScreen.clientWidth, window.innerWidth);
    this.world.resizeRenderer(
      width,
      this.gameScreen.clientHeight
    );
  }

  private onClickLogout(): void {
    this.connection.close();
  }

  protected bindMethods(): void {
    this.update = this.update.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onClickLogout = this.onClickLogout.bind(this);
    this.onClickMovement = this.onClickMovement.bind(this);
  }

  protected createHTMLString(): string {
    return `
    <div class="game-menu-nav">
      <button id="logout">Logout</button>
      <button id="settings">Settings</button>
      <button id="map">Map</button>
      <button id="equipment">Equipment</button>
      <button id="inventory">Inventory</button>
    </div>
    <div class="game-top-ui">
      <div id="game-screen">
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
        <button id="move-forward">Move Forward</button>
        <button id="turn-right">Turn Right</button>
        <button id="move-left">Move Left</button>
        <button id="move-back">Move Back</button>
        <button id="move-right">Move Right</button>
      </div>
    </div>
    `;
  }

  public destructor(): void {
    this.connection.removeEventListener('message', this.onMessage);
    this.connection.removeEventListener('error', this.onConnectError);
    this.connection.removeEventListener('close', this.onConnectClose);
    window.removeEventListener('resize', this.onWindowResize);
    document.removeEventListener('keypress', this.onKeyPress);

    this.logoutButton.removeEventListener('click', this.onClickLogout);
    this.logoutButton.removeEventListener('click', this.onClickLogout);
    this.moveForwardButton.removeEventListener('click', this.onClickMovement);
    this.moveBackButton.removeEventListener('click', this.onClickMovement);
    this.moveLeftButton.removeEventListener('click', this.onClickMovement);
    this.moveRightButton.removeEventListener('click', this.onClickMovement);
    this.turnLeftButton.removeEventListener('click', this.onClickMovement);
    this.turnRightButton.removeEventListener('click', this.onClickMovement);

    this.logoutButton = null;
    this.moveForwardButton = null;
    this.moveBackButton = null;
    this.moveLeftButton = null;
    this.moveRightButton = null;
    this.turnLeftButton = null;
    this.turnRightButton = null;

    this.gameScreen.removeChild(this.gameScreen.firstChild);
    this.gameScreen = null;

    this.world.destructor();
    this.world = null;
    this.clock = null;
    this.playerEntity = null;

    this.connection.destructor();
    this.connection = null;
    this.onConnectClose = null;
    this.onConnectError = null;

    cancelAnimationFrame(this.frameHandle);

    super.destructor();
  }
}