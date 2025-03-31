import { Context } from "hono";
import { db } from "../utils/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { signToken } from "../utils/jwt";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const login = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { email, password } = loginSchema.parse(body);

    console.log(email, password);

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return c.json(
        {
          success: false,
          message: "邮箱或密码错误",
        },
        401
      );
    }

    if (user.status !== "active") {
      return c.json(
        {
          success: false,
          message: "账号已被禁用",
        },
        403
      );
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      return c.json(
        {
          success: false,
          message: "邮箱或密码错误",
        },
        401
      );
    }

    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return c.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          message: "请求参数错误",
        },
        400
      );
    }
    return c.json(
      {
        success: false,
        message: "服务器错误",
      },
      500
    );
  }
};

export const getProfile = async (c: Context) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, c.get("user").id),
      columns: {
        id: true,
        username: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      return c.json({ error: "用户不存在" }, 404);
    }

    return c.json(user);
  } catch (error) {
    return c.json({ error: "获取用户信息失败" }, 500);
  }
};
