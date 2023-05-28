import { Connection } from '../Connection';
import { State } from './State';

export class LoginState extends State {
  private submitButton: HTMLButtonElement;
  private usernameInput: HTMLInputElement;
  private passwordInput: HTMLInputElement;

  private connection: Connection;
  private onLogin: () => void;
  private onConnectClose: () => void;
  private onConnectError: () => void;

  constructor(connection: Connection,
              onLogin: () => void,
              onConnectClose: () => void,
              onConnectError: () => void) {
    super('login-state');
    this.bindMethods();

    this.connection = connection;
    this.onLogin = onLogin;
    this.onConnectClose = onConnectClose;
    this.onConnectError = onConnectError;

    this.connection.addEventListener('message', this.onMessage);
    this.connection.addEventListener('close', this.onConnectClose);
    this.connection.addEventListener('error', this.onConnectError);

    this.submitButton = document.getElementById('login-submit') as
                        HTMLButtonElement;
    this.usernameInput = document.getElementById('username') as
                         HTMLInputElement;
    this.passwordInput = document.getElementById('password') as
                         HTMLInputElement;
    this.submitButton.addEventListener('click', this.onLoginSubmit);
  }

  private onMessage(event: MessageEvent): void {
    console.log('LoginState.onMessage');
    console.log(event.data);
    this.onLogin();
  }

  private onLoginSubmit(): void {
    const username = this.usernameInput.value;
    const password = this.passwordInput.value;

    if (!username || !password) {
      return;
    }

    this.connection.send(JSON.stringify({
      username: username,
      password: password
    }));
  }

  protected bindMethods(): void {
    this.onMessage = this.onMessage.bind(this);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
  }

  protected createHTMLString(): string {
    return `
    <ul>
      <li>Scifi Dungeon Crawler</li>
      <li>Login</li>
      <li></li>
      <li>Username</li>
      <li><input type="text" id="username" value="test" required></li>
      <li>Password</li>
      <li><input type="password" id="password" value="test" required></li>
      <li></li>
      <li><button id="login-submit">Login</button></li>
    </ul>
    `;
  }

  public destructor(): void {
    this.submitButton.removeEventListener('click', this.onLoginSubmit);
    this.submitButton = null;
    this.usernameInput = null;
    this.passwordInput = null;

    this.connection.removeEventListener('message', this.onMessage);
    this.connection.removeEventListener('close', this.onConnectClose);
    this.connection.removeEventListener('error', this.onConnectError);
    this.connection = null;
    this.onConnectError = null;
    super.destructor();
  }
}
