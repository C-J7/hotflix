import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import pool from "../config/db"; // Import pool from db config

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response): Promise<Response | undefined> => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: "Invalid Google token payload" });
    }

    const { sub: google_id, email, name, picture } = payload;

    // Check if user exists
    const userQuery = await pool.query("SELECT * FROM users WHERE google_id = $1", [google_id]);

    let user = userQuery.rows[0];

    if (!user) {
      // Insert new user
      const insertQuery = `
        INSERT INTO users (google_id, email, name, picture)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const insertResult = await pool.query(insertQuery, [google_id, email, name, picture]);
      user = insertResult.rows[0];
    }

    // Generate JWT
    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
};