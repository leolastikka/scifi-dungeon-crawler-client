import { BoxGeometry, BufferGeometry, Clock, Matrix4, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, Vector2, Vector3, WebGLRenderer } from 'three';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { Chunk, ServerAction, Action, Entity, EntityState } from './Interfaces';

export class World {
  private scene: Scene;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private playerEntity: Entity;

  private deltaTime: number;

  private tileMaterial: MeshBasicMaterial;
  private wireframeMaterial: MeshBasicMaterial;

  /** Map<positionString, chunk> */
  private chunks: Map<string, Chunk>;
  /** Map<networkId, entity> */
  private entities: Map<number, Entity>;

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

    this.chunks = new Map();
    this.entities = new Map();

    // materials
    this.tileMaterial = new MeshBasicMaterial({
      color: 0x002200
    });
    this.wireframeMaterial = new MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true
    });
  }

  public update(clock: Clock): void {
    this.deltaTime = clock.getDelta();

    for (let entity of this.entities.values()) {
      // where is the code to update entitites?
      // should entities be class instances instead of data objects?
      switch (entity.state) {
      case EntityState.Idle:
        break;
      case EntityState.Move:
        this.moveEntity(entity);
        break;
      case EntityState.Turn:
        this.turnEntity(entity);
        break;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  private setCamera(position: Vector2, orientation: number): void {
    this.camera.position.x = position.x;
    this.camera.position.z = position.y;
    this.camera.rotation.y = orientation;
  }

  private moveEntity(entity: Entity): void {
    const movementDistance = entity.action.speed * this.deltaTime;

    const diff = entity.action.endPosition.clone().sub(entity.position);
    const distance = diff.length();

    if (movementDistance < distance) {
      // If end position is not reached.
      let norm = diff.normalize();
      norm.multiplyScalar(movementDistance);
      entity.position.add(norm);
    }
    else {
      // If end position is reached.
      entity.position = entity.action.endPosition.clone();
      this.endEntityAction(entity);
    }

    // Update object3d position in scene.
    if (entity.mesh) {
      entity.mesh.position.x = entity.position.y
      entity.mesh.position.z = entity.position.x;
    }

    // Update camera if this is player entity.
    if (entity === this.playerEntity) {
      this.setCamera(entity.position.clone(), entity.orientation);
    }
  }

  private turnEntity(entity: Entity): void {
    let turnAngle = entity.action.speed * this.deltaTime;
    const diff = entity.action.endOrientation - entity.orientation;
    if (diff < 0.0) {
      turnAngle *= -1.0;
    }

    if (turnAngle < Math.abs(diff)) { // FIX THIS
      // If end orientation is not reached.
      entity.orientation += turnAngle;
    }
    else {
      // If end orientation is reached.
      entity.orientation = entity.action.endOrientation;
      this.endEntityAction(entity);
    }
    // Update object3d orientation in scene.
    if (entity.mesh) {
      entity.mesh.rotation.y = entity.orientation;
    }

    // Update camera if this is player entity.
    if (entity === this.playerEntity) {
      this.setCamera(entity.position.clone(), entity.orientation);
    }
  }

  private startEntityAction(entity: Entity, action: Action): void {
    console.log('World.startEntityAction():');
    console.log(action);
    entity.action = action;
    if (action.type === 'move') {
      entity.state = EntityState.Move;
      entity.position = action.startPosition.clone();
      // Update entity's model's position.
      if (entity.mesh) {
        entity.mesh.position.x = entity.position.y
        entity.mesh.position.z = entity.position.x;
      }
    }
    else if (action.type === 'turn') {
      entity.state = EntityState.Turn;
      entity.orientation = action.startOrientation;
      // Update entity's model's orientation.
      if (entity.mesh) {
        entity.mesh.rotation.y = entity.orientation;
      }
    }
  }

  private endEntityAction(entity: Entity): void {
    const type = entity.action.type;
    if (type === 'move') {
      entity.position = entity.action.endPosition.clone();
    }
    else if (type === 'turn') {
      entity.orientation = entity.action.endOrientation;
    }

    // Update camera if this is player entity.
    if (entity === this.playerEntity) {
      this.setCamera(entity.position.clone(), entity.orientation);
    }

    entity.state = EntityState.Idle;
    entity.action = null;
  }

  public addAction(action: ServerAction): void {
    const entity = this.entities.get(action.networkId);

    // Create new Vector instances if needed.
    if (action.startPosition) {
      action.startPosition = new Vector2(
        action.startPosition.x,
        action.startPosition.y
      );
    }
    if (action.endPosition) {
      action.endPosition = new Vector2(
        action.endPosition.x,
        action.endPosition.y
      );
    }

    // check if entity still has previous action
    const oldAction = entity.action;
    if (oldAction) {
      // end previous action
      this.endEntityAction(entity);
    }

    // add new action and start it
    this.startEntityAction(entity, action);
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
          const x = i + chunk.position.x;
          const y = j + chunk.position.y;

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

      this.chunks.set(`${chunk.position.x},${chunk.position.y}`, chunk);
    });
  }

  public addEntities(entities: Array<Entity>): void {
    for (let entity of entities) {
      // Initialize entity.
      entity.state = EntityState.Idle;

      // Create new Vector instance for position object.
      entity.position = new Vector2(
        entity.position.x,
        entity.position.y
      );

      // add mesh to entity
      // add entity mesh to scene

      this.entities.set(entity.networkId, entity);
    }
  }

  public playerReady(entityId: number): Entity {
    const entity: Entity = this.entities.get(entityId);
    this.playerEntity = entity;

    // remove mesh from player
    this.scene.remove(entity.mesh);
    entity.mesh = null;

    this.setCamera(entity.position.clone(), entity.orientation);
    return entity;
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
    this.chunks = null;

    this.entities.forEach(entity => {
      // use removeEntities method here?
      entity.mesh = null;
      entity.position = null;
      entity.action = null;
    })
    this.entities.clear();
    this.entities = null;

    this.renderer = null;
    this.camera = null;
    this.scene.clear();
    this.scene = null;
  }
}
