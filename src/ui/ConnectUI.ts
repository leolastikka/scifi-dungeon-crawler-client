import { UserInterface } from './UserInterface';

export class ConnectUI extends UserInterface {
  constructor() {
    super('connect-gui');
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
}
