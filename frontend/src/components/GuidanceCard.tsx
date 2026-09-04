import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HelpCircle, ChevronDown, ChevronUp, Check, AlertCircle } from 'lucide-react';
import { colors } from '../theme/colors';

export const GuidanceCard: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <HelpCircle size={18} color={colors.primary} />
          <Text style={styles.headerTitle}>Field Image Capture Guidelines</Text>
        </View>
        {expanded ? (
          <ChevronUp size={18} color={colors.textMuted} />
        ) : (
          <ChevronDown size={18} color={colors.textMuted} />
        )}
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Follow ICAR field capture standards for highest classification accuracy:
          </Text>

          <View style={styles.tipRow}>
            <View style={styles.checkIcon}>
              <Check size={14} color={colors.success} />
            </View>
            <Text style={styles.tipText}>
              <Text style={styles.bold}>Side Profile View:</Text> Capture full lateral view including hump, dewlap, and backline.
            </Text>
          </View>

          <View style={styles.tipRow}>
            <View style={styles.checkIcon}>
              <Check size={14} color={colors.success} />
            </View>
            <Text style={styles.tipText}>
              <Text style={styles.bold}>Head & Horns Clear:</Text> Horn shape is the primary diagnostic differentiator for Indian zebu breeds.
            </Text>
          </View>

          <View style={styles.tipRow}>
            <View style={styles.checkIcon}>
              <Check size={14} color={colors.success} />
            </View>
            <Text style={styles.tipText}>
              <Text style={styles.bold}>Natural Daylight:</Text> Avoid strong shadows or backlit positioning against direct sunlight.
            </Text>
          </View>

          <View style={styles.warningRow}>
            <AlertCircle size={16} color={colors.warning} />
            <Text style={styles.warningText}>
              Avoid extreme angles, partial occlusions by fencing, or blurry movement.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  content: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 8,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.warningBg,
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    color: colors.warning,
    fontWeight: '500',
  },
});
