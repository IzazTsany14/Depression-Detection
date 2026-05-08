import emailjs from 'emailjs-com';

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

/**
 * Generate a temporary password reset token (valid for 24 hours)
 */
export const generateResetToken = (): string => {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expireTime = Date.now() + 24 * 60 * 60 * 1000;

  const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
  resetTokens[token] = {
    createdAt: Date.now(),
    expiresAt: expireTime
  };
  localStorage.setItem('resetTokens', JSON.stringify(resetTokens));

  return token;
};

/**
 * Send password reset email via EmailJS when configured, with localStorage fallback.
 */
export const sendResetEmail = async (params: SendResetEmailParams): Promise<SendResetEmailResponse> => {
  try {
    const resetToken = generateResetToken();
    const resetLink = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(params.email)}`;

    const passwordResets = JSON.parse(localStorage.getItem('passwordResets') || '{}');
    passwordResets[params.email] = {
      token: resetToken,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      resetLink,
      name: params.name,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('passwordResets', JSON.stringify(passwordResets));

    if (isEmailJsConfigured) {
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          to_email: params.email,
          to_name: params.name,
          reset_link: resetLink,
          message: `Silakan klik link di bawah untuk mereset password Anda:\n${resetLink}\n\nLink ini berlaku selama 24 jam.`
        });
      } catch (emailError) {
        console.info('EmailJS failed, using localStorage fallback mode', emailError);
      }
    } else {
      console.info('EmailJS env is incomplete, using localStorage fallback mode');
    }

    return {
      success: true,
      message: `Link reset password telah dikirim ke ${params.email}. Silakan cek email Anda dan ikuti instruksi.`
    };
  } catch (error) {
    console.error('Error sending reset email:', error);
    return {
      success: false,
      message: 'Gagal mengirim link reset password. Silakan coba lagi nanti.'
    };
  }
};

/**
 * Check if user email exists in registered users
 */
export const checkEmailExists = (email: string): boolean => {
  try {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const adminUsers = JSON.parse(localStorage.getItem('adminAddedUsers') || '[]');
    const allUsers = [...registeredUsers, ...adminUsers];

    return allUsers.some((user: any) => user.email.toLowerCase() === email.toLowerCase());
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};

/**
 * Verify reset token validity
 */
export const verifyResetToken = (token: string): boolean => {
  try {
    const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
    const tokenData = resetTokens[token];

    if (!tokenData) return false;

    if (tokenData.expiresAt < Date.now()) {
      delete resetTokens[token];
      localStorage.setItem('resetTokens', JSON.stringify(resetTokens));
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};

/**
 * Reset password for user
 */
export const resetPassword = (email: string, token: string, newPassword: string): boolean => {
  try {
    if (!verifyResetToken(token)) {
      return false;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const adminUsers = JSON.parse(localStorage.getItem('adminAddedUsers') || '[]');

    let userFound = false;

    const updatedRegisteredUsers = registeredUsers.map((user: any) => {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        userFound = true;
        return { ...user, password: newPassword };
      }
      return user;
    });

    let updatedAdminUsers = adminUsers;
    if (!userFound) {
      updatedAdminUsers = adminUsers.map((user: any) => {
        if (user.email.toLowerCase() === email.toLowerCase()) {
          userFound = true;
          return { ...user, password: newPassword };
        }
        return user;
      });
    }

    if (userFound) {
      localStorage.setItem('registeredUsers', JSON.stringify(updatedRegisteredUsers));
      localStorage.setItem('adminAddedUsers', JSON.stringify(updatedAdminUsers));

      const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
      delete resetTokens[token];
      localStorage.setItem('resetTokens', JSON.stringify(resetTokens));

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error resetting password:', error);
    return false;
  }
};
