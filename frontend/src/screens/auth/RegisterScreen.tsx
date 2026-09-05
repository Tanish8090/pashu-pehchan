import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { User, Phone, Mail, MapPin, Building, AlertCircle } from 'lucide-react';
import {
  AuthShell,
  AuthCard,
  AuthInput,
  AuthPasswordInput,
  AuthButton,
  RoleSelector,
} from '../../components/auth';
import { useAuth } from '../../context/AuthContext';
import { ScreenName, UserRole } from '../../types';
import { colors } from '../../theme/colors';

interface RegisterScreenProps {
  onNavigate: (screen: ScreenName) => void;
  onRegisterSuccess?: (role: UserRole) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigate,
  onRegisterSuccess,
}) => {
  const { register } = useAuth();

  const [selectedRole, setSelectedRole] = useState<'FARMER' | 'MIDDLEMAN'>('FARMER');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [businessName, setBusinessName] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    setErrorMsg(null);

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanPassword = password.trim();

    if (!cleanName) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!cleanPhone) {
      setErrorMsg('Please enter your 10-digit mobile phone number.');
      return;
    }
    if (cleanPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Mobile number must be at least 10 digits.');
      return;
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        name: cleanName,
        phone: cleanPhone,
        password: cleanPassword,
        role: selectedRole,
        email: email.trim() || undefined,
        district: district.trim() || undefined,
        village: village.trim() || undefined,
        state: 'Gujarat',
      };

      if (selectedRole === 'MIDDLEMAN' && businessName.trim()) {
        payload.business_name = businessName.trim();
      }

      await register(payload);

      if (onRegisterSuccess) {
        onRegisterSuccess(selectedRole);
      } else {
        onNavigate(selectedRole === 'MIDDLEMAN' ? 'middleman_home' : 'home');
      }
    } catch (err: any) {
      const msg = err?.message || 'Registration failed. Please check your details.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFarmer = selectedRole === 'FARMER';

  return (
    <AuthShell onBackToHome={() => onNavigate('landing')}>
      <AuthCard
        badgeText="JOIN PASHU PEHCHAN"
        title={isFarmer ? 'Create farmer account' : 'Create trader account'}
        subtitle={
          isFarmer
            ? 'Start managing and verifying your herd with AI bovine vision.'
            : 'Access verified cattle marketplace and wholesale procurement.'
        }
      >
        {/* Error Notification Banner */}
        {errorMsg && (
          <View style={styles.errorBanner}>
            <AlertCircle size={18} color={colors.danger} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Role Selection */}
        <RoleSelector
          selectedRole={selectedRole}
          onSelectRole={(r) => {
            setSelectedRole(r);
            if (errorMsg) setErrorMsg(null);
          }}
        />

        {/* Full Name */}
        <AuthInput
          label="Full Name *"
          placeholder="e.g. Ramesh Patel"
          value={name}
          onChangeText={(val) => {
            setName(val);
            if (errorMsg) setErrorMsg(null);
          }}
          icon={<User size={18} color={colors.primary} />}
          disabled={isSubmitting}
        />

        {/* Mobile Phone Number */}
        <AuthInput
          label="Mobile Phone Number *"
          placeholder="e.g. +91 98765 43210"
          value={phone}
          onChangeText={(val) => {
            setPhone(val);
            if (errorMsg) setErrorMsg(null);
          }}
          icon={<Phone size={18} color={colors.primary} />}
          keyboardType="phone-pad"
          disabled={isSubmitting}
        />

        {/* Password */}
        <AuthPasswordInput
          label="Password *"
          placeholder="Minimum 6 characters"
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            if (errorMsg) setErrorMsg(null);
          }}
        />

        {/* Optional Email */}
        <AuthInput
          label="Email Address (Optional)"
          placeholder="e.g. ramesh@farm.in"
          value={email}
          onChangeText={setEmail}
          icon={<Mail size={18} color="#6E8A7D" />}
          keyboardType="email-address"
          autoCapitalize="none"
          disabled={isSubmitting}
        />

        {/* District & Village Row */}
        <View style={styles.twoColRow}>
          <View style={{ flex: 1 }}>
            <AuthInput
              label="District (Optional)"
              placeholder="e.g. Anand"
              value={district}
              onChangeText={setDistrict}
              icon={<MapPin size={18} color="#6E8A7D" />}
              disabled={isSubmitting}
            />
          </View>
          {isFarmer && (
            <View style={{ flex: 1 }}>
              <AuthInput
                label="Village (Optional)"
                placeholder="e.g. Chikhodra"
                value={village}
                onChangeText={setVillage}
                disabled={isSubmitting}
              />
            </View>
          )}
        </View>

        {/* Middleman Business Name */}
        {!isFarmer && (
          <AuthInput
            label="Trading Firm / Business Name (Optional)"
            placeholder="e.g. Patel Livestock Traders"
            value={businessName}
            onChangeText={setBusinessName}
            icon={<Building size={18} color="#6E8A7D" />}
            disabled={isSubmitting}
          />
        )}

        {/* Primary Action CTA */}
        <AuthButton
          title={isFarmer ? 'Create Farmer Account →' : 'Create Trader Account →'}
          loadingTitle="Creating account..."
          onPress={handleRegister}
          isLoading={isSubmitting}
        />

        {/* Bottom Switch to Log In */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => onNavigate('login')}
            activeOpacity={0.7}
            disabled={isSubmitting}
          >
            <Text style={styles.footerLink}>Log in</Text>
          </TouchableOpacity>
        </View>
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
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
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
