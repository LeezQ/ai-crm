import { getItem, setItem } from "./storage";

export type Locale = "zh-CN" | "en-US";

export interface Translation {
  [key: string]: string | Translation;
}

export interface I18nConfig {
  defaultLocale: Locale;
  locales: Locale[];
  translations: Record<Locale, Translation>;
}

class I18nManager {
  private static instance: I18nManager;
  private config: I18nConfig;
  private currentLocale: Locale;

  private constructor(config: I18nConfig) {
    this.config = config;
    this.currentLocale = getItem("locale", config.defaultLocale);
  }

  static getInstance(config: I18nConfig): I18nManager {
    if (!I18nManager.instance) {
      I18nManager.instance = new I18nManager(config);
    }
    return I18nManager.instance;
  }

  setLocale(locale: Locale): void {
    if (!this.config.locales.includes(locale)) {
      throw new Error(`不支持的语言: ${locale}`);
    }
    this.currentLocale = locale;
    setItem("locale", locale);
  }

  getLocale(): Locale {
    return this.currentLocale;
  }

  getAvailableLocales(): Locale[] {
    return this.config.locales;
  }

  translate(key: string, params: Record<string, string | number> = {}): string {
    const keys = key.split(".");
    let value: any = this.config.translations[this.currentLocale];

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    return value.replace(/\{(\w+)\}/g, (_, key) => {
      return String(params[key] || `{${key}}`);
    });
  }

  formatDate(
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {}
  ): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(this.currentLocale, options).format(dateObj);
  }

  formatNumber(number: number, options: Intl.NumberFormatOptions = {}): string {
    return new Intl.NumberFormat(this.currentLocale, options).format(number);
  }

  formatCurrency(amount: number, currency: string = "CNY"): string {
    return this.formatNumber(amount, {
      style: "currency",
      currency,
    });
  }

  formatPercent(value: number): string {
    return this.formatNumber(value, {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  formatRelativeTime(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return this.translate("time.daysAgo", { days });
    }
    if (hours > 0) {
      return this.translate("time.hoursAgo", { hours });
    }
    if (minutes > 0) {
      return this.translate("time.minutesAgo", { minutes });
    }
    return this.translate("time.justNow");
  }
}

export const i18n = I18nManager.getInstance({
  defaultLocale: "zh-CN",
  locales: ["zh-CN", "en-US"],
  translations: {
    "zh-CN": {
      common: {
        loading: "加载中...",
        error: "出错了",
        success: "成功",
        confirm: "确认",
        cancel: "取消",
        save: "保存",
        delete: "删除",
        edit: "编辑",
        search: "搜索",
        filter: "筛选",
        sort: "排序",
        refresh: "刷新",
        more: "更多",
        back: "返回",
        next: "下一步",
        previous: "上一步",
        submit: "提交",
        reset: "重置",
      },
      time: {
        justNow: "刚刚",
        minutesAgo: "{minutes}分钟前",
        hoursAgo: "{hours}小时前",
        daysAgo: "{days}天前",
      },
      auth: {
        login: "登录",
        logout: "退出",
        register: "注册",
        forgotPassword: "忘记密码",
        resetPassword: "重置密码",
        email: "邮箱",
        password: "密码",
        confirmPassword: "确认密码",
        rememberMe: "记住我",
        loginSuccess: "登录成功",
        loginError: "登录失败",
        logoutSuccess: "退出成功",
        logoutError: "退出失败",
      },
      validation: {
        required: "{field}不能为空",
        email: "请输入有效的邮箱地址",
        minLength: "{field}不能少于{min}个字符",
        maxLength: "{field}不能超过{max}个字符",
        passwordMatch: "两次输入的密码不一致",
      },
      error: {
        network: "网络错误",
        server: "服务器错误",
        unauthorized: "未授权",
        forbidden: "禁止访问",
        notFound: "未找到",
        conflict: "冲突",
        validation: "验证失败",
      },
    },
    "en-US": {
      common: {
        loading: "Loading...",
        error: "Error",
        success: "Success",
        confirm: "Confirm",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        search: "Search",
        filter: "Filter",
        sort: "Sort",
        refresh: "Refresh",
        more: "More",
        back: "Back",
        next: "Next",
        previous: "Previous",
        submit: "Submit",
        reset: "Reset",
      },
      time: {
        justNow: "Just now",
        minutesAgo: "{minutes} minutes ago",
        hoursAgo: "{hours} hours ago",
        daysAgo: "{days} days ago",
      },
      auth: {
        login: "Login",
        logout: "Logout",
        register: "Register",
        forgotPassword: "Forgot Password",
        resetPassword: "Reset Password",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        rememberMe: "Remember me",
        loginSuccess: "Login successful",
        loginError: "Login failed",
        logoutSuccess: "Logout successful",
        logoutError: "Logout failed",
      },
      validation: {
        required: "{field} is required",
        email: "Please enter a valid email address",
        minLength: "{field} must be at least {min} characters",
        maxLength: "{field} must not exceed {max} characters",
        passwordMatch: "Passwords do not match",
      },
      error: {
        network: "Network error",
        server: "Server error",
        unauthorized: "Unauthorized",
        forbidden: "Forbidden",
        notFound: "Not found",
        conflict: "Conflict",
        validation: "Validation failed",
      },
    },
  },
});

export function useI18n() {
  const translate = (
    key: string,
    params: Record<string, string | number> = {}
  ): string => {
    return i18n.translate(key, params);
  };

  const setLocale = (locale: Locale): void => {
    i18n.setLocale(locale);
  };

  const getLocale = (): Locale => {
    return i18n.getLocale();
  };

  const getAvailableLocales = (): Locale[] => {
    return i18n.getAvailableLocales();
  };

  const formatDate = (
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {}
  ): string => {
    return i18n.formatDate(date, options);
  };

  const formatNumber = (
    number: number,
    options: Intl.NumberFormatOptions = {}
  ): string => {
    return i18n.formatNumber(number, options);
  };

  const formatCurrency = (amount: number, currency: string = "CNY"): string => {
    return i18n.formatCurrency(amount, currency);
  };

  const formatPercent = (value: number): string => {
    return i18n.formatPercent(value);
  };

  const formatRelativeTime = (date: Date | string): string => {
    return i18n.formatRelativeTime(date);
  };

  return {
    translate,
    setLocale,
    getLocale,
    getAvailableLocales,
    formatDate,
    formatNumber,
    formatCurrency,
    formatPercent,
    formatRelativeTime,
  };
}
