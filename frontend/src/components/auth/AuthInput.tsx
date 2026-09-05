import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';

export interface AuthInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
  rightElement?: React.ReactNode;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCorrect?: boolean;
  disabled?: boolean;
  style?: any;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
  helperText,
  rightElement,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
  autoCorrect,
  disabled,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          !!error && styles.inputWrapperError,
          disabled && styles.inputWrapperDisabled,
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[styles.input, style]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8CA799"
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          autoCorrect={autoCorrect}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {rightElement && <View style={styles.rightContainer}>{rightElement}</View>}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F3D24',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FCFA',
    borderWidth: 1.5,
    borderColor: '#D3E9DC',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    ...Platform.select({
      web: {
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      },
    }),
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.15)',
      },
    }),
  },
  inputWrapperError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
    ...Platform.select({
      web: {
        boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.12)',
      },
    }),
  },
  inputWrapperDisabled: {
    opacity: 0.65,
    backgroundColor: '#F0F4F2',
  },
  iconContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontWeight: '600',
    color: '#0F3D24',
    ...Platform.select({
      web: {
        outlineStyle: 'none' as any,
      },
    }),
  },
  rightContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    marginTop: 4,
    marginLeft: 2,
  },
  helperText: {
    fontSize: 11,
    color: '#5E7A6D',
    marginTop: 4,
    marginLeft: 2,
  },
});
