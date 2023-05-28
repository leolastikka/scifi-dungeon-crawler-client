import { Assets } from './Assets';
import { State } from './state/State';
import { LoadState } from './state/LoadState';
import { Connection } from './Connection';
import { ConnectState } from './state/ConnectState';
import { Settings } from './Settings';
import { LoginState } from './state/LoginState';
import { GameState } from './state/GameState';

class Main {
  private state: State;
  private assets: Assets;
  private connection: Connection;

  public constructor() {
    this.bindMethods();
    this.assets = new Assets();
  }

  public start(): void {
    this.state = new LoadState(this.assets);
    (this.state as LoadState).loadAssets(this.onLoad, this.onLoadError);
  }

  private onLoad(): void {
    this.state.destructor();
    this.connection = new Connection(Settings.getWsUrl());
    this.state = new ConnectState(this.connection);
    (this.state as ConnectState).connect(this.onConnect, this.onConnectError);
  }

  private onLoadError(): void {
    console.error('Main.onLoadError');
  }

  private onConnect(): void {
    this.state.destructor();
    this.state = new LoginState(this.connection, this.onLogin, this.onConnectClose, this.onConnectError);
  }

  private onConnectError(): void {
    console.error('Main.onConnectError');
    this.onLoad();
  }

  private onConnectClose(): void {
    console.log('Main.onConnectClose');
    this.onLoad();
  }

  private onLogin(): void {
    this.state.destructor();
    this.state = new GameState(this.connection, this.onConnectClose, this.onConnectError);
    (this.state as GameState).start();
  }

  private bindMethods(): void {
    this.onLoad = this.onLoad.bind(this);
    this.onLoadError = this.onLoadError.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.onConnectError = this.onConnectError.bind(this);
    this.onConnectClose = this.onConnectClose.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }
 }

const main: Main = new Main();
main.start();
