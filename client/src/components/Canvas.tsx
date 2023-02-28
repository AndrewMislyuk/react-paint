import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { observer } from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";
import { useParams } from "react-router-dom";
import { UserData } from "../model/UserData";
import { DrawData } from "../model/DrawData";

const Canvas = observer(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const params = useParams();

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    axios
      .get(`http://localhost:3001/image?id=${params.id}`)
      .then((response) => {
        const img = new Image();
        const ctx = canvasRef.current?.getContext("2d");
        img.src = response.data;
        img.onload = () => {
          ctx?.clearRect(
            0,
            0,
            Number(canvasRef.current?.width),
            Number(canvasRef.current?.height)
          );
          ctx?.drawImage(
            img,
            0,
            0,
            Number(canvasRef.current?.width),
            Number(canvasRef.current?.height)
          );
          ctx?.stroke();
        };
      });
  }, []);

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket("ws://localhost:3001/");
      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id as string);
      toolState.setTool(
        new Brush(canvasRef.current, socket, params.id as string)
      );
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            id: params.id,
            username: canvasState.username,
            method: "connection",
          })
        );
      };
      socket.onmessage = (event: MessageEvent) => {
        const msg: UserData | DrawData = JSON.parse(event.data);
        switch (msg.method) {
          case "connection":
            console.log(`user ${(msg as UserData).username} has connected`);
            break;
          case "draw":
            drawHandler(msg as DrawData);
            break;
        }
      };
    }
  }, [canvasState.username]);

  const drawHandler = (msg: DrawData) => {
    const figure = msg.figure;
    const ctx = canvasRef.current?.getContext("2d") as CanvasRenderingContext2D;

    switch (figure.type) {
      case "brush":
        Brush.draw(ctx, figure?.x ?? 0, figure?.y ?? 0);
        break;
      case "rect":
        Rect.staticDraw(
          ctx,
          figure?.x ?? 0,
          figure?.y ?? 0,
          figure?.width ?? 0,
          figure?.height ?? 0,
          figure?.color ?? ""
        );
        break;
      case "finish":
        ctx.beginPath();
        break;
    }
  };

  const mouseDownHandler = (e: React.MouseEvent<HTMLCanvasElement>) => {
    canvasState.pushToUndo(canvasRef.current?.toDataURL() ?? "");
  };

  const mouseUpHandler = (e: React.MouseEvent<HTMLCanvasElement>) => {
    axios.post(`http://localhost:3001/image?id=${params.id}`, {
      img: canvasRef.current?.toDataURL(),
    });
  };

  const connectionHandler = () => {
    canvasState.setUsername(usernameRef.current!.value);
    setIsModalOpen(false);
  };

  return (
    <div className="canvas">
      <canvas
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        ref={canvasRef}
        width={600}
        height={400}
      />

      <Modal show={isModalOpen} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>Enter your name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input ref={usernameRef} type="text" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={connectionHandler}>
            Sign in
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

export default Canvas;
