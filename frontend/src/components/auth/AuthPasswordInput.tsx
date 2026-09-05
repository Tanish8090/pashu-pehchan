import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { AuthInput } from './AuthInput';
import { colors } from '../../theme/colors';

interface AuthPasswordInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
}

export const AuthPasswordInput: React.FC<AuthPasswordInputProps> = ({
  label = 'Password',
  value,
  onChangeText,
  placeholder = 'Enter your password',
  error,
  helperText,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={!showPassword}
      error={error}
      helperText={helperText}
      autoCapitalize="none"
      autoCorrect={false}
      icon={<Lock size={18} color={colors.primary} />}
      rightElement={
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
          activeOpacity={0.7}
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff size={18} color="#6E8A7D" />
          ) : (
            <Eye size={18} color="#6E8A7D" />
          )}
        </TouchableOpacity>
      }
    />
  );
};

const styles = StyleSheet.create({
  eyeButton: {
    padding: 6,
  },
});
