import { Object3D, Vector2 } from "three";

export interface Chunk {
  id: number;
  position: Vector2;
  size: number;
  tiles: number[][];
  mesh?: Object3D;
}

/** Entity data received from server */
export interface ServerEntity {
  networkId: number;
  class: string;
  position: Vector2;
  orientation: number;
}

export enum EntityState {
  Idle,
  Move,
  Turn
}

export interface Entity {
  networkId: number;
  class: string;
  position: Vector2;
  orientation: number;
  state: EntityState;
  action: Action;
  mesh: Object3D;
  isPlayer: boolean;
}

/** Action data sent from client to server */
export interface ClientAction {
  type: string;
  direction: string
}

/** Action data received from server */
export interface ServerAction {
  type: string;
  networkId: number;
  direction?: string;
  speed?: number;
  time?: number;
  startPosition?: Vector2;
  endPosition?: Vector2;
  startOrientation?: number;
  endOrientation?: number;
}

/** Action created from ServerAction that is processed inside client */
export interface Action {
  type: string;
  networkId: number;
  startTime?: number;
  endTime?: number;
  startPosition?: Vector2;
  endPosition?: Vector2;
  startOrientation?: number;
  endOrientation?: number;
  speed?: number;
}
