/**
 * Settings Tab Component
 * Manages user settings including password, 2FA, and notifications
 *
 * @component
 * @description Provides interface for users to manage their account settings,
 * change password, enable two-factor authentication, and configure notification preferences.
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Box,
  Stack,
  Switch,
  Paper,
  Alert as MuiAlert,
  AlertTitle,
} from '@mui/material';
import { CheckCircle, Lock, Info } from 'lucide-react';
import { Close, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  useChangePassword,
  useToggleTwoFactorAuth,
} from '@/features/profile';
import { Button } from '@/shared/components/ui';

/**
 * Password strength calculation result
 */
interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
}

/**
 * Notification state for a specific category
 */
interface NotificationState {
  inApp: boolean;
  push: boolean;
}

/**
 * SettingsTab Component
 *
 * Main settings interface for user account management.
 * Includes password management, 2FA, and notification preferences.
 *
 * @example
 * ```tsx
 * <SettingsTab />
 * ```
 */
const SettingsTab: React.FC = () => {
  // Notification settings are managed locally — no backend endpoint exists for this
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();
  const { mutate: toggle2FA } = useToggleTwoFactorAuth();

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [quoteboardEnabled, setQuoteboardEnabled] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(() => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('passwordChanged') === 'true';
  });

  const defaultNotifyState: NotificationState = { inApp: true, push: false };

  // Notification settings - use backend values as defaults, and keep local overrides when changed.
  const [predictionInsightsOverride, setPredictionInsightsOverride] =
    useState<NotificationState | null>(null);
  const [matchUpdatesOverride, setMatchUpdatesOverride] = useState<NotificationState | null>(null);
  const [newsAlertsOverride, setNewsAlertsOverride] = useState<NotificationState | null>(null);

  const predictionInsights = predictionInsightsOverride ?? defaultNotifyState;
  const matchUpdates = matchUpdatesOverride ?? defaultNotifyState;
  const newsAlerts = newsAlertsOverride ?? defaultNotifyState;

  /**
   * Calculates password strength based on various criteria
   */
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength: 1, label: 'Weak', color: 'error.main' };
    if (strength === 3) return { strength: 2, label: 'Fair', color: 'warning.main' };
    if (strength === 4) return { strength: 3, label: 'Good', color: 'info.main' };
    return { strength: 5, label: 'Very strong', color: 'success.main' };
  };

  const passwordStrength = calculatePasswordStrength(newPassword);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  /**
   * Handles password change submission
   */
  const handleChangePassword = useCallback(() => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    changePassword(
      {
        oldPassword,
        newPassword,
        confirmPassword,
      },
      {
        onSuccess: () => {
          setIsPasswordDialogOpen(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setShowSuccessMessage(true);
        },
      }
    );
  }, [oldPassword, newPassword, confirmPassword, changePassword]);

  /**
   * Handles 2FA toggle
   */
  const handleToggle2FA = useCallback(
    (enabled: boolean) => {
      setIs2FAEnabled(enabled);
      toggle2FA(enabled);
    },
    [toggle2FA]
  );

  return (
    <Stack spacing={3}>
      {/* Success Message Banner */}
      {showSuccessMessage && (
        <MuiAlert
          severity="success"
          onClose={() => setShowSuccessMessage(false)}
          sx={{ borderRadius: 2 }}
        >
          <AlertTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info size={20} />
            Password Changed successfully
          </AlertTitle>
        </MuiAlert>
      )}

      {/* Settings Options */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.200',
          overflow: 'hidden',
        }}
      >
        <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'grey.200' }} />}>
          <RowWithButton
            title="Change Your Password"
            buttonLabel="Change"
            onClick={() => setIsPasswordDialogOpen(true)}
          />
          <RowWithSwitch
            title="Enable Two Factor Authentication (2FA)"
            checked={is2FAEnabled}
            onChange={(val) => handleToggle2FA(val)}
          />
          <RowWithSwitch
            title="Quoteboard"
            checked={quoteboardEnabled}
            onChange={(val) => setQuoteboardEnabled(val)}
          />
        </Stack>
      </Paper>

      {/* Notification Settings */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
            Notification
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.600' }}>
            Get notifications to find out what&apos;s going on when you&apos;re not in app. You can
            turn them off anytime.
          </Typography>

          <NotifyGroup
            title="Prediction Insights"
            description="Receive notifications for new predictions and prediction results"
            state={predictionInsights}
            onChange={(val) => setPredictionInsightsOverride(val)}
          />

          <NotifyGroup
            title="Match & Live Updates"
            description="Receive notifications for score updates, goal scorers, kickoff and match summary"
            state={matchUpdates}
            onChange={(val) => setMatchUpdatesOverride(val)}
          />

          <NotifyGroup
            title="News Alerts"
            description="Receive notifications for latest news on players, teams and leagues you follow"
            state={newsAlerts}
            onChange={(val) => setNewsAlertsOverride(val)}
          />
        </Stack>
      </Paper>

      {/* Change Password Dialog */}
      <Dialog
        open={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3,
            pb: 2,
          }}
        >
          <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 'bold' }}>
            Change Password
          </Typography>
          <IconButton onClick={() => setIsPasswordDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 2 }}>
          <Stack spacing={2} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Current password"
              type={showPassword.old ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              InputProps={{
                startAdornment: <Lock size={20} style={{ marginRight: 8, color: '#9ca3af' }} />,
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword((prev) => ({ ...prev, old: !prev.old }))}
                    edge="end"
                  >
                    {showPassword.old ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              fullWidth
              label="New password"
              type={showPassword.new ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                startAdornment: <Lock size={20} style={{ marginRight: 8, color: '#9ca3af' }} />,
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                    edge="end"
                  >
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            {newPassword && (
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={0.5}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Box
                      key={level}
                      sx={{
                        height: 4,
                        flex: 1,
                        borderRadius: 1,
                        bgcolor:
                          level <= passwordStrength.strength ? passwordStrength.color : 'grey.300',
                      }}
                    />
                  ))}
                </Stack>
                <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                  {passwordStrength.label}
                </Typography>
              </Stack>
            )}
            <TextField
              fullWidth
              label="Confirm password"
              type={showPassword.confirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!confirmPassword && !passwordsMatch}
              InputProps={{
                startAdornment: <Lock size={20} style={{ marginRight: 8, color: '#9ca3af' }} />,
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                    edge="end"
                  >
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            {confirmPassword && passwordsMatch && (
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', color: 'success.main' }}
              >
                <CheckCircle size={16} />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  Password matches
                </Typography>
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setIsPasswordDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleChangePassword}
            variant="primary"
            disabled={
              isChangingPassword ||
              !oldPassword ||
              !newPassword ||
              !confirmPassword ||
              !passwordsMatch
            }
            sx={{
              textTransform: 'none',
              bgcolor: 'success.main',
              color: 'white',
              '&:hover': { bgcolor: 'success.dark' },
            }}
          >
            {isChangingPassword ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default SettingsTab;

/**
 * Props for RowWithButton component
 */
interface RowWithButtonProps {
  /** Title text to display */
  title: string;
  /** Button label text */
  buttonLabel: string;
  /** Click handler for the button */
  onClick: () => void;
}

/**
 * RowWithButton Component
 *
 * Displays a row with a title and action button.
 * Used for settings options that trigger actions.
 */

const RowWithButton: React.FC<RowWithButtonProps> = ({ title, buttonLabel, onClick }) => (
  <Box
    sx={{
      px: { xs: 2, md: 3 },
      py: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Button
      onClick={onClick}
      variant="outline"
      sx={{
        textTransform: 'none',
        fontWeight: 700,
        borderWidth: 2,
        px: 3,
        borderRadius: 2,
        '&:hover': {
          borderWidth: 2,
          bgcolor: 'green.50',
        },
      }}
    >
      {buttonLabel}
    </Button>
  </Box>
);

/**
 * Props for RowWithSwitch component
 */
interface RowWithSwitchProps {
  /** Title text to display */
  title: string;
  /** Current checked state */
  checked: boolean;
  /** Change handler for the switch */
  onChange: (val: boolean) => void;
}

/**
 * RowWithSwitch Component
 *
 * Displays a row with a title and toggle switch.
 * Used for settings options that can be enabled/disabled.
 */
const RowWithSwitch: React.FC<RowWithSwitchProps> = ({ title, checked, onChange }) => (
  <Box
    sx={{
      px: { xs: 2, md: 3 },
      py: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Switch
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      color="success"
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': { color: '#19910c' },
        '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#9ae6b4' },
      }}
    />
  </Box>
);

/**
 * Props for NotifyGroup component
 */
interface NotifyGroupProps {
  /** Title of the notification category */
  title: string;
  /** Description of what notifications are included */
  description: string;
  /** Current notification state */
  state: NotificationState;
  /** Change handler for notification state */
  onChange: (val: NotificationState) => void;
}

/**
 * NotifyGroup Component
 *
 * Displays a notification category with in-app and push notification toggles.
 * Groups related notification settings together.
 */
const NotifyGroup: React.FC<NotifyGroupProps> = ({ title, description, state, onChange }) => (
  <Stack
    spacing={1.5}
    sx={{
      borderBottom: '1px solid',
      borderColor: 'grey.100',
      pb: 2,
    }}
  >
    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
    <Stack spacing={1}>
      <RowToggle
        label="In-app Notifications"
        checked={state.inApp}
        onChange={(val) => onChange({ ...state, inApp: val })}
      />
      <RowToggle
        label="Push Notifications"
        checked={state.push}
        onChange={(val) => onChange({ ...state, push: val })}
      />
    </Stack>
  </Stack>
);

/**
 * Props for RowToggle component
 */
interface RowToggleProps {
  /** Label text to display */
  label: string;
  /** Current checked state */
  checked: boolean;
  /** Change handler for the toggle */
  onChange: (val: boolean) => void;
}

/**
 * RowToggle Component
 *
 * Displays a simple row with a label and toggle switch.
 * Used for individual notification type toggles.
 */
const RowToggle: React.FC<RowToggleProps> = ({ label, checked, onChange }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Typography variant="body1" sx={{ fontWeight: 500, color: 'grey.800' }}>
      {label}
    </Typography>
    <Switch
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      color="success"
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': { color: '#19910c' },
        '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#9ae6b4' },
      }}
    />
  </Box>
);
