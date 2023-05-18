import { UserInterface } from './UserInterface';

export class LoadUI extends UserInterface {
  private listElement: HTMLElement | null;

  constructor() {
    super('load-gui');
    this.listElement = document.getElementById('load-list');
  }

  public updateProgress(loaded: number, total: number): void {
    const li = document.createElement('li');
    li.innerHTML = `Loaded ${loaded}/${total} assets`;
    this.listElement!.appendChild(li);
  }

  protected createHTMLString(): string {
    return `
    <ul id="load-list">
      <li>Scifi Dungeon Crawler</li>
      <li></li>
      <li id="load-progress">Loading assets...</li>
    </ul>
    `;
  }

  public destructor(): void {
    this.listElement = null;
    super.destructor();
  }
}
