import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { User, AlertCircle } from 'lucide-react';
import {
  AuthShell,
  AuthCard,
  AuthInput,
  AuthPasswordInput,
  AuthButton,
  DemoPersonaPills,
} from '../../components/auth';
import { useAuth } from '../../context/AuthContext';
import { ScreenName, UserRole } from '../../types';
import { colors } from '../../theme/colors';

interface LoginScreenProps {
  onNavigate: (screen: ScreenName) => void;
  onLoginSuccess?: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigate,
  onLoginSuccess,
}) => {
  const { login, role } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setErrorMsg(null);
    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMsg('Please enter your mobile phone number or email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedInUser = await login(cleanId, password);
      const targetRole = loggedInUser?.role || role || 'FARMER';
      if (onLoginSuccess) {
        onLoginSuccess(targetRole);
      } else {
        if (targetRole === 'MIDDLEMAN') onNavigate('middleman_home');
        else if (targetRole === 'ADMIN') onNavigate('admin');
        else onNavigate('home');
      }
    } catch (err: any) {
      const msg = err?.message || 'Unable to sign in. Please verify your credentials.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setIdentifier(fillEmail);
    setPassword(fillPass);
    setErrorMsg(null);
  };

  return (
    <AuthShell onBackToHome={() => onNavigate('landing')}>
      <AuthCard
        badgeText="SECURE ACCESS"
        title="Welcome back"
        subtitle="Sign in to continue to your livestock dashboard."
      >
        {/* Error Notification Banner */}
        {errorMsg && (
          <View style={styles.errorBanner}>
            <AlertCircle size={18} color={colors.danger} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Input Fields */}
        <AuthInput
          label="Mobile Phone or Email"
          placeholder="e.g. +91 98765 43210 or farmer@vetra.in"
          value={identifier}
          onChangeText={(val) => {
            setIdentifier(val);
            if (errorMsg) setErrorMsg(null);
          }}
          icon={<User size={18} color={colors.primary} />}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          disabled={isSubmitting}
        />

        <AuthPasswordInput
          label="Password"
          placeholder="Enter your account password"
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            if (errorMsg) setErrorMsg(null);
          }}
          error={undefined}
        />

        {/* Primary Action CTA */}
        <AuthButton
          title="Log In →"
          loadingTitle="Signing in..."
          onPress={handleLogin}
          isLoading={isSubmitting}
        />

        {/* Bottom Switch to Sign-up */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => onNavigate('register')}
            activeOpacity={0.7}
            disabled={isSubmitting}
          >
            <Text style={styles.footerLink}>Create account</Text>
          </TouchableOpacity>
        </View>

        {/* 1-Tap Evaluation Personas */}
        <DemoPersonaPills
          onSelectPersona={handleQuickFill}
          disabled={isSubmitting}
        />
      </AuthCard>
    </AuthShell>
  );
};

const styles = StyleSheet.create({
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.08)',
      },
    }),
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#B91C1C',
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5E7A6D',
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
});
