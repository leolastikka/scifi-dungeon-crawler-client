import { State } from './State';
import { Assets } from '../Assets';

export class LoadState extends State {
  private assets: Assets;
  private listElement: HTMLElement;

  public constructor(assets: Assets) {
    super('load-state');
    this.assets = assets;
    this.listElement = document.getElementById('load-list');
  }

  public loadAssets(onLoad: () => void, onError: () => void): void {
    this.assets!.loadAssets(onLoad, this.onAssetsProgress, onError);
  }

  private onAssetsProgress(url: string, loaded: number, total: number) {
    const li = document.createElement('li');
    li.innerHTML = `Loaded ${loaded}/${total} assets`;
    this.listElement!.appendChild(li);
  }

  protected bindMethods(): void {
    this.onAssetsProgress = this.onAssetsProgress.bind(this);
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
    this.assets = null;
    this.listElement = null;
    super.destructor();
  }
}