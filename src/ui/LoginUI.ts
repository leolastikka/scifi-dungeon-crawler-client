import { UserInterface } from './UserInterface';

export class LoginUI extends UserInterface {
  private submitButton: HTMLButtonElement;
  private usernameInput: HTMLInputElement;
  private passwordInput: HTMLInputElement;

  constructor() {
    super('login-gui');
    this.bindMethods();
    this.submitButton = document.getElementById('login-submit') as
                        HTMLButtonElement;
    this.usernameInput = document.getElementById('username') as
                         HTMLInputElement;
    this.passwordInput = document.getElementById('password') as
                         HTMLInputElement;
    this.submitButton.addEventListener('click', this.onLoginSubmit);
  }

  public onLoginSubmit(): void {
    this.dispatchEvent(new MessageEvent('submit', {
      data: {
        username: this.usernameInput.value,
        password: this.passwordInput.value
      }
    }));
  }

  protected createHTMLString(): string {
    return `
    <ul>
      <li>Scifi Dungeon Crawler</li>
      <li>Login</li>
      <li></li>
      <li>Username</li>
      <li><input type="text" id="username"></li>
      <li>Password</li>
      <li><input type="password" id="password"></li>
      <li></li>
      <li><button id="login-submit">Login</button></li>
    </ul>
    `;
  }

  private bindMethods(): void {
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
  }

  public destructor(): void {
    this.submitButton.removeEventListener('click', this.onLoginSubmit);
    this.submitButton = null;
    this.usernameInput = null;
    this.passwordInput = null;
    super.destructor();
  }
}
