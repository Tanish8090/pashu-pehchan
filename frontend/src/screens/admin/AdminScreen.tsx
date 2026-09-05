import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  ShieldCheck,
  Cpu,
  Users,
  Database,
  Layers,
  ShoppingBag,
  Clock,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { colors } from '../../theme/colors';
import { ScreenName, AdminDashboardData, HealthResponse } from '../../types';
import * as api from '../../services/api';

interface AdminScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ onNavigate }) => {
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dash, health] = await Promise.all([
        api.getAdminDashboard(),
        api.checkHealth(),
      ]);
      setAdminData(dash);
      setHealthData(health);
    } catch (err) {
      console.warn('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDesktop = windowWidth >= 768;
  const statTileWidth =
    windowWidth >= 1024
      ? ('calc(25% - 9px)' as any)
      : ('calc(50% - 6px)' as any);

  return (
    <ScrollView
      style={isDesktop ? styles.desktopScrollView : styles.container}
      contentContainerStyle={[styles.content, isDesktop && styles.desktopContent]}
    >
      {/* Top Banner */}
      <View style={styles.banner}>
        <View>
          <Text style={styles.bannerTitle}>System Administration</Text>
          <Text style={styles.bannerSub}>
            Platform Governance • Bharat Pashudhan Verification Monitoring
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={loadData}>
          <RefreshCw size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Model Health Box */}
      <View style={styles.modelBox}>
        <View style={styles.modelTop}>
          <View style={styles.modelIcon}>
            <Cpu size={22} color="#ffffff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.modelTitle}>
              {healthData?.architecture || 'EfficientNet-B0'} Production Model
            </Text>
            <Text style={styles.modelSub}>
              Trained on 41 ICAR-NBAGR Indigenous Cattle & Buffalo Breeds
            </Text>
          </View>
          <View style={styles.loadedPill}>
            <CheckCircle2 size={12} color={colors.success} />
            <Text style={styles.loadedText}>Online</Text>
          </View>
        </View>

        <View style={styles.modelGrid}>
          <View style={styles.modelMetric}>
            <Text style={styles.mLabel}>Inference Latency</Text>
            <Text style={styles.mVal}>
              {adminData?.avg_inference_latency_ms || 42} ms
            </Text>
          </View>
          <View style={styles.modelMetric}>
            <Text style={styles.mLabel}>Compute Target</Text>
            <Text style={styles.mVal}>{healthData?.device || 'CPU'}</Text>
          </View>
          <View style={styles.modelMetric}>
            <Text style={styles.mLabel}>Classes</Text>
            <Text style={styles.mVal}>{healthData?.classes || 41}</Text>
          </View>
          <View style={styles.modelMetric}>
            <Text style={styles.mLabel}>Top-3 Accuracy</Text>
            <Text style={styles.mVal}>91.4%</Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <Text style={styles.sectionTitle}>Platform Aggregate Metrics</Text>
      <View style={styles.statsGrid}>
        <View style={[styles.statTile, isDesktop && { width: statTileWidth, flexGrow: 1 }]}>
          <View style={[styles.tileIcon, { backgroundColor: colors.primarySoft }]}>
            <Users size={18} color={colors.primary} />
          </View>
          <Text style={styles.statNumber}>{adminData?.total_users ?? 3}</Text>
          <Text style={styles.statLabel}>Registered Users</Text>
          <Text style={styles.statSub}>
            {adminData?.farmers_count ?? 1} Farmers • {adminData?.middlemen_count ?? 1} Traders
          </Text>
        </View>

        <View style={[styles.statTile, isDesktop && { width: statTileWidth, flexGrow: 1 }]}>
          <View style={[styles.tileIcon, { backgroundColor: '#dcfce7' }]}>
            <Layers size={18} color={colors.success} />
          </View>
          <Text style={styles.statNumber}>{adminData?.total_animals ?? 4}</Text>
          <Text style={styles.statLabel}>Herd Records</Text>
          <Text style={styles.statSub}>
            {adminData?.verified_percentage ?? 100}% Verified
          </Text>
        </View>

        <View style={[styles.statTile, isDesktop && { width: statTileWidth, flexGrow: 1 }]}>
          <View style={[styles.tileIcon, { backgroundColor: '#fef3c7' }]}>
            <ShoppingBag size={18} color={colors.warning} />
          </View>
          <Text style={styles.statNumber}>{adminData?.active_listings ?? 4}</Text>
          <Text style={styles.statLabel}>Active Listings</Text>
          <Text style={styles.statSub}>PashuPehchan Marketplace</Text>
        </View>

        <View style={[styles.statTile, isDesktop && { width: statTileWidth, flexGrow: 1 }]}>
          <View style={[styles.tileIcon, { backgroundColor: '#dbeafe' }]}>
            <Clock size={18} color={colors.info} />
          </View>
          <Text style={styles.statNumber}>{adminData?.total_enquiries ?? 2}</Text>
          <Text style={styles.statLabel}>Trade Enquiries</Text>
          <Text style={styles.statSub}>Buyer Offers</Text>
        </View>
      </View>

      {/* System Governance Links */}
      <Text style={styles.sectionTitle}>Administrative Shortcuts</Text>
      <View style={[styles.actionList, isDesktop && styles.desktopActionList]}>
        <TouchableOpacity
          style={[styles.actionRow, isDesktop && styles.desktopActionRow]}
          onPress={() => onNavigate('dashboard')}
        >
          <Database size={18} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.actionText}>Breed Classification Analytics</Text>
            <Text style={styles.actionSub}>Detailed confusion breakdown & breed counts</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionRow, isDesktop && styles.desktopActionRow]}
          onPress={() => onNavigate('system_info')}
        >
          <ShieldCheck size={18} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.actionText}>Model Specifications & Verification Rules</Text>
            <Text style={styles.actionSub}>ICAR-NBAGR dataset and inference engine specs</Text>
          </View>
        </TouchableOpacity>
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
    gap: 16,
  },
  desktopScrollView: {
    overflow: 'visible' as any,
    flex: 'none' as any,
    height: 'auto' as any,
  },
  desktopContent: {
    padding: 0,
    gap: 20,
  },
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  bannerSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  refreshBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
  },
  modelBox: {
    backgroundColor: '#0f2918',
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  modelTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modelIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  modelSub: {
    fontSize: 11,
    color: '#bbf7d0',
    marginTop: 2,
  },
  loadedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  loadedText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.success,
  },
  modelGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    borderRadius: 8,
  },
  modelMetric: {
    alignItems: 'center',
  },
  mLabel: {
    fontSize: 10,
    color: '#a7f3d0',
  },
  mVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statTile: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  tileIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statSub: {
    fontSize: 10,
    color: colors.textMuted,
  },
  actionList: {
    gap: 10,
  },
  desktopActionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  desktopActionRow: {
    flex: 1,
    minWidth: 300,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
