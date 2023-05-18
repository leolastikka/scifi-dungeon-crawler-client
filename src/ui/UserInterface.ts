export class UserInterface extends EventTarget {
  private elementRoot: HTMLElement | null;

  public constructor(htmlId: string) {
    super();
    this.createElement(this.createHTMLString(), htmlId);
  }

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
