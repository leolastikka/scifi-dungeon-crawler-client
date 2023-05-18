export class State {
  protected elementRoot: HTMLElement | null;

  public constructor(htmlId: string) {
    this.bindMethods();
    this.createElement(this.createHTMLString(), htmlId);
  }

  protected bindMethods(): void {}

  protected createHTMLString(): string { return ''; }

  protected createElement(htmlStr: string, htmlId: string): void {
    const element: HTMLElement = document.createElement('div');
    element.id = htmlId;
    element.innerHTML = htmlStr;
    this.elementRoot = element;
    document.body.appendChild(element);
  }

  public destructor(): void {
    if (this.elementRoot) {
      this.elementRoot.parentElement.removeChild(this.elementRoot);
      this.elementRoot = null;
    }
  }
}