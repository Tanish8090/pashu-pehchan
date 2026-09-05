import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';

interface AuthButtonProps {
  title: string;
  loadingTitle?: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  loadingTitle = 'Processing...',
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
}) => {
  const isActionDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        isActionDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isActionDisabled}
      activeOpacity={0.85}
    >
      {isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#FFFFFF" />
          <Text style={[styles.text, styles[`${variant}Text`]]}>
            {loadingTitle}
          </Text>
        </View>
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      },
    }),
  },
  primary: {
    backgroundColor: colors.primary,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(22, 163, 74, 0.35)',
      },
    }),
  },
  secondary: {
    backgroundColor: '#EDF9F1',
    borderWidth: 1.5,
    borderColor: '#C8E8D5',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#D3E9DC',
  },
  disabled: {
    opacity: 0.65,
    ...Platform.select({
      web: {
        boxShadow: 'none',
        cursor: 'not-allowed',
      },
    }),
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#0F3D24',
  },
  outlineText: {
    color: '#0F3D24',
  },
});
