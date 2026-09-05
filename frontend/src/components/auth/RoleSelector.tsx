import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Check } from 'lucide-react';
import { colors } from '../../theme/colors';

interface RoleSelectorProps {
  selectedRole: 'FARMER' | 'MIDDLEMAN';
  onSelectRole: (role: 'FARMER' | 'MIDDLEMAN') => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>SELECT ACCOUNT TYPE</Text>
      <View style={styles.rolesRow}>
        {/* Farmer Card */}
        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'FARMER' && styles.roleCardActive,
          ]}
          onPress={() => onSelectRole('FARMER')}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Text style={styles.emoji}>👨‍🌾</Text>
            </View>
            {selectedRole === 'FARMER' && (
              <View style={styles.checkCircle}>
                <Check size={12} color="#FFFFFF" strokeWidth={3} />
              </View>
            )}
          </View>
          <Text style={styles.roleTitle}>Dairy Farmer</Text>
          <Text style={styles.roleSub}>Digital herd register, AI breed verification & selling</Text>
        </TouchableOpacity>

        {/* Middleman Card */}
        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'MIDDLEMAN' && styles.roleCardActive,
          ]}
          onPress={() => onSelectRole('MIDDLEMAN')}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.emoji}>🤝</Text>
            </View>
            {selectedRole === 'MIDDLEMAN' && (
              <View style={styles.checkCircle}>
                <Check size={12} color="#FFFFFF" strokeWidth={3} />
              </View>
            )}
          </View>
          <Text style={styles.roleTitle}>Livestock Trader</Text>
          <Text style={styles.roleSub}>Wholesale procurement, specs comparison & offers</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  rolesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#F8FCFA',
    borderWidth: 1.5,
    borderColor: '#D3E9DC',
    borderRadius: 20,
    padding: 14,
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      },
    }),
  },
  roleCardActive: {
    backgroundColor: '#EDF9F1',
    borderColor: colors.primary,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(22, 163, 74, 0.15)',
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F3D24',
    marginBottom: 4,
  },
  roleSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#5E7A6D',
    lineHeight: 15,
  },
});
