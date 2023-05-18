import { LoadingManager, Texture, TextureLoader } from 'three';
// import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export enum AssetType {
  Texture
}

class Asset {
  public type: AssetType;
  public name: string;
  public url: string;
  public data: Texture | null;

  public constructor(type: AssetType, name: string, url: string) {
    this.type = type;
    this.name = name;
    this.url = url;
  }
}

export class Assets extends EventTarget {
  private assets: Asset[];
  private loadingManager: LoadingManager;

  public constructor() {
    super();
    
    this.assets = [];
    this.assets.push(new Asset(AssetType.Texture, 'test', './assets/test.png'));
    this.assets.push(new Asset(AssetType.Texture, 'test2', './assets/test2.png'));
  }

  public getAsset(name: string): Texture | null {
    this.assets.find((asset: Asset) => {
      if (asset.name === name) {
        return asset.data;
      }
    });
    return null;
  }

  public loadAssets(onLoad: () => void,
                          onProgress: (url: string, loaded: number, total: number) => void,
                          onError: (url: string) => void): void {
    this.loadingManager = new LoadingManager(onLoad, onProgress, onError);
    const textureLoader: TextureLoader = new TextureLoader(this.loadingManager);
    onProgress('All assets', 0, this.assets.length);

    for (let i = 0; i < this.assets.length; i++) {
      let asset: Asset = this.assets[i];
      if (asset.type === AssetType.Texture) {
        textureLoader.loadAsync(asset.url).then((texture: Texture) => {
          asset.data = texture;
        });
      }
    }
  }
}