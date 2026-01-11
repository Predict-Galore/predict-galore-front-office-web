/**
 * AUTH VALIDATORS
 *
 * Business logic validators for authentication
 */

/**
 * Validate login credentials
 */
export function validateLoginCredentials(
  username: string,
  password: string
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!username || username.trim().length === 0) {
    errors.push('Username or email is required');
  }

  if (!password || password.length === 0) {
    errors.push('Password is required');
  }

  if (username && username.length > 100) {
    errors.push('Username must be less than 100 characters');
  }

  if (password && password.length > 50) {
    errors.push('Password must be less than 50 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate registration data
 */
export function validateRegistrationData(data: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}): {
  isValid: boolean;
  errors: Record<string, string[]>;
} {
  const errors: Record<string, string[]> = {};

  // First name validation
  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.firstName = ['First name is required'];
  } else if (data.firstName.length > 50) {
    errors.firstName = ['First name must be less than 50 characters'];
  } else if (!/^[a-zA-Z\s'-]+$/.test(data.firstName)) {
    errors.firstName = ['First name can only contain letters, spaces, hyphens, and apostrophes'];
  }

  // Last name validation
  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.lastName = ['Last name is required'];
  } else if (data.lastName.length > 50) {
    errors.lastName = ['Last name must be less than 50 characters'];
  } else if (!/^[a-zA-Z\s'-]+$/.test(data.lastName)) {
    errors.lastName = ['Last name can only contain letters, spaces, hyphens, and apostrophes'];
  }

  // Email validation
  if (!data.email || data.email.trim().length === 0) {
    errors.email = ['Email is required'];
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = ['Please enter a valid email address'];
  } else if (data.email.length > 100) {
    errors.email = ['Email must be less than 100 characters'];
  }

  // Phone number validation
  if (!data.phoneNumber || data.phoneNumber.trim().length === 0) {
    errors.phoneNumber = ['Phone number is required'];
  } else if (!/^\d+$/.test(data.phoneNumber)) {
    errors.phoneNumber = ['Phone number must contain only digits'];
  }

  // Password validation
  if (!data.password || data.password.length === 0) {
    errors.password = ['Password is required'];
  } else {
    const passwordErrors: string[] = [];
    if (data.password.length < 8) passwordErrors.push('Password must be at least 8 characters');
    if (data.password.length > 50) passwordErrors.push('Password must be less than 50 characters');
    if (!/[A-Z]/.test(data.password))
      passwordErrors.push('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(data.password))
      passwordErrors.push('Password must contain at least one lowercase letter');
    if (!/\d/.test(data.password)) passwordErrors.push('Password must contain at least one number');
    if (!/[@$!%*?&]/.test(data.password))
      passwordErrors.push('Password must contain at least one special character');

    if (passwordErrors.length > 0) {
      errors.password = passwordErrors;
    }
  }

  // Confirm password validation
  if (!data.confirmPassword || data.confirmPassword.length === 0) {
    errors.confirmPassword = ['Please confirm your password'];
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = ["Passwords don't match"];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
