import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Camera,
  Layers,
  ShoppingBag,
  Stethoscope,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
  AlertTriangle,
  Upload,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { colors } from '../../theme/colors';
import { ScreenName, FarmerDashboardData } from '../../types';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';
import { initiatePhoneCall } from '../../components/adapters/contact';
import { openMapDirections } from '../../components/adapters/maps';

interface FarmerHomeScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const FarmerHomeScreen: React.FC<FarmerHomeScreenProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<FarmerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Responsive desktop detection
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

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await api.getFarmerDashboard();
      setDashboard(data);
    } catch (err) {
      console.warn('Failed to load farmer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, isDesktop && styles.desktopContainer]}
      contentContainerStyle={[styles.content, isDesktop && styles.desktopContent]}
      showsVerticalScrollIndicator={false}
    >
      {/* Farm Mora Welcoming Hero Section */}
      <View style={[styles.heroCard, isDesktop && styles.desktopHeroCard]}>
        <View style={styles.heroMainCol}>
          {/* Top Tag Pill */}
          <View style={styles.heroTagPill}>
            <View style={styles.heroTagDot} />
            <Text style={styles.heroTagText}>AI-Assisted Livestock Intelligence • 41 Indigenous Breeds</Text>
          </View>

          {/* Large Welcoming Headline */}
          <Text style={[styles.heroHeadline, isDesktop && styles.desktopHeroHeadline]}>
            Smart livestock management, powered by AI.
          </Text>

          {/* Calming Subtitle */}
          <Text style={styles.heroSubtitle}>
            Identify, verify and manage your cattle and buffalo with one connected platform.
          </Text>

          {/* Action Pills Row */}
          <View style={styles.heroActionsRow}>
            <TouchableOpacity
              style={styles.heroPrimaryPill}
              onPress={() => onNavigate('scan')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroPrimaryPillText}>AI Breed Scan ↗</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroSecondaryPill}
              onPress={() => onNavigate('my_livestock')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroSecondaryPillText}>My Herd ({dashboard?.total_animals ?? 4})</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroTertiaryPill}
              onPress={() => onNavigate('vets')}
              activeOpacity={0.85}
            >
              <Stethoscope size={14} color={colors.primaryDark} />
              <Text style={styles.heroTertiaryPillText}>Find a Vet</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Info Emblem & Farmer Location Badge */}
        <View style={[styles.heroRightBadge, isDesktop && styles.desktopHeroRightBadge]}>
          <View style={styles.farmerPill}>
            <Text style={styles.farmerGreeting}>Namaste, {user?.name || 'Farmer'} 🙏</Text>
            <View style={styles.farmerDistrictPill}>
              <MapPin size={11} color={colors.primary} />
              <Text style={styles.farmerDistrictText}>
                {user?.district || 'Anand'}, {user?.state || 'Gujarat'}
              </Text>
            </View>
          </View>

          <View style={styles.icarTrustBox}>
            <Image
              source={{ uri: '/logo.png' }}
              style={styles.icarLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.icarTitle}>PashuPehchan</Text>
              <Text style={styles.icarSubtitle}>ICAR-NBAGR Recognized</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Top 4 KPI Metrics Row — 24px Radius Calm Cards */}
      <View style={[styles.statsRow, isDesktop && styles.desktopStatsRow]}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => onNavigate('my_livestock')}
          activeOpacity={0.8}
        >
          <View style={styles.statCardHeader}>
            <Text style={styles.statVal}>{dashboard?.total_animals ?? 4}</Text>
            <View style={[styles.statIconBox, { backgroundColor: colors.primarySoft }]}>
              <Layers size={18} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.statLbl}>Registered Herd</Text>
          <Text style={styles.statDetail}>100% tagged & health tracked</Text>
        </TouchableOpacity>

        <View style={styles.statCard}>
          <View style={styles.statCardHeader}>
            <Text style={[styles.statVal, { color: colors.success }]}>4 / 4</Text>
            <View style={[styles.statIconBox, { backgroundColor: colors.successBg }]}>
              <ShieldCheck size={18} color={colors.success} />
            </View>
          </View>
          <Text style={styles.statLbl}>Verified Indigenous</Text>
          <Text style={styles.statDetail}>Gir, Murrah & Kankrej</Text>
        </View>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => onNavigate('farmer_marketplace')}
          activeOpacity={0.8}
        >
          <View style={styles.statCardHeader}>
            <Text style={[styles.statVal, { color: colors.accent }]}>
              {dashboard?.for_sale_count ?? 1}
            </Text>
            <View style={[styles.statIconBox, { backgroundColor: colors.accentSoft }]}>
              <ShoppingBag size={18} color={colors.warning} />
            </View>
          </View>
          <Text style={styles.statLbl}>Listed for Sale</Text>
          <Text style={styles.statDetail}>Active marketplace trade</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => onNavigate('farmer_enquiries')}
          activeOpacity={0.8}
        >
          <View style={styles.statCardHeader}>
            <Text style={[styles.statVal, { color: colors.info }]}>
              {dashboard?.pending_enquiries ?? 2}
            </Text>
            <View style={[styles.statIconBox, { backgroundColor: colors.infoBg }]}>
              <PhoneCall size={18} color={colors.info} />
            </View>
          </View>
          <Text style={styles.statLbl}>Buyer Enquiries</Text>
          <Text style={styles.statDetail}>Offers awaiting response</Text>
        </TouchableOpacity>
      </View>

      {/* Main Multi-Column Content Area on Desktop */}
      <View style={[styles.mainLayout, isDesktop && styles.desktopMainLayout]}>
        {/* Left / Primary Column (Hero Feature + Services + Herd Highlights) */}
        <View style={[styles.primaryCol, isDesktop && styles.desktopPrimaryCol]}>
          {/* Flagship Feature: AI Breed Scan Card */}
          <TouchableOpacity
            style={styles.flagshipScanCard}
            onPress={() => onNavigate('scan')}
            activeOpacity={0.9}
          >
            <View style={styles.flagshipLeft}>
              <View style={styles.cameraIconCircle}>
                <Camera size={26} color="#ffffff" />
              </View>
              <View style={styles.flagshipTextCol}>
                <View style={styles.flagshipPill}>
                  <Sparkles size={12} color={colors.primaryDark} />
                  <Text style={styles.flagshipPillText}>Neural Breed Recognition</Text>
                </View>
                <Text style={styles.flagshipTitle}>Scan New Cattle / Buffalo</Text>
                <Text style={styles.flagshipDesc}>
                  Instant photo classification across 41 indigenous breeds with top-3 confidence
                  scores, physical breed traits & ear-tag registry attachment.
                </Text>
              </View>
            </View>
            <View style={styles.flagshipArrowBtn}>
              <ArrowRight size={20} color="#ffffff" />
            </View>
          </TouchableOpacity>

          {/* Quick Farmer Services Grid */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Farmer Services</Text>
          </View>

          <View style={[styles.actionGrid, isDesktop && styles.desktopActionGrid]}>
            <TouchableOpacity
              style={[styles.actionTile, isDesktop && styles.desktopActionTile]}
              onPress={() => onNavigate('my_livestock')}
              activeOpacity={0.8}
            >
              <View style={[styles.tileIcon, { backgroundColor: colors.primarySoft }]}>
                <Layers size={22} color={colors.primary} />
              </View>
              <Text style={styles.tileTitle}>Livestock Herd</Text>
              <Text style={styles.tileSub}>Manage ear tags & lactation status</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionTile, isDesktop && styles.desktopActionTile]}
              onPress={() => onNavigate('farmer_marketplace')}
              activeOpacity={0.8}
            >
              <View style={[styles.tileIcon, { backgroundColor: colors.accentSoft }]}>
                <ShoppingBag size={22} color={colors.warning} />
              </View>
              <Text style={styles.tileTitle}>Marketplace</Text>
              <Text style={styles.tileSub}>Sell with verified breed certificate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionTile, isDesktop && styles.desktopActionTile]}
              onPress={() => onNavigate('vets')}
              activeOpacity={0.8}
            >
              <View style={[styles.tileIcon, { backgroundColor: colors.infoBg }]}>
                <Stethoscope size={22} color={colors.info} />
              </View>
              <Text style={styles.tileTitle}>Find a Vet</Text>
              <Text style={styles.tileSub}>Govt polyclinics & 1962 ambulance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionTile, isDesktop && styles.desktopActionTile]}
              onPress={() => onNavigate('breeds')}
              activeOpacity={0.8}
            >
              <View style={[styles.tileIcon, { backgroundColor: colors.buffaloBg }]}>
                <ShieldCheck size={22} color={colors.buffaloBadge} />
              </View>
              <Text style={styles.tileTitle}>Breed Encyclopedia</Text>
              <Text style={styles.tileSub}>41 ICAR official standards</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Animals Preview */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>My Herd Highlights</Text>
            <TouchableOpacity onPress={() => onNavigate('my_livestock')}>
              <Text style={styles.seeAllText}>View All ({dashboard?.total_animals ?? 4}) →</Text>
            </TouchableOpacity>
          </View>

          {dashboard?.recent_animals && dashboard.recent_animals.length > 0 ? (
            <View style={[styles.animalList, isDesktop && styles.desktopAnimalList]}>
              {dashboard.recent_animals.map((animal) => (
                <TouchableOpacity
                  key={animal.id}
                  style={[styles.animalCard, isDesktop && styles.desktopAnimalCard]}
                  onPress={() => onNavigate('my_livestock')}
                  activeOpacity={0.85}
                >
                  <View style={styles.animalCardLeft}>
                    <View style={styles.animalThumb}>
                      <Text style={styles.animalEmoji}>
                        {animal.species === 'Buffalo' ? '🐃' : '🐄'}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.animalBreed}>{animal.breed}</Text>
                      <Text style={styles.animalTag}>Tag: {animal.tag_number || 'IN-2024-001'}</Text>
                      <Text style={styles.animalYield}>
                        {animal.daily_milk_yield_litres
                          ? `🥛 ${animal.daily_milk_yield_litres} L/day`
                          : 'Dry / Bull'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.animalCardRight}>
                    <View style={styles.verifiedBadge}>
                      <ShieldCheck size={12} color={colors.success} />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                    <ChevronRight size={16} color={colors.textMuted} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No livestock records yet</Text>
              <Text style={styles.emptySub}>
                Scan cattle photo above to verify breed and save to herd
              </Text>
            </View>
          )}
        </View>

        {/* Right / Secondary Column on Desktop (Instant Scan Widget + Nearest Vet + 1962 Helpline) */}
        <View style={[styles.secondaryCol, isDesktop && styles.desktopSecondaryCol]}>
          {/* Quick Scanner Launch Widget */}
          <View style={styles.quickScanWidget}>
            <View style={styles.widgetHeader}>
              <View style={styles.widgetHeaderLeft}>
                <Camera size={18} color={colors.primary} />
                <Text style={styles.widgetTitle}>Instant Breed Identifier</Text>
              </View>
              <View style={styles.widgetBadge}>
                <Text style={styles.widgetBadgeText}>PyTorch CPU</Text>
              </View>
            </View>
            <Text style={styles.widgetSub}>
              Upload a clear side-profile photo of your cattle or buffalo to classify indigenous breed.
            </Text>

            <TouchableOpacity
              style={styles.widgetDropzone}
              onPress={() => onNavigate('scan')}
              activeOpacity={0.85}
            >
              <View style={styles.dropzoneIconWrap}>
                <Upload size={24} color={colors.primary} />
              </View>
              <Text style={styles.widgetDropzoneTitle}>Upload or Take Photo</Text>
              <Text style={styles.widgetDropzoneSub}>Click to launch AI camera scanner</Text>
            </TouchableOpacity>

            <View style={styles.sampleRow}>
              <Text style={styles.sampleLabel}>Quick Samples:</Text>
              <View style={styles.sampleChips}>
                {['Gir', 'Murrah', 'Sahiwal', 'Kankrej'].map((b) => (
                  <TouchableOpacity
                    key={b}
                    style={styles.sampleChip}
                    onPress={() => onNavigate('scan')}
                  >
                    <Text style={styles.sampleChipText}>{b}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Nearest Veterinary Polyclinic */}
          <View style={styles.vetWidget}>
            <View style={styles.vetWidgetHeader}>
              <View style={styles.vetWidgetHeaderLeft}>
                <Stethoscope size={18} color={colors.info} />
                <Text style={styles.vetWidgetTitle}>Nearest Veterinary Care</Text>
              </View>
              <View style={styles.emergencyPill}>
                <Text style={styles.emergencyPillText}>24x7</Text>
              </View>
            </View>
            <Text style={styles.vetClinicName}>
              Government Veterinary Polyclinic & Hospital
            </Text>
            <Text style={styles.vetClinicAddress}>
              📍 Anand Agricultural University Campus, Anand, Gujarat
            </Text>
            <Text style={styles.vetDistance}>🚗 2.5 km away • Open Now</Text>

            <View style={styles.vetActionsRow}>
              <TouchableOpacity
                style={styles.vetCallBtn}
                onPress={() => initiatePhoneCall('02692-261234')}
                activeOpacity={0.8}
              >
                <PhoneCall size={14} color={colors.primaryDark} />
                <Text style={styles.vetCallText}>Call Clinic</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.vetDirectionsBtn}
                onPress={() =>
                  openMapDirections(22.5645, 72.9289, 'Government Veterinary Polyclinic')
                }
                activeOpacity={0.8}
              >
                <ExternalLink size={14} color="#ffffff" />
                <Text style={styles.vetDirectionsText}>Directions</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Emergency Helpline 1962 Card */}
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyLeft}>
              <View style={styles.emergencyIconBox}>
                <AlertTriangle size={20} color="#ffffff" />
              </View>
              <View>
                <Text style={styles.emergencyTitle}>1962 Pashu Ambulance</Text>
                <Text style={styles.emergencySub}>Govt 24x7 Animal Health Emergency</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.callNowBtn}
              onPress={() => initiatePhoneCall('1962')}
              activeOpacity={0.85}
            >
              <PhoneCall size={14} color="#7f1d1d" />
              <Text style={styles.callNowText}>Call 1962</Text>
            </TouchableOpacity>
          </View>
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
  desktopContainer: {
    flex: 'none' as any,
    height: 'auto' as any,
    overflow: 'visible' as any,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 16,
    gap: 18,
  },
  desktopContent: {
    padding: 0,
    paddingBottom: 40,
    gap: 24,
  },

  /* Farm Mora Hero Banner */
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2EFE7',
    padding: 22,
    boxShadow: '0 4px 20px rgba(15, 61, 36, 0.05)',
    gap: 18,
  },
  desktopHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 28,
    borderRadius: 28,
    gap: 24,
  },
  heroMainCol: {
    flex: 1,
    gap: 12,
  },
  heroTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EDF9F1',
    borderWidth: 1,
    borderColor: '#D1EBD8',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  heroTagDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  heroTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F3D24',
    letterSpacing: 0.2,
  },
  heroHeadline: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F3D24',
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  desktopHeroHeadline: {
    fontSize: 28,
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#365345',
    lineHeight: 19,
    maxWidth: 560,
  },
  heroActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  heroPrimaryPill: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
  },
  heroPrimaryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSecondaryPill: {
    backgroundColor: '#F7FCF9',
    borderWidth: 1,
    borderColor: '#D1EBD8',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 22,
  },
  heroSecondaryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F3D24',
  },
  heroTertiaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EDF9F1',
    borderWidth: 1,
    borderColor: '#D1EBD8',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
  },
  heroTertiaryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F3D24',
  },
  heroRightBadge: {
    gap: 12,
  },
  desktopHeroRightBadge: {
    alignItems: 'flex-end',
  },
  farmerPill: {
    backgroundColor: '#F7FCF9',
    borderWidth: 1,
    borderColor: '#E2EFE7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    gap: 4,
  },
  farmerGreeting: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F3D24',
  },
  farmerDistrictPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  farmerDistrictText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#365345',
  },
  icarTrustBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2EFE7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  icarLogo: {
    width: 32,
    height: 32,
  },
  icarTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F3D24',
  },
  icarSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#365345',
  },

  /* Stats Row */
  statsRow: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
  },
  desktopStatsRow: {
    flexWrap: 'nowrap',
  },
  statCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2EFE7',
    boxShadow: '0 4px 16px rgba(15, 61, 36, 0.04)',
    gap: 6,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statVal: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F3D24',
    letterSpacing: -0.5,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLbl: {
    fontSize: 13,
    fontWeight: '700',
    color: '#142820',
  },
  statDetail: {
    fontSize: 11,
    color: '#365345',
  },

  /* Main Layout */
  mainLayout: {
    flexDirection: 'column',
    gap: 20,
  },
  desktopMainLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  primaryCol: {
    flex: 1,
    gap: 20,
  },
  desktopPrimaryCol: {
    flex: 65,
  },
  secondaryCol: {
    flex: 1,
    gap: 20,
  },
  desktopSecondaryCol: {
    flex: 35,
  },

  /* Flagship Scan Banner */
  flagshipScanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F3D24',
    borderRadius: 24,
    padding: 24,
    boxShadow: '0 8px 24px rgba(15, 61, 36, 0.20)',
  },
  flagshipLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cameraIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  flagshipTextCol: {
    flex: 1,
    gap: 6,
  },
  flagshipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EDF9F1',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  flagshipPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F3D24',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  flagshipTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  flagshipDesc: {
    fontSize: 12,
    color: '#C6E2D0',
    lineHeight: 17,
  },
  flagshipArrowBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
  },

  /* Section Header */
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F3D24',
    letterSpacing: -0.2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },

  /* Services Grid */
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  desktopActionGrid: {
    flexWrap: 'nowrap',
  },
  actionTile: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2EFE7',
    boxShadow: '0 2px 10px rgba(15, 61, 36, 0.04)',
    gap: 6,
  },
  desktopActionTile: {
    flex: 1,
    width: 'auto',
  },
  tileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tileTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#142820',
  },
  tileSub: {
    fontSize: 11,
    color: '#365345',
    lineHeight: 15,
  },

  /* Animal List */
  animalList: {
    gap: 12,
  },
  desktopAnimalList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  animalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2EFE7',
    boxShadow: '0 2px 10px rgba(15, 61, 36, 0.04)',
    width: '100%',
  },
  desktopAnimalCard: {
    width: '48.5%',
  },
  animalCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  animalThumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EDF9F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animalEmoji: {
    fontSize: 24,
  },
  animalBreed: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F3D24',
  },
  animalTag: {
    fontSize: 11,
    color: '#365345',
    marginTop: 2,
  },
  animalYield: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
    marginTop: 2,
  },
  animalCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EDF9F1',
    borderWidth: 1,
    borderColor: '#D1EBD8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2EFE7',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F3D24',
  },
  emptySub: {
    fontSize: 12,
    color: '#365345',
    marginTop: 4,
    textAlign: 'center',
  },

  /* Secondary Column Widgets */
  quickScanWidget: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2EFE7',
    boxShadow: '0 4px 16px rgba(15, 61, 36, 0.04)',
    gap: 12,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  widgetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  widgetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F3D24',
  },
  widgetBadge: {
    backgroundColor: '#EDF9F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1EBD8',
  },
  widgetBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F3D24',
  },
  widgetSub: {
    fontSize: 12,
    color: '#365345',
    lineHeight: 16,
  },
  widgetDropzone: {
    backgroundColor: '#F7FCF9',
    borderWidth: 2,
    borderColor: '#A7D7BC',
    borderStyle: 'dashed' as any,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dropzoneIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDF9F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  widgetDropzoneTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F3D24',
  },
  widgetDropzoneSub: {
    fontSize: 11,
    color: '#365345',
  },
  sampleRow: {
    gap: 8,
  },
  sampleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#365345',
  },
  sampleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sampleChip: {
    backgroundColor: '#F7FCF9',
    borderWidth: 1,
    borderColor: '#E2EFE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sampleChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F3D24',
  },

  /* Veterinary Widget */
  vetWidget: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2EFE7',
    boxShadow: '0 4px 16px rgba(15, 61, 36, 0.04)',
    gap: 8,
  },
  vetWidgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vetWidgetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vetWidgetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F3D24',
  },
  emergencyPill: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  emergencyPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },
  vetClinicName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#142820',
  },
  vetClinicAddress: {
    fontSize: 11,
    color: '#365345',
    lineHeight: 15,
  },
  vetDistance: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
  },
  vetActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  vetCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F7FCF9',
    borderWidth: 1,
    borderColor: '#D1EBD8',
    paddingVertical: 9,
    borderRadius: 14,
  },
  vetCallText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F3D24',
  },
  vetDirectionsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0284C7',
    paddingVertical: 9,
    borderRadius: 14,
  },
  vetDirectionsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Emergency 1962 Card */
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#991B1B',
    padding: 16,
    borderRadius: 20,
    boxShadow: '0 4px 14px rgba(153, 27, 27, 0.25)',
  },
  emergencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  emergencyIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emergencySub: {
    fontSize: 11,
    color: '#FEE2E2',
  },
  callNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  callNowText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#991B1B',
  },
});

