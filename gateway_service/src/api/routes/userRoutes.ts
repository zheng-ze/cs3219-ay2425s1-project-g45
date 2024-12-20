import express from "express";
import dotenv from "dotenv";
import * as requestHelper from "../../utility/requestHelper";
import { authenticateToken } from "../../utility/jwtHelper";

dotenv.config();

export const USER_SERVICE =
  process.env.NODE_ENV === "production"
    ? `${process.env.USER_SERVICE_URL}/auth` || "http://users-service/auth"
    : `http://${process.env.USER_SERVICE_ROUTE}:${process.env.USER_SERVICE_PORT}/auth`;

console.log("USER_SERVICE_URL", USER_SERVICE);

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://user-service/auth";

const router = express.Router();
router.post("/signup", requestHelper.sendPostRequest("signup", USER_SERVICE));

router.post("/signin", requestHelper.sendPostRequest("signin", USER_SERVICE));


router.get("/validate", authenticateToken, (req, res) => {
  res.sendStatus(200);
});

router.post(
  "/requestreset",
  requestHelper.sendPostRequest("requestreset", USER_SERVICE)
);

router.post(
  "/resetpassword/password",
  requestHelper.sendPostRequest("resetpassword/password", USER_SERVICE)
);

router.post(
  "/resetpassword/token",
  requestHelper.sendPostRequest("resetpassword/token", USER_SERVICE)
);

router.delete("/delete/:id", async (req, res) => {
  const id = req.params["id"];
  return requestHelper.sendDeleteRequest("/delete", USER_SERVICE, id)(req, res);
});

export default router;
