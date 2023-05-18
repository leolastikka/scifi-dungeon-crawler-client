import { Connection } from '../Connection';
import { State } from './State';

export class ConnectState extends State {
  private connection: Connection;
  private onConnect: () => void;
  private onConnectError: () => void;

  constructor(connection: Connection) {
    super('connect-gui');
    this.bindMethods();
    this.connection = connection;
  }

  public connect(onConnect: () => void, onConnectError: () => void): void {
    this.onConnect = onConnect;
    this.onConnectError = onConnectError;
    this.connection.addEventListener('open', this.onOpen);
    this.connection.addEventListener('error', this.onError);
  }

  private onOpen(): void {
    this.onConnect();
  }

  private onError(): void {
    this.onConnectError();
  }

  protected bindMethods(): void {
    this.onOpen = this.onOpen.bind(this);
    this.onError = this.onError.bind(this);
  }

  protected createHTMLString(): string {
    return `
    <ul>
      <li>Scifi Dungeon Crawler</li>
      <li></li>
      <li>Connecting to login server...</li>
    </ul>
    `;
  }

  public destructor(): void {
    this.connection.removeEventListener('open', this.onOpen);
    this.connection.removeEventListener('error', this.onError);
    this.connection = null;
    this.onConnect = null;
    this.onConnectError = null;
    super.destructor();
  }
}
