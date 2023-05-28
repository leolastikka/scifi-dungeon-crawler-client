import { BoxGeometry, BufferGeometry, Matrix4, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, Vector2, Vector3, WebGLRenderer } from 'three';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { Chunk, Entity } from './Interfaces';

export class World {
  private scene: Scene;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;

  private tileMaterial: MeshBasicMaterial;
  private wireframeMaterial: MeshBasicMaterial;

  private chunks: Map<string, Chunk>;
  private entities: Array<Entity>;
  private actions: any[];
  private playerEntity: any;

  public getCanvas(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  public getEntityByNetworkId(networkId: number): Entity {
    return this.entities.find(e => e.networkId === networkId);
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

    this.chunks = new Map();
    this.entities = [];
    this.actions = [];

    // materials
    this.tileMaterial = new MeshBasicMaterial({
      color: 0x002200
    });
    this.wireframeMaterial = new MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true
    });
  }

  public update(): void {
    this.renderer.render(this.scene, this.camera);
  }

  public setCameraPosition(position: Vector2) {
    this.camera.position.x = position.x;
    this.camera.position.z = position.y;
    this.camera.rotation.y = Math.PI;
  }

  public movePlayer(action: any) {
    if (action.type === 'move') {
      let movement: Vector3;
      let forward = new Vector3();
      this.camera.getWorldDirection(forward);
      var axis = new Vector3(0, 1, 0);

      if (action.movement === 'move-forward') {
        movement = forward.clone();
      }
      else if (action.movement === 'move-back') {
        movement = forward.clone().multiplyScalar(-1);
      }
      else if (action.movement === 'move-left') {
        movement = forward.clone().applyAxisAngle(axis, Math.PI / 2);
      }
      else if (action.movement === 'move-right') {
        movement = forward.clone().applyAxisAngle(axis, -Math.PI / 2);
      }
      this.camera.position.add(movement);
    }
    if (action.type === 'turn') {
      let rotation: number;
      if (action.movement === 'turn-left') {
        rotation = Math.PI / 2;
      }
      else if (action.movement === 'turn-right') {
        rotation = -Math.PI / 2;
      }
      this.camera.rotateY(rotation);
    }
  }

  public addChunks(chunks: Array<Chunk>): void {
    const wallGeometry: BoxGeometry = new BoxGeometry(1, 1, 1);
    const floorGeometry: PlaneGeometry = new PlaneGeometry(1);
    floorGeometry.rotateX(-Math.PI / 2);
    const matrix: Matrix4 = new Matrix4();

    chunks.forEach(chunk => {
      const geometries = [];

      for (let i=0; i<chunk.size; i++) {
        for (let j=0; j<chunk.size; j++) {
          const tile = chunk.tiles[j][i];
          const x = i + chunk.pos.x;
          const y = j + chunk.pos.y;

          switch (tile) {
          case 1:
            matrix.makeTranslation(x, -0.5, y);
            geometries.push(floorGeometry.clone().applyMatrix4(matrix));
            break;
          case 2:
          case 3:
            matrix.makeTranslation(x, 0, y);
            geometries.push(wallGeometry.clone().applyMatrix4(matrix));
            break;
          default:
            break;
          }
        }
      }

      const chunkGeometry: BufferGeometry = mergeBufferGeometries(geometries);
      chunkGeometry.computeBoundingSphere();
      const chunkMesh: Mesh = new Mesh(chunkGeometry, this.tileMaterial);
      chunkMesh.add(new Mesh(chunkGeometry, this.wireframeMaterial));

      this.scene.add(chunkMesh);
      chunk.mesh = chunkMesh;

      this.chunks.set(`${chunk.pos.x},${chunk.pos.y}`, chunk);
    });
  }

  public addEntities(entities: Array<Entity>): void {
    entities.forEach(entity => {
      entity.position = new Vector2(
        entity.position.x,
        entity.position.y
      );
      this.entities.push(entity);
    });
  }

  public resizeRenderer(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public destructor(): void {
    this.chunks.forEach(chunk => {
      chunk.mesh = null;
    });
    this.chunks.clear();

    this.entities.forEach(entity => {
      entity.mesh = null;
    })
    this.entities = [];

    this.renderer = null;
    this.camera = null;
    this.scene.clear();
    this.scene = null;
  }
}
