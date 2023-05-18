import { Connection } from '../Connection';
import { LoginUI } from '../ui/LoginUI';
import { State } from './State';

export class LoginState extends State {
  private connection: Connection;
  private onLogin: () => void;
  private onConnectError: () => void;

  constructor(connection: Connection,
              onLogin: () => void,
              onConnectError: () => void) {
    super();
    this.bindMethods();

    this.gui = new LoginUI();
    this.connection = connection;
    this.onLogin = onLogin;
    this.onConnectError = onConnectError;

    this.connection.addEventListener('message', this.onMessage);
    this.connection.addEventListener('error', this.onConnectError);
    this.gui.addEventListener('submit', this.onLoginSubmit);
  }

  private onMessage(event: MessageEvent): void {
    console.log('LoginState.onMessage');
    console.log(event.data);
    this.onLogin();
  }

  private onLoginSubmit(event: MessageEvent): void {
    this.connection.send(JSON.stringify({
      username: event.data.username,
      password: event.data.password
    }));
  }

  protected bindMethods(): void {
    this.onMessage = this.onMessage.bind(this);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
  }

  public destructor(): void {
    this.connection.removeEventListener('message', this.onMessage);
    this.connection.removeEventListener('error', this.onConnectError);
    this.connection = null;
    this.onConnectError = null;
    super.destructor();
  }
}
