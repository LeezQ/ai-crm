export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 400
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "认证失败") {
    super(message, "AUTHENTICATION_ERROR", 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "没有权限") {
    super(message, "AUTHORIZATION_ERROR", 403);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "未找到资源") {
    super(message, "NOT_FOUND_ERROR", 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "资源冲突") {
    super(message, "CONFLICT_ERROR", 409);
    this.name = "ConflictError";
  }
}

export class ServerError extends AppError {
  constructor(message: string = "服务器错误") {
    super(message, "SERVER_ERROR", 500);
    this.name = "ServerError";
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new ServerError(error.message);
  }

  return new ServerError("未知错误");
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "未知错误";
}

export function getErrorCode(error: unknown): string {
  if (error instanceof AppError) {
    return error.code;
  }
  return "UNKNOWN_ERROR";
}

export function getErrorStatus(error: unknown): number {
  if (error instanceof AppError) {
    return error.status;
  }
  return 500;
}
