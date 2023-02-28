import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import fs from "fs";
import path from "path";
import { ExtWebSocket } from "./model/ExtWebSocket";
import { UserData } from "./model/UserData";

const { app, getWss } = expressWs(express());
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.ws("/", (ws: ExtWebSocket) => {
  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString()) as UserData;
    switch (data.method) {
      case "connection":
        connectionHandler(ws, data);
        break;
      case "draw":
        broadcastConnection(ws, data);
        break;
    }
  });
});

app.post("/image", (req, res) => {
  try {
    const data = req.body.img.replace(`data:image/png;base64,`, "");
    fs.writeFileSync(
      path.resolve(__dirname, "files", `${req.query.id}.jpg`),
      data,
      "base64"
    );
    return res.status(200).json("Success");
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal Server Error");
  }
});

app.get("/image", (req, res) => {
  try {
    const file = fs.readFileSync(
      path.resolve(__dirname, "files", `${req.query.id}.jpg`)
    );
    const data = `data:image/png;base64,` + file.toString("base64");
    res.json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal Server Error");
  }
});

app.listen(PORT, () => console.log("Server starting...)"));

const connectionHandler = (ws: ExtWebSocket, msg: UserData) => {
  ws.id = msg.id;
  broadcastConnection(ws, msg);
};

const broadcastConnection = (ws: ExtWebSocket, msg: UserData) => {
  getWss().clients.forEach((client: ExtWebSocket) => {
    if (client.id === msg.id) {
      client.send(JSON.stringify(msg));
    }
  });
};
