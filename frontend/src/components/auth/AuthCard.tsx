import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme/colors';

interface AuthCardProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  badgeText,
  children,
}) => {
  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.header}>
        {badgeText && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Card Body / Form */}
      <View style={styles.body}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#E2EFE7',
    padding: 36,
    width: '100%',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 60px -10px rgba(15, 61, 36, 0.09), 0 4px 16px rgba(15, 61, 36, 0.04)',
      },
      default: {
        elevation: 6,
      },
    }),
  },
  header: {
    marginBottom: 24,
  },
  badge: {
    backgroundColor: '#EDF9F1',
    borderWidth: 1,
    borderColor: '#C8E8D5',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F3D24',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#476155',
    lineHeight: 20,
  },
  body: {
    width: '100%',
  },
});
