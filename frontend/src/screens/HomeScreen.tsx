import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  Camera,
  BookOpen,
  ClipboardList,
  BarChart2,
  CheckCircle,
  AlertTriangle,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { colors } from '../theme/colors';
import { ScreenName, DashboardResponse } from '../types';
import { getDashboardStats } from '../services/api';

interface HomeScreenProps {
  onNavigate: (screen: ScreenName) => void;
  onQuickSampleSelect?: (sampleName: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onQuickSampleSelect,
}) => {
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((data) => setStats(data))
      .catch((err) => console.log('Failed loading stats:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Banner */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeaderRow}>
          <Image
            source={{ uri: '/logo.png' }}
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <View style={styles.tagBadge}>
            <Sparkles size={12} color="#15803d" />
            <Text style={styles.tagBadgeText}>BHARAT PASHUDHAN COMPLIANT</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>
          AI-Driven Cattle & Buffalo Breed Verification
        </Text>
        <Text style={styles.heroSubtitle}>
          Eliminate field misclassification. Real-time vision inference with Top-3 suggested
          breeds and human-in-the-loop verification.
        </Text>

        <TouchableOpacity
          style={styles.primaryCta}
          onPress={() => onNavigate('scan')}
          activeOpacity={0.85}
        >
          <Camera size={20} color="#ffffff" />
          <Text style={styles.primaryCtaText}>Start Breed Verification</Text>
          <ArrowRight size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats Bar */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {loading ? '-' : stats?.total_records ?? 0}
          </Text>
          <Text style={styles.statLabel}>Records Logged</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {loading ? '-' : `${stats?.verification_rate ?? 0}%`}
          </Text>
          <Text style={styles.statLabel}>Verified Rate</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            41
          </Text>
          <Text style={styles.statLabel}>Indian Breeds</Text>
        </View>
      </View>

      {/* Quick Test Samples for Evaluators */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Instant Hackathon Demo Samples</Text>
        <Text style={styles.sectionSubtitle}>
          Test inference instantly using benchmark images from the dataset:
        </Text>
      </View>

      <View style={styles.sampleChipsRow}>
        {[
          { label: 'Gir (Cow)', breed: 'Gir', type: 'Cattle' },
          { label: 'Murrah (Buffalo)', breed: 'Murrah', type: 'Buffalo' },
          { label: 'Sahiwal (Cow)', breed: 'Sahiwal', type: 'Cattle' },
          { label: 'Jaffrabadi (Buffalo)', breed: 'Jaffrabadi', type: 'Buffalo' },
        ].map((sample) => (
          <TouchableOpacity
            key={sample.breed}
            style={styles.sampleChip}
            onPress={() => {
              if (onQuickSampleSelect) {
                onQuickSampleSelect(sample.breed);
              }
              onNavigate('scan');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.sampleChipType}>{sample.type}</Text>
            <Text style={styles.sampleChipBreed}>{sample.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Navigation Feature Cards */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Field Operations</Text>
      </View>

      <View style={styles.cardsGrid}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => onNavigate('scan')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#dcfce7' }]}>
            <Camera size={22} color={colors.primary} />
          </View>
          <Text style={styles.actionTitle}>Scan & Classify</Text>
          <Text style={styles.actionDesc}>
            Upload or capture cattle photo for instant Top-3 predictions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => onNavigate('library')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#e0f2fe' }]}>
            <BookOpen size={22} color="#0284c7" />
          </View>
          <Text style={styles.actionTitle}>Breed Catalog</Text>
          <Text style={styles.actionDesc}>
            41 ICAR-NBAGR registered breeds with physical horn & coat traits
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => onNavigate('history')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#fef3c7' }]}>
            <ClipboardList size={22} color="#d97706" />
          </View>
          <Text style={styles.actionTitle}>Audit Log</Text>
          <Text style={styles.actionDesc}>
            Review verified, overridden, and flagged field entries
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => onNavigate('dashboard')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#f3e8ff' }]}>
            <BarChart2 size={22} color="#7c3aed" />
          </View>
          <Text style={styles.actionTitle}>Analytics</Text>
          <Text style={styles.actionDesc}>
            Quality dashboard, species distribution, and override frequency
          </Text>
        </TouchableOpacity>
      </View>

      {/* Gov Policy Notice */}
      <View style={styles.noticeCard}>
        <Award size={20} color={colors.primary} />
        <View style={styles.noticeContent}>
          <Text style={styles.noticeTitle}>National Livestock Mission Standards</Text>
          <Text style={styles.noticeText}>
            PashuPehchan implements Human-in-the-Loop AI: The model suggests probabilistic Top-3
            breeds, while field enumerators retain final verification authority before Bharat
            Pashudhan submission.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
    boxShadow: '0 4px 20px rgba(15, 61, 36, 0.05)',
    marginBottom: 20,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  heroLogo: {
    width: 64,
    height: 64,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 30,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 20,
    fontWeight: '500',
  },
  primaryCta: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 22,
    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)',
  },
  primaryCtaText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 24,
    alignItems: 'center',
    boxShadow: '0 4px 16px rgba(15, 61, 36, 0.04)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.borderLight,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  sampleChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  sampleChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    minWidth: '47%',
    flex: 1,
    boxShadow: '0 2px 6px rgba(15, 61, 36, 0.03)',
  },
  sampleChipType: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sampleChipBreed: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 3,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 22,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 18,
    width: '48%',
    flexGrow: 1,
    boxShadow: '0 4px 16px rgba(15, 61, 36, 0.04)',
  },
  actionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    fontWeight: '500',
  },
  noticeCard: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    fontWeight: '500',
  },
});
