/**
 * Settings Tab Component
 * Updated to match Figma UI design
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
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
} from '@mui/material';
import {
  CheckCircle,
  Lock,
  Info,
} from 'lucide-react';
import {
  Close,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  useChangePassword,
  useToggleTwoFactorAuth,
  useNotificationSettings,
} from '@/features/profile';
import { Button, Alert } from '@/shared/components/ui';

const SettingsTab: React.FC = () => {
  const { data: notificationSettings } = useNotificationSettings();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();
  const { mutate: toggle2FA } = useToggleTwoFactorAuth();

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [quoteboardEnabled, setQuoteboardEnabled] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Notification settings - initialize from backend
  const [predictionInsights, setPredictionInsights] = useState({ inApp: true, push: false });
  const [matchUpdates, setMatchUpdates] = useState({ inApp: true, push: false });
  const [newsAlerts, setNewsAlerts] = useState({ inApp: true, push: false });

  // Load notification settings from backend
  useEffect(() => {
    if (notificationSettings) {
      setPredictionInsights(
        notificationSettings.predictionInsights || { inApp: true, push: false }
      );
      setMatchUpdates(notificationSettings.matchUpdates || { inApp: true, push: false });
      setNewsAlerts(notificationSettings.newsAlerts || { inApp: true, push: false });
    }
  }, [notificationSettings]);

  // Check for success message in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('passwordChanged') === 'true') {
      setShowSuccessMessage(true);
    }
  }, []);

  const calculatePasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (strength === 3) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (strength === 4) return { strength: 3, label: 'Good', color: 'bg-blue-500' };
    return { strength: 5, label: 'Very strong', color: 'bg-green-500' };
  };

  const passwordStrength = calculatePasswordStrength(newPassword);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

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

  const handleToggle2FA = useCallback(
    (enabled: boolean) => {
      setIs2FAEnabled(enabled);
      toggle2FA(enabled);
    },
    [toggle2FA]
  );

  return (
    <div className="space-y-6">
      {showSuccessMessage && (
        <Alert
          variant="success"
          onClose={() => setShowSuccessMessage(false)}
        >
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            <span className="font-bold">Password Changed successfully</span>
          </div>
        </Alert>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
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
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">
            Notification
          </h3>
          <p className="text-sm text-gray-600">
            Get notifications to find out what&apos;s going on when you&apos;re not in app. You can
            turn them off anytime.
          </p>

          <NotifyGroup
            title="Prediction Insights"
            description="Receive notifications for new predictions and prediction results"
            state={predictionInsights}
            onChange={setPredictionInsights}
          />

          <NotifyGroup
            title="Match & Live Updates"
            description="Receive notifications for score updates, goal scorers, kickoff and match summary"
            state={matchUpdates}
            onChange={setMatchUpdates}
          />

          <NotifyGroup
            title="News Alerts"
            description="Receive notifications for latest news on players, teams and leagues you follow"
            state={newsAlerts}
            onChange={setNewsAlerts}
          />
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog
        open={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: 'rounded-lg',
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
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
                startAdornment: <Lock className="text-gray-400 mr-2" />,
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
                startAdornment: <Lock className="text-gray-400 mr-2" />,
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Box
                      key={level}
                      sx={{
                        height: 4,
                        flex: 1,
                        borderRadius: 1,
                        bgcolor: level <= passwordStrength.strength
                          ? passwordStrength.color.replace('bg-', '')
                          : 'grey.300',
                      }}
                    />
                  ))}
                </Box>
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {passwordStrength.label}
                </Typography>
              </Box>
            )}
            <TextField
              fullWidth
              label="Confirm password"
              type={showPassword.confirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!confirmPassword && !passwordsMatch}
              InputProps={{
                startAdornment: <Lock className="text-gray-400 mr-2" />,
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                <CheckCircle fontSize="small" />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  Password matches
                </Typography>
              </Box>
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
            className="normal-case bg-green-600 text-white hover:bg-green-700"
          >
            {isChangingPassword ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SettingsTab;

interface RowWithButtonProps {
  title: string;
  buttonLabel: string;
  onClick: () => void;
}

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

interface RowWithSwitchProps {
  title: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

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

interface NotifyGroupProps {
  title: string;
  description: string;
  state: { inApp: boolean; push: boolean };
  onChange: (val: { inApp: boolean; push: boolean }) => void;
}

const NotifyGroup: React.FC<NotifyGroupProps> = ({ title, description, state, onChange }) => (
  <Stack spacing={1.5} sx={{ borderBottom: '1px solid #f1f1f1', pb: 2 }}>
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

interface RowToggleProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

const RowToggle: React.FC<RowToggleProps> = ({ label, checked, onChange }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Typography variant="body1" sx={{ fontWeight: 500, color: '#1f2937' }}>
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
