/**
 * AUTH TRANSFORMERS
 *
 * Data transformation utilities for authentication feature
 */

import type { User } from '@/shared/types';
import type { LocalUser } from '../api/types';

/**
 * Transform LocalUser from API to User domain model
 */
export function transformLocalUserToUser(localUser: LocalUser): User {
  return {
    id: localUser.id,
    email: localUser.email,
    firstName: localUser.firstName,
    lastName: localUser.lastName,
    isEmailVerified: localUser.isEmailVerified,
    phoneNumber: localUser.phoneNumber,
    countryCode: localUser.countryCode,
    role: 'user',
    createdAt: localUser.createdAt || new Date().toISOString(),
    updatedAt: localUser.updatedAt || new Date().toISOString(),
  };
}

/**
 * Transform User to LocalUser for API requests
 */
export function transformUserToLocalUser(user: User): LocalUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isEmailVerified: user.isEmailVerified,
    phoneNumber: user.phoneNumber,
    countryCode: user.countryCode,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Transform login form data to API request
 */
export function transformLoginFormToRequest(data: {
  username: string;
  password: string;
  rememberMe?: boolean;
}): { username: string; password: string; rememberMe?: boolean } {
  return {
    username: data.username.trim(),
    password: data.password,
    rememberMe: data.rememberMe,
  };
}

/**
 * Transform register form data to API request
 */
export function transformRegisterFormToRequest(data: {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  userTypeId?: number;
}): {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  userTypeId: number;
} {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.toLowerCase().trim(),
    phoneNumber: data.phoneNumber.replace(/\D/g, ''),
    countryCode: data.countryCode,
    password: data.password,
    userTypeId: data.userTypeId || 2,
  };
}
