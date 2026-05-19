import emailjs from '@emailjs/browser';

const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';

const isEmailJsConfigured = Boolean(
  EMAILJS_PUBLIC_KEY &&
  EMAILJS_SERVICE_ID &&
  EMAILJS_TEMPLATE_ID
);

if (isEmailJsConfigured) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

interface SendResetEmailParams {
  email: string;
  name: string;
  resetLink: string;
}

interface SendResetEmailResponse {
  success: boolean;
  message: string;
}

export const generateResetToken = (): string => {
  throw new Error('Reset token tidak boleh dibuat di browser. Gunakan proses admin/backend.');
};

export const sendResetEmail = async (_params: SendResetEmailParams): Promise<SendResetEmailResponse> => {
  return {
    success: false,
    message: 'Reset password dinonaktifkan dari sisi publik. Silakan hubungi admin kampus.'
  };
};

export const checkEmailExists = (_email: string): boolean => false;

export const verifyResetToken = (_token: string): boolean => false;

export const resetPassword = (_email: string, _token: string, _newPassword: string): boolean => false;
