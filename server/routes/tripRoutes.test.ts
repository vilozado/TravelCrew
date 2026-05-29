import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import router from './tripRoutes';
import { Request, Response, NextFunction } from 'express';

//Mock controllers 

vi.mock("../controllers/tripController", () => ({
  getTrips: vi.fn((req,res) => res.status(200).json({ msg: "getTrips" })),
  getTrip: vi.fn((req,res) => res.status(200).json({ msg: "getTrip" })),
  postTrip: vi.fn((req,res) => res.status(201).json({ msg: "postTrip" })),
  deleteTrip: vi.fn((req,res) => res.status(204).end()),
  updateTrip: vi.fn((req,res) => res.status(200).json({ msg: "updateTrip" })),
}));


//Mock middleware

vi.mock("../middleware/authMiddleware", () => ({
  authMiddleware: (req: Request, res: Response, next: NextFunction) => {
    req.user = { id: 1 };
    next();
  },
}));

//Setup app

const app = express();
app.use(express.json());
app.use('/trips', router);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Trip Routes", () => {

  it("GET /trips should call getTrips", async () => {
    const res = await request(app).get("/trips");

    expect(res.status).toBe(200);
    expect(res.body.msg).toBe("getTrips");
  });

  it("GET /trips/:id should call getTrip", async () => {
    const res = await request(app).get("/trips/1");

    expect(res.status).toBe(200);
    expect(res.body.msg).toBe("getTrip");
  });

  it("POST /trips should call postTrip", async () => {
    const res = await request(app)
    .post("/trips")
    .send({
      destination: "Paris, France", 
      startDate: "2026-03-25", 
      endDate: "2026-03-28"
    });

    expect(res.status).toBe(201);
    expect(res.body.msg).toBe("postTrip");
  });

  it("DELETE /trips/:id should call deleteTrip", async () => {
    const res = await request(app).delete("/trips/1");

    expect(res.status).toBe(204);
  });

  it("PATCH /trips/:id should call updateTrip", async () => {
    const res = await request(app)
    .patch("/trips/1")
    .send({
      startDate: "2026-03-25", 
      endDate: "2026-03-28"
    });

    expect(res.status).toBe(200);
    expect(res.body.msg).toBe("updateTrip");
  });
});

