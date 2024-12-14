import express, { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import env from "dotenv";
env.config();
import cors from "cors";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const app = express();
const port = 3000;
const jwt_secret: any = process.env.JWT_SECRET || "mysecrettoken";

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.post("/signup", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(404).json({
        message: `invalid credentials`,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: `E-mail already exists`,
      });
    }

    const response = await prisma.user.create({
      data: {
        email,
        password,
      },
    });

    return res.status(200).json({
      response,
      message: `Successfully signed up`,
    });
  } catch (error) {
    console.error(`Can't signup: ${error}`);
  }
});

app.post("/signin", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(404).json({
        message: `Invalid credentials`,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: `Please signup first.`,
      });
    }

    if (user?.password !== password) {
      return res.status(400).json({
        message: `Invalid password`,
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        id: user.id,
      },
      jwt_secret
    );

    return res.status(200).json({
      token: token,
      message: `Successfully signed in`,
    });
  } catch (error) {
    console.error(`Can't signin: ${error}`);
  }
});

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

function authMiddleware(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): any {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Authentication token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, jwt_secret) as {
      id: string;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: `Can't verify right now`,
    });
  }
}

app.post(
  "/create-todo",
  authMiddleware,
  async (req: CustomRequest, res: Response): Promise<any> => {
    const { title, description, completed } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: `invalid fields`,
      });
    }

    try {
      const userId = parseInt(req.user!.id);

      const response = await prisma.todo.create({
        data: {
          title,
          description,
          completed,
          user: {
            connect: { id: userId },
          },
        },
      });

      return res.status(200).json({
        response,
        message: `Create todo`,
      });
    } catch (error) {
      return res.status(400).json({
        message: `Can't create todo right now.`,
      });
    }
  }
);

app.get(
  "/get-todo",
  authMiddleware,
  async (req: CustomRequest, res: Response): Promise<any> => {
    const response = await prisma.todo.findMany({
      where: {
        userId: Number(req.user!.id),
      },
    });

    return res.status(200).json({
      response,
    });
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
