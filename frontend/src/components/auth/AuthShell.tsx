import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Sparkles, ShieldCheck, Cpu } from 'lucide-react';
import { colors } from '../../theme/colors';

interface AuthShellProps {
  children: React.ReactNode;
  onBackToHome?: () => void;
  title?: string;
  subtitle?: string;
}

export const AuthShell: React.FC<AuthShellProps> = ({
  children,
  onBackToHome,
}) => {
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundContainer}>
        {/* Top Header Row */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.brandRow}
            onPress={onBackToHome}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: '/logo.png' }}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.brandTitle}>PashuPehchan</Text>
              <Text style={styles.brandSub}>AI-ASSISTED LIVESTOCK PLATFORM</Text>
            </View>
          </TouchableOpacity>

          {onBackToHome && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackToHome}
              activeOpacity={0.8}
            >
              <ArrowLeft size={16} color={colors.textSecondary} />
              <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Main Body */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            isDesktop && styles.desktopScrollContent,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.layoutWrapper,
              isDesktop && styles.desktopLayoutWrapper,
              isTablet && styles.tabletLayoutWrapper,
            ]}
          >
            {/* Desktop Left Visual Panel */}
            {isDesktop && (
              <View style={styles.leftVisualSection}>
                <View style={styles.heroCard}>
                  <Image
                    source={{ uri: '/auth_agricultural_hero.jpg' }}
                    style={styles.heroImage}
                    resizeMode="cover"
                  />
                  {/* Subtle Gradient & Floating Content Overlay */}
                  <View style={styles.heroOverlay}>
                    <View style={styles.heroTagRow}>
                      <View style={styles.heroTagPill}>
                        <Sparkles size={13} color="#FFFFFF" />
                        <Text style={styles.heroTagText}>Next-Gen Agriculture</Text>
                      </View>
                      <View style={styles.heroTagPill}>
                        <Cpu size={13} color="#FFFFFF" />
                        <Text style={styles.heroTagText}>ICAR-NBAGR AI Model</Text>
                      </View>
                    </View>

                    <View style={styles.heroTextContainer}>
                      <Text style={styles.heroHeadline}>
                        Know your livestock.{'\n'}Care for them better.
                      </Text>
                      <Text style={styles.heroDescription}>
                        Smarter livestock care, digital herd records, and direct market connectivity
                        for India's farmers and traders.
                      </Text>
                    </View>

                    {/* Trust Proof Badges */}
                    <View style={styles.trustBadgesRow}>
                      <View style={styles.trustBadge}>
                        <ShieldCheck size={16} color="#4ADE80" />
                        <Text style={styles.trustBadgeText}>41 Bovine Breeds</Text>
                      </View>
                      <View style={styles.trustDivider} />
                      <View style={styles.trustBadge}>
                        <Text style={styles.trustBadgeEmoji}>⚡</Text>
                        <Text style={styles.trustBadgeText}>35ms Fast Inference</Text>
                      </View>
                      <View style={styles.trustDivider} />
                      <View style={styles.trustBadge}>
                        <Text style={styles.trustBadgeEmoji}>🤝</Text>
                        <Text style={styles.trustBadgeText}>Zero-Brokerage Trade</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Mobile / Tablet Compact Visual Header */}
            {!isDesktop && (
              <View style={styles.mobileVisualBanner}>
                <Image
                  source={{ uri: '/auth_agricultural_hero.jpg' }}
                  style={styles.mobileHeroImage}
                  resizeMode="cover"
                />
                <View style={styles.mobileHeroOverlay}>
                  <View style={styles.mobileTagPill}>
                    <Sparkles size={12} color="#FFFFFF" />
                    <Text style={styles.mobileTagText}>AI Livestock Intelligence</Text>
                  </View>
                  <Text style={styles.mobileHeadline}>
                    Know your livestock. Care for them better.
                  </Text>
                </View>
              </View>
            )}

            {/* Right Authentication Card Container */}
            <View
              style={[
                styles.rightFormSection,
                isDesktop && styles.desktopRightFormSection,
              ]}
            >
              {children}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F8F5',
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#F1F8F5',
    ...Platform.select({
      web: {
        backgroundImage: 'radial-gradient(ellipse at top left, #EAF3FB 0%, #F1F9F4 50%, #FEFCE8 100%)',
        minHeight: '100vh',
      },
    }),
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 16,
    zIndex: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F3D24',
    letterSpacing: -0.4,
  },
  brandSub: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
    marginTop: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2EFE7',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(15, 61, 36, 0.04)',
      },
    }),
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  desktopScrollContent: {
    paddingHorizontal: 40,
    paddingBottom: 40,
    justifyContent: 'center',
    minHeight: '85vh' as any,
  },
  layoutWrapper: {
    width: '100%',
    maxWidth: 1240,
    flexDirection: 'column',
    alignItems: 'center',
  },
  desktopLayoutWrapper: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: 48,
    minHeight: 640,
  },
  tabletLayoutWrapper: {
    maxWidth: 720,
  },
  // Desktop Left Visual
  leftVisualSection: {
    flex: 1.1,
    minHeight: 620,
  },
  heroCard: {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: 620,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: '#0F3D24',
    ...Platform.select({
      web: {
        boxShadow: '0 24px 60px -12px rgba(15, 61, 36, 0.18)',
      },
    }),
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 61, 36, 0.38)',
    padding: 36,
    justifyContent: 'space-between',
    ...Platform.select({
      web: {
        backgroundImage: 'linear-gradient(to top, rgba(10, 42, 25, 0.92) 0%, rgba(15, 61, 36, 0.35) 45%, rgba(15, 61, 36, 0.2) 100%)',
      },
    }),
  },
  heroTagRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  heroTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
      },
    }),
  },
  heroTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heroTextContainer: {
    marginTop: 'auto',
    marginBottom: 28,
  },
  heroHeadline: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 40,
    letterSpacing: -0.6,
    marginBottom: 12,
    ...Platform.select({
      web: {
        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
      },
    }),
  },
  heroDescription: {
    fontSize: 15,
    fontWeight: '500',
    color: '#E8F5E9',
    lineHeight: 22,
    maxWidth: 440,
  },
  trustBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustBadgeEmoji: {
    fontSize: 14,
  },
  trustBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  trustDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  // Mobile Banner
  mobileVisualBanner: {
    width: '100%',
    height: 140,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
    marginTop: 4,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(15, 61, 36, 0.1)',
      },
    }),
  },
  mobileHeroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  mobileHeroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 42, 25, 0.65)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  mobileTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  mobileTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  mobileHeadline: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
  },
  // Right Form
  rightFormSection: {
    width: '100%',
    maxWidth: 520,
  },
  desktopRightFormSection: {
    flex: 0.95,
    justifyContent: 'center',
  },
});
