export class Connection extends EventTarget{
  private socket: WebSocket;

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

  public close(): void {
    this.socket.close();
  }

  private onOpen(ev: Event): void {
    this.dispatchEvent(new Event(ev.type));
  }

  private onMessage(ev: MessageEvent): void {
    this.dispatchEvent(new MessageEvent(ev.type, {
      data: ev.data
    }));
  }

  private onError(ev: Event): void {
    this.dispatchEvent(new Event(ev.type));
  }

  private onClose(ev: Event): void {
    this.dispatchEvent(new Event(ev.type));
  }

  private bindMethods(): void {
    this.onOpen = this.onOpen.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onError = this.onError.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  public destructor(): void {
    this.socket = null;
  }
}