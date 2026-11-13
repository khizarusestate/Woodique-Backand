import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[process.env.WOODIQUE_COOKIE_NAME || "woodique_session"];
    if (!token) return res.status(401).json({ success: false, message: "Please log in to continue." });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ success: false, message: "Your session is no longer valid. Please log in again." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Your session has expired. Please log in again." });
  }
}
