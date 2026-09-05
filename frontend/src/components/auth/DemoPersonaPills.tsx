import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Sparkles, ArrowRight } from 'lucide-react';
import { colors } from '../../theme/colors';

interface DemoPersonaPillsProps {
  onSelectPersona: (email: string, pass: string) => void;
  disabled?: boolean;
}

export const DemoPersonaPills: React.FC<DemoPersonaPillsProps> = ({
  onSelectPersona,
  disabled = false,
}) => {
  const personas = [
    {
      role: 'Farmer',
      name: 'Ramesh Patel',
      email: 'farmer@vetra.in',
      pass: 'farmer123',
      emoji: '👨‍🌾',
      badge: '4 Verified Bovine',
      color: '#16A34A',
      bg: '#DCFCE7',
    },
    {
      role: 'Middleman',
      name: 'Kishore Bhai',
      email: 'middleman@vetra.in',
      pass: 'trade123',
      emoji: '🤝',
      badge: 'Trading & Procurement',
      color: '#D97706',
      bg: '#FEF3C7',
    },
    {
      role: 'Admin',
      name: 'Supervisor',
      email: 'admin@vetra.in',
      pass: 'admin123',
      emoji: '🏛️',
      badge: 'System Governance',
      color: '#0284C7',
      bg: '#E0F2FE',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <View style={styles.dividerBadge}>
          <Sparkles size={11} color={colors.accent} />
          <Text style={styles.dividerText}>QUICK DEMO PERSONAS</Text>
        </View>
        <View style={styles.dividerLine} />
      </View>

      {/* Personas List */}
      <View style={styles.personasCol}>
        {personas.map((p) => (
          <TouchableOpacity
            key={p.role}
            style={styles.personaCard}
            onPress={() => onSelectPersona(p.email, p.pass)}
            disabled={disabled}
            activeOpacity={0.8}
          >
            <View style={[styles.personaIconCircle, { backgroundColor: p.bg }]}>
              <Text style={styles.personaEmoji}>{p.emoji}</Text>
            </View>
            <View style={styles.personaMeta}>
              <View style={styles.personaNameRow}>
                <Text style={styles.personaRole}>{p.role}:</Text>
                <Text style={styles.personaName}>{p.name}</Text>
              </View>
              <Text style={styles.personaBadgeText}>{p.badge}</Text>
            </View>
            <View style={styles.fillAction}>
              <Text style={styles.fillText}>Fill</Text>
              <ArrowRight size={12} color={colors.primary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    width: '100%',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2EFE7',
  },
  dividerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6E8A7D',
    letterSpacing: 0.8,
  },
  personasCol: {
    gap: 8,
  },
  personaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FCF9',
    borderWidth: 1,
    borderColor: '#D8EDE0',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      },
    }),
  },
  personaIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  personaEmoji: {
    fontSize: 16,
  },
  personaMeta: {
    flex: 1,
  },
  personaNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  personaRole: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F3D24',
  },
  personaName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#365345',
  },
  personaBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6E8A7D',
  },
  fillAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C8E8D5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  fillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
});
