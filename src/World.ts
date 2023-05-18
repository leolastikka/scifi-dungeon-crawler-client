import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, Vector2, WebGLRenderer } from 'three';

interface Chunk {
  id: number;
  pos: Vector2;
  tiles: number[][];
}

export class World {
  private scene: Scene;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;

  private testMesh: Mesh;
  private playerEntity: any;

  private chunks: Chunk[];
  private entities: any[];
  private actions: any[];

  public getCanvas(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  public constructor() {
    this.scene = new Scene();
    this.renderer = new WebGLRenderer();
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    this.chunks = [];
    this.entities = [];
    this.actions = [];

    // testing box
    this.camera.position.x = 0;
    this.camera.position.z = 5;
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true
    });
    this.testMesh = new Mesh(geometry, material);
    this.testMesh.position.set(0, 0, 0);
    this.scene.add(this.testMesh);
  }

  public update(): void {
    this.testMesh.rotation.x += 0.01;
    this.testMesh.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  }

  public resizeRenderer(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public destructor(): void {

  }
}
