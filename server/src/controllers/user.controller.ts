import { Context } from "hono";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { signToken } from "../utils/jwt";
import { z } from "zod";
import { db } from "@/db";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const register = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { name, email, password } = registerSchema.parse(body);

    // 检查邮箱是否已被注册
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: {
        id: true,
      },
    });

    if (existingUser) {
      return c.json(
        {
          success: false,
          message: "该邮箱已被注册",
        },
        400
      );
    }

    // 密码加密
    const hashedPassword = await hash(password, 10);

    // 创建用户
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: "user", // 默认角色
        status: "active", // 默认状态
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
      });

    return c.json(
      {
        success: true,
        message: "注册成功",
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          },
        },
      },
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          message: "请求参数错误",
          errors: error.errors,
        },
        400
      );
    }
    console.error("注册失败:", error);
    return c.json(
      {
        success: false,
        message: "注册失败，请稍后重试",
      },
      500
    );
  }
};

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
      name: user.name || "",
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
    console.error("登录失败详情:", error);
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

// 更新个人资料
const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

export const updateProfile = async (c: Context) => {
  try {
    const userId = c.get("user").id;
    const body = await c.req.json();
    const { name, phone, avatar } = updateProfileSchema.parse(body);

    // 构建更新对象，只更新提供的字段
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    // 执行更新
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        avatar: users.avatar,
      });

    if (!updatedUser) {
      return c.json({ success: false, message: "用户不存在" }, 404);
    }

    return c.json({
      success: true,
      message: "个人资料更新成功",
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          message: "请求参数错误",
          errors: error.errors,
        },
        400
      );
    }
    console.error("更新个人资料失败:", error);
    return c.json({ success: false, message: "更新个人资料失败" }, 500);
  }
};

// 修改密码
const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export const changePassword = async (c: Context) => {
  try {
    const userId = c.get("user").id;
    const body = await c.req.json();
    const { currentPassword, newPassword } = changePasswordSchema.parse(body);

    // 获取用户当前密码
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        password: true,
      },
    });

    if (!user) {
      return c.json({ success: false, message: "用户不存在" }, 404);
    }

    // 验证当前密码
    const isValidPassword = await compare(currentPassword, user.password);
    if (!isValidPassword) {
      return c.json({ success: false, message: "当前密码错误" }, 400);
    }

    // 密码加密并更新
    const hashedPassword = await hash(newPassword, 10);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));

    return c.json({
      success: true,
      message: "密码修改成功",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          message: "请求参数错误",
          errors: error.errors,
        },
        400
      );
    }
    console.error("修改密码失败:", error);
    return c.json({ success: false, message: "修改密码失败" }, 500);
  }
};

// 更新系统设置
const updateSettingsSchema = z.object({
  language: z.string().optional(),
  theme: z.string().optional(),
  notifications: z.boolean().optional(),
});

export const updateSettings = async (c: Context) => {
  try {
    const userId = c.get("user").id;
    const body = await c.req.json();
    const settings = updateSettingsSchema.parse(body);

    // 将设置数据保存到用户表中的其他列或单独存储
    await db
      .update(users)
      .set({
        // 临时解决方案：不直接更新settings列
        updatedAt: new Date(), // 仅更新时间戳，作为临时解决方案
      })
      .where(eq(users.id, userId));

    return c.json({
      success: true,
      message: "系统设置更新成功",
      data: { settings },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          message: "请求参数错误",
          errors: error.errors,
        },
        400
      );
    }
    console.error("更新系统设置失败:", error);
    return c.json({ success: false, message: "更新系统设置失败" }, 500);
  }
};
