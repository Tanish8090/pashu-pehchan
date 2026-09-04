import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {
  Search,
  Camera,
  Bell,
  Info,
  UserCheck,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { colors } from '../theme/colors';
import { ScreenName, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface DesktopTopBarProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  isBackendConnected: boolean;
  activeDevice?: string;
  unreadNotificationsCount?: number;
  onSearchChange?: (query: string) => void;
}

export const DesktopTopBar: React.FC<DesktopTopBarProps> = ({
  currentScreen,
  onNavigate,
  isBackendConnected,
  activeDevice = 'CPU',
  unreadNotificationsCount = 0,
  onSearchChange,
}) => {
  const { user, role, switchDemoRole } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRoleSwitch = async (targetRole: UserRole) => {
    setShowRoleMenu(false);
    await switchDemoRole(targetRole);
    if (targetRole === 'FARMER') onNavigate('home');
    else if (targetRole === 'MIDDLEMAN') onNavigate('middleman_home');
    else if (targetRole === 'ADMIN') onNavigate('admin');
  };

  const getScreenTitle = (): { title: string; subtitle: string } => {
    switch (currentScreen) {
      case 'home':
        return {
          title: 'Farmer Livestock Dashboard',
          subtitle: 'Bharat Pashudhan AI ear-tag verification and herd register',
        };
      case 'middleman_home':
        return {
          title: 'Livestock Trading & Procurement Hub',
          subtitle: 'Verified cattle marketplace, price discovery & buyer inquiries',
        };
      case 'admin':
        return {
          title: 'National Livestock AI Executive Command',
          subtitle: 'Real-time telemetry, model benchmark accuracy & regional audits',
        };
      case 'scan':
        return {
          title: 'AI Breed Classification Scanner',
          subtitle: 'Instant photo inference across 41 ICAR-NBAGR indigenous breeds',
        };
      case 'results':
        return {
          title: 'AI Classification Report',
          subtitle: 'Top-3 confidence predictions, physical markers & breed specs',
        };
      case 'verify':
        return {
          title: 'Official Ear Tag & Breed Verification',
          subtitle: 'Confirm breed standard and attach to Bharat Pashudhan registry',
        };
      case 'my_livestock':
        return {
          title: 'My Registered Herd',
          subtitle: 'Manage cattle ear tags, lactation records & sale listings',
        };
      case 'farmer_marketplace':
      case 'middleman_marketplace':
      case 'marketplace':
        return {
          title: 'Verified Livestock Marketplace',
          subtitle: 'Direct farmer-to-buyer cattle trade with AI certified breed authenticity',
        };
      case 'compare_animals':
        return {
          title: 'Side-by-Side Bovine Comparison',
          subtitle: 'Compare specs, milk yields, age, and pricing of up to 3 cattle',
        };
      case 'saved_animals':
        return {
          title: 'Watchlist & Shortlisted Cattle',
          subtitle: 'Saved bovines for purchase negotiation and follow-up',
        };
      case 'farmer_enquiries':
      case 'middleman_enquiries':
        return {
          title: 'Trade Enquiries & Bids',
          subtitle: 'Real-time offers and negotiation messages between buyers and farmers',
        };
      case 'vets':
        return {
          title: 'Veterinary Polyclinics & 1962 Care',
          subtitle: 'Discover government veterinary hospitals, doctors and 24x7 ambulance',
        };
      case 'breeds':
        return {
          title: 'ICAR-NBAGR Breed Standards',
          subtitle: 'Official registry of 41 indigenous cattle and buffalo breeds in India',
        };
      case 'system_info':
        return {
          title: 'System Diagnostics & Model Specs',
          subtitle: 'PyTorch EfficientNet-B0 runtime, test harness & API health',
        };
      case 'dashboard':
        return {
          title: 'Platform Analytics & Visuals',
          subtitle: 'Telemetry data, breed distribution, and verification rates',
        };
      case 'history':
        return {
          title: 'Classification History & Audits',
          subtitle: 'Permanent log of past bovine scans and verification outcomes',
        };
      default:
        return {
          title: 'PashuPehchan Platform',
          subtitle: 'AI-Assisted Indigenous Cattle & Buffalo Verification',
        };
    }
  };

  const { title, subtitle } = getScreenTitle();

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (onSearchChange) onSearchChange(text);
  };

  return (
    <View style={styles.topBarContainer}>
      {/* Left: Title & Breadcrumbs */}
      <View style={styles.titleArea}>
        <Image
          source={{ uri: '/logo.png' }}
          style={styles.topBarLogo}
          resizeMode="contain"
        />
        <View style={styles.titleTextCol}>
          <Text style={styles.pageTitle}>{title}</Text>
          <Text style={styles.pageSubtitle}>{subtitle}</Text>
        </View>
      </View>

      {/* Right: Quick Search + Fast CTA + Role + Model */}
      <View style={styles.actionsArea}>
        {/* Global Search Bar */}
        <View style={styles.searchBox}>
          <Search size={15} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ear tag, breed, or town..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Primary CTA: Scan New Bovine */}
        {currentScreen !== 'scan' && (
          <TouchableOpacity
            style={styles.scanCtaBtn}
            onPress={() => onNavigate('scan')}
            activeOpacity={0.85}
          >
            <Camera size={15} color="#ffffff" />
            <Text style={styles.scanCtaText}>+ AI Scan</Text>
          </TouchableOpacity>
        )}

        {/* Live Model Status Indicator */}
        <View
          style={[
            styles.modelPill,
            isBackendConnected ? styles.modelPillOnline : styles.modelPillOffline,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              isBackendConnected ? styles.dotOnline : styles.dotOffline,
            ]}
          />
          <Text style={styles.modelPillText}>
            {isBackendConnected ? `Model: ${activeDevice}` : 'Offline'}
          </Text>
        </View>

        {/* 1-Click Role Switcher */}
        <View style={styles.roleDropdownWrapper}>
          <TouchableOpacity
            style={styles.roleBtn}
            onPress={() => setShowRoleMenu(!showRoleMenu)}
            activeOpacity={0.8}
          >
            <UserCheck size={14} color={colors.primary} />
            <Text style={styles.roleBtnText}>
              {role === 'MIDDLEMAN'
                ? 'Middleman'
                : role === 'ADMIN'
                ? 'Supervisor'
                : 'Farmer'}
            </Text>
            <ChevronDown size={13} color={colors.textSecondary} />
          </TouchableOpacity>

          {showRoleMenu && (
            <View style={styles.roleDropdownMenu}>
              <TouchableOpacity
                style={[styles.roleMenuItem, role === 'FARMER' && styles.roleMenuItemActive]}
                onPress={() => handleRoleSwitch('FARMER')}
              >
                <Text style={styles.roleMenuItemText}>🌾 Farmer (Ramesh)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleMenuItem,
                  role === 'MIDDLEMAN' && styles.roleMenuItemActive,
                ]}
                onPress={() => handleRoleSwitch('MIDDLEMAN')}
              >
                <Text style={styles.roleMenuItemText}>🤝 Middleman (Kishore)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleMenuItem, role === 'ADMIN' && styles.roleMenuItemActive]}
                onPress={() => handleRoleSwitch('ADMIN')}
              >
                <Text style={styles.roleMenuItemText}>🛡️ Admin (Supervisor)</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* System Diagnostics */}
        <TouchableOpacity
          style={[
            styles.iconBtn,
            currentScreen === 'system_info' && styles.iconBtnActive,
          ]}
          onPress={() => onNavigate('system_info')}
          title="System Diagnostics"
        >
          <Info
            size={18}
            color={currentScreen === 'system_info' ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBarContainer: {
    height: 68,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 90,
  },
  titleArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: 16,
  },
  topBarLogo: {
    width: 44,
    height: 44,
  },
  titleTextCol: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  pageSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  actionsArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    width: 220,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: colors.textPrimary,
    padding: 0,
    outlineStyle: 'none' as any,
  },
  scanCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    shadowColor: '#166534',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  scanCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  modelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
  },
  modelPillOnline: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
  },
  modelPillOffline: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  dotOnline: {
    backgroundColor: '#22c55e',
  },
  dotOffline: {
    backgroundColor: '#ef4444',
  },
  modelPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  roleDropdownWrapper: {
    position: 'relative',
    zIndex: 102,
  },
  roleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 8,
  },
  roleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  roleDropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    width: 170,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 120,
  },
  roleMenuItem: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  roleMenuItemActive: {
    backgroundColor: colors.primarySoft,
  },
  roleMenuItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
  },
});
