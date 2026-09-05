import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  ShieldCheck,
  Home,
  Camera,
  Layers,
  ShoppingBag,
  Stethoscope,
  TrendingUp,
  Scale,
  Bookmark,
  MessageSquare,
  BarChart2,
  ClipboardList,
  BookOpen,
  Info,
  PhoneCall,
  UserCheck,
  ChevronDown,
  Sparkles,
  Activity,
  Award,
  Check,
  AlertCircle,
} from 'lucide-react';
import { colors } from '../theme/colors';
import { ScreenName, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { initiatePhoneCall } from './adapters/contact';

interface DesktopSidebarProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  isBackendConnected: boolean;
  activeDevice?: string;
  unreadNotificationsCount?: number;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentScreen,
  onNavigate,
  isBackendConnected,
  activeDevice = 'CPU',
}) => {
  const { user, role, switchDemoRole } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchError, setSwitchError] = useState<string | null>(null);

  const handleRoleSwitch = async (targetRole: UserRole) => {
    if (isSwitching) return;
    if (targetRole === role) {
      setShowRoleDropdown(false);
      return;
    }
    setIsSwitching(true);
    setSwitchError(null);
    setShowRoleDropdown(false);
    try {
      await switchDemoRole(targetRole);
      if (targetRole === 'FARMER') onNavigate('home');
      else if (targetRole === 'MIDDLEMAN') onNavigate('middleman_home');
      else if (targetRole === 'ADMIN') onNavigate('admin');
    } catch (err: any) {
      setSwitchError('Unable to switch account. Please try again.');
      if (typeof window !== 'undefined' && window.alert) {
        window.alert('Unable to switch account. Please try again.');
      }
    } finally {
      setIsSwitching(false);
    }
  };

  const getRoleBadge = () => {
    if (role === 'MIDDLEMAN') return { label: 'Livestock Trader', emoji: '🤝' };
    if (role === 'ADMIN') return { label: 'DAHD Supervisor', emoji: '🛡️' };
    return { label: 'Pashu Palak (Farmer)', emoji: '🌾' };
  };

  const currentRoleInfo = getRoleBadge();

  // Navigation Items per Role
  const navSections = React.useMemo(() => {
    if (role === 'MIDDLEMAN') {
      return [
        {
          title: 'TRADING & COMMERCE',
          items: [
            { key: 'middleman_home' as ScreenName, label: 'Trader Dashboard', icon: TrendingUp },
            { key: 'middleman_marketplace' as ScreenName, label: 'Live Marketplace', icon: ShoppingBag },
            { key: 'compare_animals' as ScreenName, label: 'Side-by-Side Compare', icon: Scale },
            { key: 'saved_animals' as ScreenName, label: 'Watchlist / Saved', icon: Bookmark },
            { key: 'middleman_enquiries' as ScreenName, label: 'Trade Enquiries', icon: MessageSquare },
          ],
        },
        {
          title: 'VERIFICATION & SERVICES',
          items: [
            { key: 'scan' as ScreenName, label: 'AI Breed Scanner', icon: Camera, badge: 'AI Model' },
            { key: 'vets' as ScreenName, label: 'Veterinary Polyclinics', icon: Stethoscope },
            { key: 'breeds' as ScreenName, label: 'ICAR Breed Standards', icon: BookOpen },
          ],
        },
      ];
    } else if (role === 'ADMIN') {
      return [
        {
          title: 'SUPERVISOR COMMAND',
          items: [
            { key: 'admin' as ScreenName, label: 'Executive Telemetry', icon: ShieldCheck },
            { key: 'dashboard' as ScreenName, label: 'Platform Analytics', icon: BarChart2 },
            { key: 'history' as ScreenName, label: 'Verification Audits', icon: ClipboardList },
          ],
        },
        {
          title: 'AI MODELS & REPOSITORIES',
          items: [
            { key: 'scan' as ScreenName, label: 'Inference Playground', icon: Camera, badge: '41 Classes' },
            { key: 'breeds' as ScreenName, label: '41 Indigenous Breeds', icon: BookOpen },
            { key: 'vets' as ScreenName, label: 'National Vet Network', icon: Stethoscope },
            { key: 'system_info' as ScreenName, label: 'System & API Specs', icon: Info },
          ],
        },
      ];
    } else {
      // Farmer
      return [
        {
          title: 'MY LIVESTOCK',
          items: [
            { key: 'home' as ScreenName, label: 'Farm Overview', icon: Home },
            { key: 'scan' as ScreenName, label: 'AI Breed Scanner', icon: Camera, badge: 'AI Verified' },
            { key: 'my_livestock' as ScreenName, label: 'My Livestock Herd', icon: Layers },
            { key: 'farmer_marketplace' as ScreenName, label: 'Marketplace (Sell & Buy)', icon: ShoppingBag },
            { key: 'farmer_enquiries' as ScreenName, label: 'Buyer Enquiries', icon: MessageSquare },
          ],
        },
        {
          title: 'HEALTH & ENCYCLOPEDIA',
          items: [
            { key: 'vets' as ScreenName, label: 'Find a Vet & Polyclinics', icon: Stethoscope },
            { key: 'breeds' as ScreenName, label: '41 ICAR Breeds Guide', icon: BookOpen },
            { key: 'history' as ScreenName, label: 'Scan History & Tags', icon: ClipboardList },
          ],
        },
      ];
    }
  }, [role]);

  return (
    <View style={styles.sidebarContainer}>
      {/* Brand Header with PashuPehchan Logo Image */}
      <View style={styles.sidebarHeader}>
        <TouchableOpacity
          onPress={() => onNavigate('landing')}
          activeOpacity={0.88}
          style={styles.logoBadgeWrap}
          accessibilityLabel="Go to Farm Mora Landing Page"
        >
          <Image
            source={{ uri: '/logo.png' }}
            style={styles.sidebarLogoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.landingLinkPill}
          onPress={() => onNavigate('landing')}
          activeOpacity={0.8}
        >
          <Sparkles size={11} color={colors.primary} />
          <Text style={styles.landingLinkText}>Farm Mōra Landing Page ↗</Text>
        </TouchableOpacity>

        <View style={styles.icarBadgeRow}>
          <Award size={12} color={colors.primary} />
          <Text style={styles.icarBadgeText}>PS-5 • ICAR-NBAGR 41 Standards</Text>
        </View>
      </View>

      {/* User Role Card & 1-Click Switcher */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>{currentRoleInfo.emoji}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || (role === 'MIDDLEMAN' ? 'Kishore Bhai' : role === 'ADMIN' ? 'Supervisor DAHD' : 'Ramesh Patel')}
            </Text>
            <Text style={styles.userSub} numberOfLines={1}>
              {user?.district ? `${user.district}, ${user.state || 'Gujarat'}` : (role === 'MIDDLEMAN' ? 'Ahmedabad, Gujarat' : role === 'ADMIN' ? 'Gandhinagar, Gujarat' : 'Anand, Gujarat')}
            </Text>
          </View>
        </View>

        {/* 1-Click Demo Switcher */}
        <TouchableOpacity
          style={[styles.switchRoleBtn, isSwitching && styles.switchRoleBtnDisabled]}
          onPress={() => !isSwitching && setShowRoleDropdown(!showRoleDropdown)}
          activeOpacity={0.8}
          disabled={isSwitching}
        >
          <View style={styles.switchRoleBtnContent}>
            <UserCheck size={14} color={colors.primary} />
            <Text style={styles.switchRoleBtnText}>
              {isSwitching ? 'Switching Account...' : currentRoleInfo.label}
            </Text>
          </View>
          {isSwitching ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <ChevronDown size={14} color={colors.textSecondary} />
          )}
        </TouchableOpacity>

        {switchError ? (
          <View style={styles.switchErrorBanner}>
            <AlertCircle size={12} color={colors.danger} />
            <Text style={styles.switchErrorText}>{switchError}</Text>
          </View>
        ) : null}

        {showRoleDropdown && (
          <View style={styles.roleDropdown}>
            <TouchableOpacity
              style={[styles.roleOption, role === 'FARMER' && styles.roleOptionActive]}
              onPress={() => handleRoleSwitch('FARMER')}
              disabled={isSwitching}
              activeOpacity={0.7}
            >
              <View style={styles.roleOptionInner}>
                <Text style={[styles.roleOptionText, role === 'FARMER' && styles.roleOptionTextActive]}>
                  🌾 Farmer (Ramesh Patel)
                </Text>
                {role === 'FARMER' && <Check size={14} color={colors.primary} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleOption, role === 'MIDDLEMAN' && styles.roleOptionActive]}
              onPress={() => handleRoleSwitch('MIDDLEMAN')}
              disabled={isSwitching}
              activeOpacity={0.7}
            >
              <View style={styles.roleOptionInner}>
                <Text style={[styles.roleOptionText, role === 'MIDDLEMAN' && styles.roleOptionTextActive]}>
                  🤝 Middleman (Kishore Bhai)
                </Text>
                {role === 'MIDDLEMAN' && <Check size={14} color={colors.primary} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleOption, role === 'ADMIN' && styles.roleOptionActive]}
              onPress={() => handleRoleSwitch('ADMIN')}
              disabled={isSwitching}
              activeOpacity={0.7}
            >
              <View style={styles.roleOptionInner}>
                <Text style={[styles.roleOptionText, role === 'ADMIN' && styles.roleOptionTextActive]}>
                  🛡️ Admin (Supervisor DAHD)
                </Text>
                {role === 'ADMIN' && <Check size={14} color={colors.primary} />}
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Navigation Sections */}
      <ScrollView
        style={styles.navScroll}
        contentContainerStyle={styles.navScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {navSections.map((sec, secIdx) => (
          <View key={secIdx} style={styles.navSection}>
            <Text style={styles.navSectionTitle}>{sec.title}</Text>
            <View style={styles.navList}>
              {sec.items.map((item) => {
                const isActive = currentScreen === item.key;
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.navItem, isActive && styles.navItemActive]}
                    onPress={() => onNavigate(item.key)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.navItemLeft}>
                      <IconComponent
                        size={18}
                        color={isActive ? colors.primaryDark : colors.textSecondary}
                      />
                      <Text
                        style={[styles.navItemLabel, isActive && styles.navItemLabelActive]}
                      >
                        {item.label}
                      </Text>
                    </View>
                    {item.badge && (
                      <View
                        style={[
                          styles.navItemBadge,
                          isActive && styles.navItemBadgeActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.navItemBadgeText,
                            isActive && styles.navItemBadgeTextActive,
                          ]}
                        >
                          {item.badge}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Model Health Status Card */}
      <View style={styles.modelStatusCard}>
        <View style={styles.modelStatusHeader}>
          <View style={styles.modelStatusDotRow}>
            <View
              style={[
                styles.statusDot,
                isBackendConnected ? styles.dotOnline : styles.dotOffline,
              ]}
            />
            <Text style={styles.modelStatusTitle}>
              {isBackendConnected ? 'AI Engine Online' : 'Connecting to AI...'}
            </Text>
          </View>
          <Text style={styles.modelDeviceBadge}>{activeDevice}</Text>
        </View>
        <Text style={styles.modelStatusDetails}>
          EfficientNet-B0 • 41 ICAR Breeds{'\n'}Latency: ~47ms • 96.85% Top-3 Acc
        </Text>
      </View>

      {/* Emergency Helpline 1962 */}
      <TouchableOpacity
        style={styles.emergencyBanner}
        onPress={() => initiatePhoneCall('1962')}
        activeOpacity={0.85}
      >
        <View style={styles.emergencyLeft}>
          <View style={styles.emergencyIconCircle}>
            <PhoneCall size={14} color="#ffffff" />
          </View>
          <View>
            <Text style={styles.emergencyTitle}>1962 Pashu Ambulance</Text>
            <Text style={styles.emergencySub}>24x7 Emergency Helpline</Text>
          </View>
        </View>
        <View style={styles.dialBadge}>
          <Text style={styles.dialBadgeText}>CALL</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    width: 270,
    height: '100vh',
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 100,
    boxShadow: '0 4px 20px rgba(20, 83, 45, 0.04)',
  },
  sidebarHeader: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadgeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  sidebarLogoImage: {
    width: 140,
    height: 52,
  },
  landingLinkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EDF9F1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C2E7D1',
  },
  landingLinkText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
  icarBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  icarBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  profileCard: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
    position: 'relative',
    zIndex: 105,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primaryBorder,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  userSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  switchRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  switchRoleBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchRoleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  switchRoleBtnDisabled: {
    opacity: 0.7,
  },
  switchErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.dangerBg,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F5C6C6',
  },
  switchErrorText: {
    fontSize: 10,
    color: colors.danger,
    fontWeight: '600',
  },
  roleDropdown: {
    position: 'absolute',
    top: 88,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 6,
    boxShadow: '0 8px 24px rgba(20, 83, 45, 0.12)',
    zIndex: 120,
    elevation: 10,
  },
  roleOption: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  roleOptionActive: {
    backgroundColor: colors.sidebarActiveBg,
  },
  roleOptionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  roleOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  roleOptionTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  navScroll: {
    flex: 1,
    marginTop: 12,
  },
  navScrollContent: {
    paddingVertical: 6,
    gap: 16,
  },
  navSection: {
    gap: 3,
  },
  navSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    paddingHorizontal: 10,
    marginBottom: 6,
    textTransform: 'uppercase' as any,
  },
  navList: {
    gap: 3,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  navItemActive: {
    backgroundColor: colors.primary,
  },
  navItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navItemLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.sidebarText,
  },
  navItemLabelActive: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  navItemBadge: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  navItemBadgeActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  navItemBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
  },
  navItemBadgeTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  modelStatusCard: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    gap: 5,
  },
  modelStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modelStatusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOnline: {
    backgroundColor: colors.primaryLight,
  },
  dotOffline: {
    backgroundColor: colors.danger,
  },
  modelStatusTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modelDeviceBadge: {
    fontSize: 9,
    fontWeight: '800',
    backgroundColor: colors.primarySoft,
    color: colors.primaryDark,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  modelStatusDetails: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 15,
  },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#8B2020',
    padding: 11,
    borderRadius: 12,
    marginTop: 10,
  },
  emergencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emergencySub: {
    fontSize: 9,
    color: '#F8B4B4',
  },
  dialBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dialBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B2020',
  },
});

