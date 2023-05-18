export class Connection extends EventTarget{
  private socket: WebSocket;
  private user: object;

  public constructor(wsUrl: string) {
    super();
    this.bindMethods();
    this.socket = new WebSocket(wsUrl);
    this.socket.onopen = this.onOpen;
    this.socket.onmessage = this.onMessage;
    this.socket.onerror = this.onError;
    this.socket.onclose = this.onClose;
  }

  public send(data: string | ArrayBuffer): void {
    this.socket.send(data);
  }

  private onOpen(ev: Event): any {
    this.dispatchEvent(new Event(ev.type));
  }

  private onMessage(ev: MessageEvent): void {
    this.dispatchEvent(new MessageEvent(ev.type, {
      data: ev.data
    }));
  }

  private onError(ev: Event) {
    this.dispatchEvent(new Event(ev.type));
  }

  private onClose(ev: Event) {
    this.dispatchEvent(new Event(ev.type));
  }

  private bindMethods() {
    this.onOpen = this.onOpen.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onError = this.onError.bind(this);
    this.onClose = this.onClose.bind(this);
  }
}