import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";

import DATA from '../api/data'

const DELAY_PATIENT_UPDATE = 6000; // 6 seconds

function randomInt(min: number, max: number, around: number = 0) {
  const random = Math.floor(Math.random() * (max - min + 1) + min);
  return random.toFixed(around);
}

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server();

  io.bind(engine);

  io.on("connection", (socket) => {
    console.log("A user connected");
  });

  setInterval(() => {
    DATA.patients.forEach((patient) => {
        io.emit("patient-update-"+patient.id, {
          id: patient.id,
          vitals: {
            heartRate: randomInt(60, 120),
            temperature: randomInt(29, 42.6, 1),
            bloodPressure: { systolic: randomInt(120, 170), diastolic: randomInt(60, 90) },
            oxygenSaturation: randomInt(90, 100),
          }
        });
    });
  }, DELAY_PATIENT_UPDATE);

  nitroApp.router.use("/socket.io/", defineEventHandler({
    handler(event) {
      engine.handleRequest(event.node.req, event.node.res);
      event._handled = true;
    },
    websocket: {
      open(peer) {
        const nodeContext = peer.ctx.node;
        const req = nodeContext.req;

        // @ts-expect-error private method
        engine.prepare(req);

        const rawSocket = nodeContext.req.socket;
        const websocket = nodeContext.ws;

        // @ts-expect-error private method
        engine.onWebSocket(req, rawSocket, websocket);
      }
    }
  }));
});