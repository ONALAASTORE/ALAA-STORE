/**
 * Phone number validation and WhatsApp deep-link formatting utilities for ON ALAA STORE.
 */

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  formattedDigits?: string;
}

/**
 * Validates a telephone number format (supports Lebanese local/international and general global formats).
 * Examples:
 *  - +961 71 135 241
 *  - +96171135241
 *  - 03 123 456
 *  - 71 135 241
 *  - +1 555 123 4567
 */
export function validatePhoneNumber(phoneNumber: string): PhoneValidationResult {
  if (!phoneNumber || !phoneNumber.trim()) {
    return {
      isValid: false,
      error: 'Phone number cannot be empty.',
    };
  }

  const trimmed = phoneNumber.trim();

  // Allowed characters: +, numbers, spaces, dashes, parentheses
  const allowedCharsRegex = /^\+?[0-9\s\-()]+$/;
  if (!allowedCharsRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Invalid characters. Only numbers, +, -, and spaces are allowed.',
    };
  }

  const digitsOnly = trimmed.replace(/\D/g, '');

  if (digitsOnly.length < 7) {
    return {
      isValid: false,
      error: 'Phone number is too short (minimum 7 digits).',
    };
  }

  if (digitsOnly.length > 15) {
    return {
      isValid: false,
      error: 'Phone number exceeds maximum length (maximum 15 digits).',
    };
  }

  return {
    isValid: true,
    formattedDigits: formatWhatsAppDigits(trimmed),
  };
}

/**
 * Normalizes phone numbers into international digits for WhatsApp (wa.me/DIGITS).
 * Handles Lebanese 8-digit local numbers (e.g. 03123456 -> 9613123456, 71135241 -> 96171135241).
 */
export function formatWhatsAppDigits(phone: string): string {
  if (!phone) return '96171135241';
  let digits = phone.replace(/\D/g, '');

  // Local Lebanese with leading zero (e.g. 03XXXXXX -> 9613XXXXXX, 071XXXXXX -> 96171XXXXXX)
  if (digits.startsWith('0') && (digits.length === 8 || digits.length === 9)) {
    digits = '961' + digits.slice(1);
  }
  // Local Lebanese 8-digit without country code (e.g. 71XXXXXX, 03XXXXXX)
  else if (digits.length === 8 && (digits.startsWith('3') || digits.startsWith('7') || digits.startsWith('8'))) {
    digits = '961' + digits;
  }

  return digits || '96171135241';
}

/**
 * Builds a direct wa.me link with encoded message.
 */
export function buildWhatsAppLink(phone: string, message?: string): string {
  const digits = formatWhatsAppDigits(phone);
  const baseUrl = `https://wa.me/${digits}`;
  if (!message) return baseUrl;
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

export { formatWhatsAppCartSummary, buildWhatsAppCartCheckoutLink } from './whatsapp';
export type { WhatsAppCartSummaryOptions } from './whatsapp';

