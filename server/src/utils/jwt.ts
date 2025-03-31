import jwt from "jsonwebtoken";

export type User = {
  id: number;
  email: string;
  name: string;
  role: string;
};

export const signToken = (payload: User) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): User => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as User;
};
