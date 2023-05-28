import { Object3D, Vector2 } from "three";

export interface Chunk {
  id: number;
  pos: Vector2;
  size: number;
  tiles: number[][];
  mesh?: Object3D;
}

export interface Entity {
  networkId: number;
  position: Vector2;
  mesh?: Object3D;
}
