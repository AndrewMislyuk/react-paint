import Tool from "./Tool";

export default class Circle extends Tool {
  private mouseDown: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private saved: string = "";

  constructor(
    canvas: HTMLCanvasElement | null,
    socket: WebSocket | null,
    id: string | null
  ) {
    super(canvas, socket, id);
    this.listen();
  }

  listen() {
    this.canvas!.onmousemove = this.mouseMoveHandler.bind(this);
    this.canvas!.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas!.onmouseup = this.mouseUpHandler.bind(this);
  }

  mouseDownHandler(e: MouseEvent) {
    this.mouseDown = true;
    let canvasData = this.canvas!.toDataURL();
    this.ctx?.beginPath();
    this.startX = e.pageX - (e.target as HTMLElement).offsetLeft;
    this.startY = e.pageY - (e.target as HTMLElement).offsetTop;
    this.saved = canvasData;
  }

  mouseUpHandler(e: MouseEvent) {
    this.mouseDown = false;
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown) {
      let curentX = e.pageX - (e.target as HTMLElement).offsetLeft;
      let curentY = e.pageY - (e.target as HTMLElement).offsetTop;
      let width = curentX - this.startX;
      let height = curentY - this.startY;
      let r = Math.sqrt(width ** 2 + height ** 2);
      this.draw(this.startX, this.startY, r);
    }
  }

  draw(x: number, y: number, r: number) {
    const img = new Image();
    img.src = this.saved;
    img.onload = async () => {
      this.ctx?.clearRect(
        0,
        0,
        Number(this.canvas?.width),
        Number(this.canvas?.height)
      );
      this.ctx?.drawImage(
        img,
        0,
        0,
        Number(this.canvas?.width),
        Number(this.canvas?.height)
      );
      this.ctx?.beginPath();
      this.ctx?.arc(x, y, r, 0, 2 * Math.PI);
      this.ctx?.fill();
      this.ctx?.stroke();
    };
  }
}
