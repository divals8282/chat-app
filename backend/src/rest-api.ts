import { Express, NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "./schemas/user";
import { requireAuthE } from "./core/middlewares/requireAuthE";

export const restApi = (application: Express) => {
  application.get("/", (request, response) => {
    response.status(200).json({
      message: "ExpressJS Server is running",
    });
  });

  application.post(
    "/sign-up",
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("nickname")
      .isLength({ max: 24, min: 3 })
      .withMessage(
        "Nickname is required min 3 characters and max 24 characters"
      ),
    async (request, response) => {
      const result = validationResult(request);

      if (!result.isEmpty()) {
        return response.status(409).json({ errors: result.array() });
      }

      const { email, password, nickname } = request.body;

      const isUserExists = await UserModel.findOne({ email });

      if (isUserExists) {
        return response
          .status(409)
          .json({ message: "User with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await UserModel.create({ email, password: hashedPassword, nickname });

      return response
        .status(201)
        .json({ message: "User created successfully" });
    }
  );

  application.post(
    "/sign-in",
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    async (request, response) => {
      const result = validationResult(request);

      if (!result.isEmpty()) {
        return response.status(409).json({ errors: result.array() });
      }

      const { email, password } = request.body;

      const isUserExists = await UserModel.findOne({ email });

      if (!isUserExists) {
        return response
          .status(404)
          .json({ message: "invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        isUserExists.password as string
      );

      if (!isPasswordValid) {
        return response
          .status(404)
          .json({ message: "invalid email or password" });
      }

      const accessToken = jwt.sign(
        {
          id: isUserExists._id,
          nickname: isUserExists.nickname,
          email: isUserExists.email,
        },
        process.env.SECRET_KEY as string,
        { expiresIn: "10s" }
      );

      const refreshToken = jwt.sign(
        {
          id: isUserExists._id,
          nickname: isUserExists.nickname,
          email: isUserExists.email,
        },
        process.env.SECRET_KEY as string,
        { expiresIn: "30m" }
      );

      isUserExists.refreshToken = refreshToken;

      await isUserExists.save();

      return response.status(200).json({
        message: "Sign-in successful",
        credentials: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    }
  );

  application.post(
    "/refresh-token",
    body("refreshToken").notEmpty().withMessage("Refresh token is required"),
    async (request, response) => {
      const result = validationResult(request);

      if (!result.isEmpty()) {
        return response.status(409).json({ errors: result.array() });
      }

      const { refreshToken } = request.body;

      try {
        jwt.verify(refreshToken, process.env.SECRET_KEY as string);

        const user = await UserModel.findOne({ refreshToken });

        if (!user) {
          return response
            .status(401)
            .json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign(
          {
            id: user._id,
            nickname: user.nickname,
            email: user.email,
          },
          process.env.SECRET_KEY as string,
          { expiresIn: "10s" }
        );

        const newRefreshToken = jwt.sign(
          {
            id: user._id,
            nickname: user.nickname,
            email: user.email,
          },
          process.env.SECRET_KEY as string,
          { expiresIn: "30m" }
        );

        user.refreshToken = newRefreshToken;
        await user.save();

        return response.status(200).json({
          message: "Token refreshed successfully",
          credentials: {
            accessToken: accessToken,
            refreshToken: newRefreshToken,
          },
        });
      } catch (error) {
        return response.status(401).json({ message: "Invalid refresh token" });
      }
    }
  );

  application.get("/get-user-info", requireAuthE, async (request, response) => {
    const payload = jwt.verify(
      request.headers.authorization as string,
      process.env.SECRET_KEY as string
    );

    return response.status(200).json({
      message: "User info fetched successfully",
      user: payload,
    });
  });
};
