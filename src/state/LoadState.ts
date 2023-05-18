import { State } from './State';
import { LoadUI } from '../ui/LoadUI';
import { Assets } from '../Assets';

export class LoadState extends State {
  private assets: Assets | null;

  public constructor(assets: Assets) {
    super();
    this.assets = assets;
    this.gui = new LoadUI();
  }

  public loadAssets(onLoad: () => void, onError: () => void): void {
    this.assets!.loadAssets(onLoad, this.onAssetsProgress, onError);
  }

  private onAssetsProgress(url: string, loaded: number, total: number) {
    (this.gui! as LoadUI).updateProgress(loaded, total);
  }

  protected bindMethods(): void {
    this.onAssetsProgress = this.onAssetsProgress.bind(this);
  }

  public destructor(): void {
    this.assets = null;
    super.destructor();
  }
}