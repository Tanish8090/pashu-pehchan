import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  Search,
  Filter,
  Bookmark,
  Scale,
  ShieldCheck,
  Milk,
  Phone,
  MessageSquare,
  CheckSquare,
  Square,
  DollarSign,
  Send,
  X,
} from 'lucide-react';
import { colors } from '../../theme/colors';
import { ScreenName, MarketplaceListing } from '../../types';
import * as api from '../../services/api';
import { initiatePhoneCall } from '../../components/adapters/contact';

interface MiddlemanMarketplaceScreenProps {
  onNavigate: (screen: ScreenName) => void;
  selectedForCompare?: MarketplaceListing[];
  onToggleCompare?: (listing: MarketplaceListing) => void;
}

export const MiddlemanMarketplaceScreen: React.FC<MiddlemanMarketplaceScreenProps> = ({
  onNavigate,
  selectedForCompare = [],
  onToggleCompare,
}) => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchBreed, setSearchBreed] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<'All' | 'Cattle' | 'Buffalo'>('All');
  const [savedListingIds, setSavedListingIds] = useState<Set<number>>(new Set());

  // Enquiry Modal state
  const [activeEnquiryListing, setActiveEnquiryListing] = useState<MarketplaceListing | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);

  // Local compare selection fallback if parent prop not passed
  const [localCompareList, setLocalCompareList] = useState<MarketplaceListing[]>(selectedForCompare);

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
    fetchListingsAndSaved();
  }, []);

  const fetchListingsAndSaved = async () => {
    setLoading(true);
    try {
      const [allListings, saved] = await Promise.all([
        api.getListings(),
        api.getSavedListings().catch(() => []),
      ]);
      setListings(allListings);
      setSavedListingIds(new Set(saved.map((s) => s.listing_id)));
    } catch (err) {
      console.warn('Failed to load marketplace:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (listingId: number) => {
    const isSaved = savedListingIds.has(listingId);
    try {
      if (isSaved) {
        await api.unsaveListing(listingId);
        const next = new Set(savedListingIds);
        next.delete(listingId);
        setSavedListingIds(next);
      } else {
        await api.saveListing(listingId, 'Watchlist for procurement');
        const next = new Set(savedListingIds);
        next.add(listingId);
        setSavedListingIds(next);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleCompare = (listing: MarketplaceListing) => {
    if (onToggleCompare) {
      onToggleCompare(listing);
    } else {
      const exists = localCompareList.some((l) => l.id === listing.id);
      if (exists) {
        setLocalCompareList(localCompareList.filter((l) => l.id !== listing.id));
      } else {
        if (localCompareList.length >= 3) {
          alert('You can compare up to 3 animals at a time.');
          return;
        }
        setLocalCompareList([...localCompareList, listing]);
      }
    }
  };

  const isSelectedForCompare = (id: number) => {
    const list = onToggleCompare ? selectedForCompare : localCompareList;
    return list.some((l) => l.id === id);
  };

  const compareCount = (onToggleCompare ? selectedForCompare : localCompareList).length;

  const handleSendEnquiry = async () => {
    if (!activeEnquiryListing) return;
    setSubmittingEnquiry(true);
    try {
      await api.createEnquiry({
        listing_id: activeEnquiryListing.id,
        offered_price: offerPrice ? parseFloat(offerPrice) : activeEnquiryListing.asking_price,
        message: offerMessage || `Namaste, I am interested in purchasing your ${activeEnquiryListing.breed || 'cattle'}. Can we inspect?`,
      });
      alert('Offer & enquiry sent to seller!');
      setActiveEnquiryListing(null);
      setOfferPrice('');
      setOfferMessage('');
    } catch (err: any) {
      alert(`Enquiry failed: ${err.message}`);
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  const filtered = listings.filter((l) => {
    if (speciesFilter !== 'All' && l.species !== speciesFilter) return false;
    if (searchBreed.trim()) {
      const q = searchBreed.toLowerCase();
      const matchBreed = l.breed?.toLowerCase().includes(q);
      const matchTitle = l.title?.toLowerCase().includes(q);
      const matchDist = l.location_district?.toLowerCase().includes(q);
      return matchBreed || matchTitle || matchDist;
    }
    return true;
  });

  const cardDesktopWidth =
    windowWidth >= 1350
      ? ('calc(33.333% - 11px)' as any)
      : ('calc(50% - 8px)' as any);

  return (
    <View style={[styles.container, isDesktop && styles.desktopContainer]}>
      {/* Search & Filter Header */}
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <Search size={16} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search breed (e.g. Gir, Murrah) or district..."
            placeholderTextColor={colors.textMuted}
            value={searchBreed}
            onChangeText={setSearchBreed}
          />
        </View>

        <View style={styles.speciesRow}>
          {(['All', 'Cattle', 'Buffalo'] as const).map((spec) => (
            <TouchableOpacity
              key={spec}
              style={[styles.speciesBtn, speciesFilter === spec && styles.speciesBtnActive]}
              onPress={() => setSpeciesFilter(spec)}
            >
              <Text
                style={[
                  styles.speciesBtnText,
                  speciesFilter === spec && styles.speciesBtnTextActive,
                ]}
              >
                {spec}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Floating Compare Bar if items selected */}
      {compareCount > 0 && (
        <View style={styles.compareBar}>
          <Text style={styles.compareBarText}>
            ⚖️ {compareCount} animal{compareCount > 1 ? 's' : ''} selected for comparison
          </Text>
          <TouchableOpacity
            style={styles.compareActionBtn}
            onPress={() => onNavigate('compare_animals')}
          >
            <Text style={styles.compareActionText}>Compare Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Fetching marketplace listings...</Text>
        </View>
      ) : (
        <ScrollView
          style={isDesktop ? styles.desktopScrollView : undefined}
          contentContainerStyle={[styles.list, isDesktop && styles.desktopList]}
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No matching cattle or buffalo listings</Text>
              <Text style={styles.emptySub}>Try adjusting search term or species filter.</Text>
            </View>
          ) : (
            filtered.map((item) => {
              const saved = savedListingIds.has(item.id);
              const compared = isSelectedForCompare(item.id);

              return (
                <View
                  key={item.id}
                  style={[
                    styles.card,
                    isDesktop && styles.desktopCard,
                    isDesktop && { width: cardDesktopWidth, maxWidth: cardDesktopWidth },
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.avatar}>
                      <Text style={{ fontSize: 22 }}>
                        {item.species === 'Buffalo' ? '🐃' : '🐄'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemSubtitle}>
                        📍 {item.location_district || 'Anand'}, {item.location_state || 'Gujarat'}
                      </Text>
                    </View>

                    {/* Bookmark action */}
                    <TouchableOpacity
                      style={[styles.iconActionBtn, saved && styles.iconActionBtnActive]}
                      onPress={() => handleToggleSave(item.id)}
                    >
                      <Bookmark
                        size={16}
                        color={saved ? colors.accent : colors.textSecondary}
                        fill={saved ? colors.accent : 'none'}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Badges and specs */}
                  <View style={styles.specsRow}>
                    <View style={styles.verifiedBadge}>
                      <ShieldCheck size={12} color={colors.success} />
                      <Text style={styles.verifiedText}>
                        {item.breed || 'Indigenous'} Verified ({Math.round((item.confidence_score || 0.85) * 100)}%)
                      </Text>
                    </View>
                    <View style={styles.yieldBadge}>
                      <Milk size={12} color={colors.primary} />
                      <Text style={styles.yieldText}>
                        {item.daily_milk_yield_litres ? `${item.daily_milk_yield_litres} L/day` : '12 L/day'}
                      </Text>
                    </View>
                  </View>

                  {/* Price Row & Compare Checkbox */}
                  <View style={styles.priceRow}>
                    <View>
                      <Text style={styles.priceLabel}>Asking Price</Text>
                      <Text style={styles.priceVal}>
                        ₹{item.asking_price?.toLocaleString('en-IN')}
                      </Text>
                    </View>

                    {/* Compare Checkbox */}
                    <TouchableOpacity
                      style={styles.compareToggle}
                      onPress={() => handleToggleCompare(item)}
                    >
                      {compared ? (
                        <CheckSquare size={18} color={colors.primary} />
                      ) : (
                        <Square size={18} color={colors.textSecondary} />
                      )}
                      <Text style={styles.compareToggleText}>
                        {compared ? 'Selected' : 'Compare'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Actions: Call Farmer & Make Offer */}
                  <View style={styles.cardFooter}>
                    {item.seller_phone && (
                      <TouchableOpacity
                        style={styles.callBtn}
                        onPress={() => initiatePhoneCall(item.seller_phone || '9876543210')}
                      >
                        <Phone size={13} color="#ffffff" />
                        <Text style={styles.callBtnText}>Call Farmer</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.offerBtn}
                      onPress={() => {
                        setActiveEnquiryListing(item);
                        setOfferPrice(String(item.asking_price || ''));
                      }}
                    >
                      <MessageSquare size={13} color={colors.primary} />
                      <Text style={styles.offerBtnText}>Send Offer / Inquiry</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Make Enquiry Modal */}
      {activeEnquiryListing && (
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalTop}>
              <Text style={styles.modalTitle}>Make Offer to Farmer</Text>
              <TouchableOpacity onPress={() => setActiveEnquiryListing(null)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Cattle: <Text style={{ fontWeight: '700' }}>{activeEnquiryListing.breed}</Text> (
              Asking ₹{activeEnquiryListing.asking_price?.toLocaleString('en-IN')})
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Offered Price (₹)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={offerPrice}
                onChangeText={setOfferPrice}
                placeholder="Enter offer amount"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Message to Seller</Text>
              <TextInput
                style={[styles.textInput, { height: 70 }]}
                multiline
                value={offerMessage}
                onChangeText={setOfferMessage}
                placeholder="e.g. Can we arrange physical veterinary inspection tomorrow?"
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setActiveEnquiryListing(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSendBtn}
                onPress={handleSendEnquiry}
                disabled={submittingEnquiry}
              >
                {submittingEnquiry ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Send size={14} color="#ffffff" />
                    <Text style={styles.modalSendText}>Submit Offer</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    paddingVertical: 9,
  },
  speciesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  speciesBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  speciesBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  speciesBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  speciesBtnTextActive: {
    color: '#ffffff',
  },
  compareBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 14,
    marginTop: 8,
    boxShadow: '0 2px 6px rgba(30, 92, 78, 0.25)',
  },
  compareBarText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  compareActionBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  compareActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  desktopContainer: {
    backgroundColor: 'transparent',
  },
  desktopScrollView: {
    overflow: 'visible' as any,
    flex: 'none' as any,
    height: 'auto' as any,
    backgroundColor: 'transparent',
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
  desktopCard: {
    minWidth: 290,
    flexGrow: 1,
    flexShrink: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EDF9F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F3D24',
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#365345',
    marginTop: 2,
  },
  iconActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7FCF9',
    borderWidth: 1,
    borderColor: '#E2EFE7',
  },
  iconActionBtnActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  specsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
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
    fontWeight: '800',
    color: '#16A34A',
  },
  yieldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F7FCF9',
    borderWidth: 1,
    borderColor: '#E2EFE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  yieldText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F3D24',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7FCF9',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2EFE7',
  },
  priceLabel: {
    fontSize: 10,
    color: '#658071',
    fontWeight: '600',
  },
  priceVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F3D24',
    marginTop: 2,
  },
  compareToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compareToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#365345',
  },
  cardFooter: {
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
  offerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EDF9F1',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D1EBD8',
  },
  offerBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F3D24',
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
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F3D24',
  },
  emptySub: {
    fontSize: 12,
    color: '#365345',
    marginTop: 4,
    textAlign: 'center',
  },
  modalBackdrop: {
    position: (Platform.OS === 'web' ? 'fixed' : 'absolute') as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 61, 36, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 9999,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 26,
    width: '100%',
    maxWidth: 460,
    maxHeight: ('90vh' as any),
    overflowY: ('auto' as any),
    gap: 14,
    borderWidth: 1,
    borderColor: '#E2EFE7',
    boxShadow: '0 16px 36px rgba(15, 61, 36, 0.2)',
  },
  modalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F3D24',
  },
  modalSub: {
    fontSize: 12,
    color: '#365345',
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F3D24',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1EBD8',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    backgroundColor: '#F7FCF9',
    color: '#0F3D24',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2EFE7',
    backgroundColor: '#F7FCF9',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#365345',
  },
  modalSendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#16A34A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
  },
  modalSendText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
