import { AuthorizationError } from "./error";

export type Permission = string;
export type Role = string;

export interface UserPermissions {
  roles: Role[];
  permissions: Permission[];
}

export class PermissionManager {
  private static instance: PermissionManager;
  private userPermissions: UserPermissions | null = null;

  private constructor() {}

  static getInstance(): PermissionManager {
    if (!PermissionManager.instance) {
      PermissionManager.instance = new PermissionManager();
    }
    return PermissionManager.instance;
  }

  setUserPermissions(permissions: UserPermissions): void {
    this.userPermissions = permissions;
  }

  clearUserPermissions(): void {
    this.userPermissions = null;
  }

  hasPermission(permission: Permission): boolean {
    if (!this.userPermissions) {
      return false;
    }
    return this.userPermissions.permissions.includes(permission);
  }

  hasRole(role: Role): boolean {
    if (!this.userPermissions) {
      return false;
    }
    return this.userPermissions.roles.includes(role);
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  hasAnyRole(roles: Role[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  hasAllRoles(roles: Role[]): boolean {
    return roles.every((role) => this.hasRole(role));
  }

  checkPermission(permission: Permission): void {
    if (!this.hasPermission(permission)) {
      throw new AuthorizationError("没有权限执行此操作");
    }
  }

  checkRole(role: Role): void {
    if (!this.hasRole(role)) {
      throw new AuthorizationError("没有角色执行此操作");
    }
  }

  checkAnyPermission(permissions: Permission[]): void {
    if (!this.hasAnyPermission(permissions)) {
      throw new AuthorizationError("没有权限执行此操作");
    }
  }

  checkAllPermissions(permissions: Permission[]): void {
    if (!this.hasAllPermissions(permissions)) {
      throw new AuthorizationError("没有权限执行此操作");
    }
  }

  checkAnyRole(roles: Role[]): void {
    if (!this.hasAnyRole(roles)) {
      throw new AuthorizationError("没有角色执行此操作");
    }
  }

  checkAllRoles(roles: Role[]): void {
    if (!this.hasAllRoles(roles)) {
      throw new AuthorizationError("没有角色执行此操作");
    }
  }
}

export const permissionManager = PermissionManager.getInstance();

export function usePermission() {
  const hasPermission = (permission: Permission): boolean => {
    return permissionManager.hasPermission(permission);
  };

  const hasRole = (role: Role): boolean => {
    return permissionManager.hasRole(role);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissionManager.hasAnyPermission(permissions);
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissionManager.hasAllPermissions(permissions);
  };

  const hasAnyRole = (roles: Role[]): boolean => {
    return permissionManager.hasAnyRole(roles);
  };

  const hasAllRoles = (roles: Role[]): boolean => {
    return permissionManager.hasAllRoles(roles);
  };

  const checkPermission = (permission: Permission): void => {
    permissionManager.checkPermission(permission);
  };

  const checkRole = (role: Role): void => {
    permissionManager.checkRole(role);
  };

  const checkAnyPermission = (permissions: Permission[]): void => {
    permissionManager.checkAnyPermission(permissions);
  };

  const checkAllPermissions = (permissions: Permission[]): void => {
    permissionManager.checkAllPermissions(permissions);
  };

  const checkAnyRole = (roles: Role[]): void => {
    permissionManager.checkAnyRole(roles);
  };

  const checkAllRoles = (roles: Role[]): void => {
    permissionManager.checkAllRoles(roles);
  };

  return {
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    hasAnyRole,
    hasAllRoles,
    checkPermission,
    checkRole,
    checkAnyPermission,
    checkAllPermissions,
    checkAnyRole,
    checkAllRoles,
  };
}
