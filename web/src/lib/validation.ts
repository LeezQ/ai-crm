export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{4,16}$/;
  return usernameRegex.test(username);
}

export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidDate(date: string): boolean {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

export function isValidNumber(value: string): boolean {
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
}

export function isValidInteger(value: string): boolean {
  return /^\d+$/.test(value);
}

export function isValidDecimal(value: string, decimals: number = 2): boolean {
  const regex = new RegExp(`^\\d+(\\.\\d{1,${decimals}})?$`);
  return regex.test(value);
}

export function isValidChineseName(name: string): boolean {
  const nameRegex = /^[\u4e00-\u9fa5]{2,4}$/;
  return nameRegex.test(name);
}

export function isValidIDCard(idCard: string): boolean {
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return idCardRegex.test(idCard);
}

export function isValidPostalCode(postalCode: string): boolean {
  const postalCodeRegex = /^[1-9]\d{5}$/;
  return postalCodeRegex.test(postalCode);
}

export function isValidBankCard(bankCard: string): boolean {
  const bankCardRegex = /^[1-9]\d{9,29}$/;
  return bankCardRegex.test(bankCard);
}

export function isValidIP(ip: string): boolean {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) return false;

  const parts = ip.split(".");
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
}

export function isValidMAC(mac: string): boolean {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac);
}
