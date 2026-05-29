import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body; // get password input

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Missing credentials" });
    }
    const existingUser = await User.findOne({ where: { email } }); // check if email already exists in DB
    if (existingUser) {
      return res.status(409).json({
        msg: "There's already an account with this email",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10); // hash the password

    const user = await User.create({ name, email, passwordHash }); // send the hashed password to the db

    res.status(201).json({ name: user.name, email: user.email }); //make sure no sensitive info is sent back!
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body; //recieve login credentials from client

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    const user = await User.findOne({ where: { email } }); // check user's email against DB

    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.passwordHash); // If email OK, compare the verify password is correct

    if (!isValid) return res.status(401).json({ msg: "Invalid credentials" });

    // if password is okay generate JWT token
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "JWT secret not configured" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    //set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 3, // 3 hours
    });
    res.status(200).json({ name: user.name }); //make sure no sensitive info is sent back!
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({ msg: "Logged out" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const checkUser = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({msg: "Not authenticated"});
  }
  res.json({ user: req.user });
};
