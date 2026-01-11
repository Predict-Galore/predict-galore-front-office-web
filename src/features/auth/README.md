# Authentication System

## Overview
Complete authentication system for Predict Galore frontend application with full user lifecycle management.

## Features
- User registration and login
- Password reset flow
- Email verification
- Protected routes with AuthGuard
- Authentication state management with Zustand

## Architecture
- **API Layer**: `api/` - HTTP requests and data fetching
- **Components**: `components/` - React components for auth forms
- **Model**: `model/` - State management and types
- **Lib**: `lib/` - Utilities, transformers, validators
- **Validations**: `validations/` - Zod schemas for form validation

## Pages
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form
- `/verify-email` - Email verification

## Components
- `AuthGuard` - Route protection wrapper
- `LoginForm` - Login form component
- `RegisterForm` - Registration form component
- `ForgotPasswordForm` - Password reset request form
- `ResetPasswordForm` - Password reset form
- `VerifyEmailForm` - Email verification form

## API Integration
- Login endpoint
- Register endpoint
- Password reset request
- Password reset confirmation
- Email verification
- Logout functionality

## State Management
Uses Zustand store for authentication state:
- User data
- Authentication status
- Login/logout actions
- Token management
