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
  MessageSquare,
  Phone,
  Check,
  X,
  Clock,
  User,
  ShieldCheck,
} from 'lucide-react';
import { colors } from '../../theme/colors';
import { ScreenName, Enquiry } from '../../types';
import * as api from '../../services/api';
import { initiatePhoneCall } from '../../components/adapters/contact';

interface FarmerEnquiriesScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const FarmerEnquiriesScreen: React.FC<FarmerEnquiriesScreenProps> = ({
  onNavigate,
}) => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await api.getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.warn('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await api.updateEnquiryStatus(id, status);
      setEnquiries(
        enquiries.map((e) => (e.id === id ? { ...e, status } : e))
      );
    } catch (err: any) {
      alert(err.message);
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
  const cardDesktopWidth =
    windowWidth >= 1350
      ? ('calc(33.333% - 11px)' as any)
      : ('calc(50% - 8px)' as any);

  return (
    <View style={[styles.container, isDesktop && styles.desktopContainer]}>
      <View style={styles.header}>
        <Text style={styles.title}>Buyer Enquiries</Text>
        <Text style={styles.subtitle}>
          Direct offers from middlemen and verified buyers for your livestock
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Fetching enquiries...</Text>
        </View>
      ) : (
        <ScrollView
          style={isDesktop ? styles.desktopScrollView : undefined}
          contentContainerStyle={[styles.list, isDesktop && styles.desktopList]}
        >
          {enquiries.length === 0 ? (
            <View style={styles.emptyCard}>
              <MessageSquare size={36} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No pending enquiries</Text>
              <Text style={styles.emptySub}>
                When middlemen make offers on your marketplace listings, they will appear here.
              </Text>
            </View>
          ) : (
            enquiries.map((enquiry) => (
              <View
                key={enquiry.id}
                style={[
                  styles.card,
                  isDesktop && { width: cardDesktopWidth, maxWidth: cardDesktopWidth },
                ]}
              >
                <View style={styles.cardTop}>
                  <View style={styles.buyerInfo}>
                    <View style={styles.buyerAvatar}>
                      <User size={18} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.buyerName}>
                        {enquiry.sender_name || 'Kishore Bhai (Middleman)'}
                      </Text>
                      <Text style={styles.listingRef}>
                        Regarding: {enquiry.listing_title || 'Gir Cow #105'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      enquiry.status === 'ACCEPTED' && { backgroundColor: colors.successBg },
                      enquiry.status === 'REJECTED' && { backgroundColor: colors.dangerBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        enquiry.status === 'ACCEPTED' && { color: colors.success },
                        enquiry.status === 'REJECTED' && { color: colors.danger },
                      ]}
                    >
                      {enquiry.status}
                    </Text>
                  </View>
                </View>

                {/* Offer Price Highlight */}
                {enquiry.offered_price && (
                  <View style={styles.priceOfferRow}>
                    <Text style={styles.offerLabel}>Offered Price:</Text>
                    <Text style={styles.offerValue}>
                      ₹{enquiry.offered_price.toLocaleString('en-IN')}
                    </Text>
                  </View>
                )}

                <Text style={styles.messageBox}>"{enquiry.message}"</Text>

                {/* Actions */}
                <View style={styles.actionRow}>
                  {enquiry.sender_phone && (
                    <TouchableOpacity
                      style={styles.callBtn}
                      onPress={() => initiatePhoneCall(enquiry.sender_phone || '9876543210')}
                    >
                      <Phone size={13} color="#ffffff" />
                      <Text style={styles.callBtnText}>Call Buyer</Text>
                    </TouchableOpacity>
                  )}

                  {enquiry.status === 'PENDING' && (
                    <View style={styles.decisionBtns}>
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => handleUpdateStatus(enquiry.id, 'REJECTED')}
                      >
                        <X size={14} color={colors.danger} />
                        <Text style={styles.rejectBtnText}>Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.acceptBtn}
                        onPress={() => handleUpdateStatus(enquiry.id, 'ACCEPTED')}
                      >
                        <Check size={14} color="#ffffff" />
                        <Text style={styles.acceptBtnText}>Accept Offer</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  desktopContainer: {
    backgroundColor: 'transparent',
  },
  desktopScrollView: {
    overflow: 'visible' as any,
    flex: 'none' as any,
    height: 'auto' as any,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2EFE7',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F3D24',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#365345',
    marginTop: 2,
  },
  list: {
    padding: 16,
    gap: 16,
  },
  desktopList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2EFE7',
    boxShadow: '0 4px 16px rgba(15, 61, 36, 0.04)',
    gap: 14,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buyerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buyerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDF9F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F3D24',
  },
  listingRef: {
    fontSize: 11,
    color: '#365345',
    marginTop: 2,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.3,
  },
  priceOfferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F7FCF9',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2EFE7',
  },
  offerLabel: {
    fontSize: 12,
    color: '#658071',
    fontWeight: '600',
  },
  offerValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F3D24',
  },
  messageBox: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#142820',
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2EFE7',
    paddingTop: 12,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#16A34A',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 14,
    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
  },
  callBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  decisionBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  rejectBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: '#16A34A',
    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
  },
  acceptBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loadingBox: {
    padding: 40,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: '#365345',
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 36,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2EFE7',
    boxShadow: '0 4px 16px rgba(15, 61, 36, 0.04)',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F3D24',
  },
  emptySub: {
    fontSize: 12,
    color: '#365345',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
});
