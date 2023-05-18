import { UserInterface } from '../ui/UserInterface';

export class State {
  protected gui: UserInterface | null;

  public constructor() {
    this.bindMethods()
  }

  protected bindMethods(): void {}

  public destructor(): void {
    this.gui!.destructor();
    this.gui = null;
  }
}