import { toast } from "sonner";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface NotificationOptions {
  duration?: number;
  position?:
    | "top"
    | "top-right"
    | "top-left"
    | "bottom"
    | "bottom-right"
    | "bottom-left";
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function showNotification(
  message: string,
  type: NotificationType = "info",
  options: NotificationOptions = {}
) {
  const { duration = 3000, position = "top-right", action } = options;

  switch (type) {
    case "success":
      toast.success(message, {
        duration,
        position,
        action,
      });
      break;
    case "error":
      toast.error(message, {
        duration,
        position,
        action,
      });
      break;
    case "warning":
      toast.warning(message, {
        duration,
        position,
        action,
      });
      break;
    default:
      toast.info(message, {
        duration,
        position,
        action,
      });
  }
}

export function showSuccess(message: string, options?: NotificationOptions) {
  showNotification(message, "success", options);
}

export function showError(message: string, options?: NotificationOptions) {
  showNotification(message, "error", options);
}

export function showWarning(message: string, options?: NotificationOptions) {
  showNotification(message, "warning", options);
}

export function showInfo(message: string, options?: NotificationOptions) {
  showNotification(message, "info", options);
}

export function showLoading(message: string = "加载中...") {
  return toast.loading(message);
}

export function dismissLoading(toastId: string) {
  toast.dismiss(toastId);
}

export function showPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
}

export function showCustom(
  message: string,
  options: NotificationOptions & {
    icon?: React.ReactNode;
    className?: string;
  } = {}
) {
  const { icon, className, ...restOptions } = options;
  toast(message, {
    icon,
    className,
    ...restOptions,
  });
}

export function dismissAll() {
  toast.dismiss();
}

export function dismiss(toastId: string) {
  toast.dismiss(toastId);
}
