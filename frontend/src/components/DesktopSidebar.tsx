import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
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

  const handleRoleSwitch = async (targetRole: UserRole) => {
    setShowRoleDropdown(false);
    await switchDemoRole(targetRole);
    if (targetRole === 'FARMER') onNavigate('home');
    else if (targetRole === 'MIDDLEMAN') onNavigate('middleman_home');
    else if (targetRole === 'ADMIN') onNavigate('admin');
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
      <View style={styles.brandHeader}>
        <TouchableOpacity
          onPress={() => {
            if (role === 'MIDDLEMAN') onNavigate('middleman_home');
            else if (role === 'ADMIN') onNavigate('admin');
            else onNavigate('home');
          }}
          activeOpacity={0.88}
          style={styles.logoImageWrap}
        >
          <Image
            source={{ uri: '/logo.png' }}
            style={styles.sidebarLogoImage}
            resizeMode="contain"
          />
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
              {user?.name || 'Ramesh Patel'}
            </Text>
            <Text style={styles.userSub} numberOfLines={1}>
              {user?.district || 'Anand'}, {user?.state || 'Gujarat'}
            </Text>
          </View>
        </View>

        {/* 1-Click Demo Switcher */}
        <TouchableOpacity
          style={styles.switchRoleBtn}
          onPress={() => setShowRoleDropdown(!showRoleDropdown)}
          activeOpacity={0.8}
        >
          <View style={styles.switchRoleBtnContent}>
            <UserCheck size={14} color={colors.primary} />
            <Text style={styles.switchRoleBtnText}>{currentRoleInfo.label}</Text>
          </View>
          <ChevronDown size={14} color={colors.textSecondary} />
        </TouchableOpacity>

        {showRoleDropdown && (
          <View style={styles.roleDropdown}>
            <TouchableOpacity
              style={[styles.roleOption, role === 'FARMER' && styles.roleOptionActive]}
              onPress={() => handleRoleSwitch('FARMER')}
            >
              <Text style={styles.roleOptionText}>🌾 Farmer (Ramesh Patel)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleOption, role === 'MIDDLEMAN' && styles.roleOptionActive]}
              onPress={() => handleRoleSwitch('MIDDLEMAN')}
            >
              <Text style={styles.roleOptionText}>🤝 Middleman (Kishore Bhai)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleOption, role === 'ADMIN' && styles.roleOptionActive]}
              onPress={() => handleRoleSwitch('ADMIN')}
            >
              <Text style={styles.roleOptionText}>🛡️ Admin (Supervisor DAHD)</Text>
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
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: colors.border,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    paddingVertical: 16,
    paddingHorizontal: 16,
    zIndex: 100,
  },
  brandHeader: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 6,
    alignItems: 'center',
  },
  logoImageWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  sidebarLogoImage: {
    width: 160,
    height: 160,
  },
  icarBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
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
    padding: 10,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
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
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
    fontWeight: '700',
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
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
  roleDropdown: {
    position: 'absolute',
    top: 86,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 120,
    elevation: 10,
  },
  roleOption: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  roleOptionActive: {
    backgroundColor: colors.primarySoft,
  },
  roleOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  navScroll: {
    flex: 1,
    marginTop: 10,
  },
  navScrollContent: {
    paddingVertical: 6,
    gap: 16,
  },
  navSection: {
    gap: 4,
  },
  navSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  navList: {
    gap: 2,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
    transition: 'all 0.15s ease',
  },
  navItemActive: {
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  navItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navItemLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  navItemLabelActive: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
  navItemBadge: {
    backgroundColor: '#f1f5f3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  navItemBadgeActive: {
    backgroundColor: colors.primary,
  },
  navItemBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
  },
  navItemBadgeTextActive: {
    color: '#ffffff',
  },
  modelStatusCard: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    gap: 4,
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
    backgroundColor: '#22c55e',
  },
  dotOffline: {
    backgroundColor: '#ef4444',
  },
  modelStatusTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modelDeviceBadge: {
    fontSize: 9,
    fontWeight: '800',
    backgroundColor: colors.primaryBorder,
    color: colors.primaryDark,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  modelStatusDetails: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
  },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7f1d1d',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  emergencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  emergencySub: {
    fontSize: 9,
    color: '#fca5a5',
  },
  dialBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  dialBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7f1d1d',
  },
});
