import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import tripRoutes from "./routes/tripRoutes";
import activityRoutes from "./routes/activityRoutes";
import inviteRoutes from "./routes/inviteRoutes";
import { sequelize } from "./models/index";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
(app as any).set("trust proxy", 1);
app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

//Relaxed rate limiting in dev mode due to react strict mode running useEffect twice
const isProduction = process.env.NODE_ENV === "production";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15mins
  limit: isProduction ? 100 : 1000, // max requests per IP
  message: {error: "Too many requests, please try again later."}
});
app.use(limiter);

app.use("/auth", authRoutes);
app.use("/trips", tripRoutes);
app.use("/activities", activityRoutes);
app.use("/invites", inviteRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Postgres Connected");
    await sequelize.sync();
    console.log("Models synced");
    app.listen(PORT, () => {
      console.log(`Server listening on http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("Connection failed", error);
  }
})();
