import { Clock } from 'three';
import { Connection } from '../Connection';
import { GameUI } from '../ui/GameUI';
import { World } from '../World';
import { State } from './State';

export class GameState extends State {
  private clock: Clock;
  private world: World;
  private connection: Connection;
  private onConnectClose: () => void;
  private onConnectError: () => void;

  public constructor(connection: Connection,
                     onConnectClose: () => void,
                     onConnectError: () => void) {
    super();
    this.gui = new GameUI();
    this.clock = new Clock();
    this.world = new World();
    this.connection = connection;
    this.onConnectClose = onConnectClose;
    this.onConnectError = onConnectError;

    this.connection.addEventListener('message', this.onMessage);
    this.connection.addEventListener('error', this.onConnectError);
    this.connection.addEventListener('close', this.onConnectClose);
    this.gui.addEventListener('resize', this.onWindowResize);
  }

  public start(): void {
    (this.gui as GameUI).setGameCanvas(this.world.getCanvas());
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

  private onWindowResize(event: MessageEvent): void {
    this.world.resizeRenderer(event.data.width, event.data.height);
  }

  protected bindMethods(): void {
    this.update = this.update.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  public destructor(): void {
    this.connection.removeEventListener('message', this.onMessage);
    this.connection.removeEventListener('error', this.onConnectError);
    this.connection.removeEventListener('close', this.onConnectClose);
    this.gui.removeEventListener('resize', this.onWindowResize);

    this.clock = null;
    this.connection = null;
    this.onConnectClose = null;
    super.destructor();
  }
}