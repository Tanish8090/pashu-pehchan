import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  Stethoscope,
  Phone,
  Navigation,
  MapPin,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { colors } from '../../theme/colors';
import { ScreenName, VetService } from '../../types';
import * as api from '../../services/api';
import { getCurrentPosition } from '../../components/adapters/location';
import { openMapDirections } from '../../components/adapters/maps';
import { initiatePhoneCall } from '../../components/adapters/contact';

interface FindVetScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const FindVetScreen: React.FC<FindVetScreenProps> = ({ onNavigate }) => {
  const [vets, setVets] = useState<VetService[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);

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
    initLocationAndVets();
  }, []);

  const initLocationAndVets = async () => {
    setLoading(true);
    try {
      const coords = await getCurrentPosition();
      setUserCoords(coords);
      const data = await api.getVets({
        lat: coords.latitude,
        lng: coords.longitude,
      });
      setVets(data);
    } catch (err) {
      console.warn('Error fetching vets:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Polyclinic', 'Mobile Clinic', 'First Aid Center'];

  const filteredVets = vets.filter((vet) => {
    const cat = (vet.category || (vet as any).facility_type || '').toLowerCase();
    if (categoryFilter !== 'All') {
      if (!cat.includes(categoryFilter.toLowerCase())) return false;
    }
    if (searchDistrict.trim()) {
      const q = searchDistrict.toLowerCase();
      const matchName = vet.name.toLowerCase().includes(q);
      const matchDist = (vet.district || '').toLowerCase().includes(q);
      return matchName || matchDist;
    }
    return true;
  });

  const cardDesktopWidth =
    windowWidth >= 1350
      ? ('calc(33.333% - 11px)' as any)
      : ('calc(50% - 8px)' as any);

  return (
    <View style={[styles.container, isDesktop && styles.desktopContainer]}>
      {/* 24x7 Emergency Alert Header */}
      <View style={styles.emergencyBanner}>
        <View style={styles.emergencyLeft}>
          <AlertTriangle size={22} color="#ffffff" />
          <View>
            <Text style={styles.emergencyTitle}>24x7 Pashu Chikitsa Helpline</Text>
            <Text style={styles.emergencySub}>Govt of India Emergency Livestock Care</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.emergencyCallBtn}
          onPress={() => initiatePhoneCall('1962')}
        >
          <Phone size={14} color="#7f1d1d" />
          <Text style={styles.emergencyCallText}>Dial 1962</Text>
        </TouchableOpacity>
      </View>

      {/* Search & Categories */}
      <View style={styles.filterSection}>
        <View style={styles.searchBar}>
          <Search size={16} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clinic name or district..."
            placeholderTextColor={colors.textMuted}
            value={searchDistrict}
            onChangeText={setSearchDistrict}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catBtn, categoryFilter === cat && styles.catBtnActive]}
              onPress={() => setCategoryFilter(cat)}
            >
              <Text
                style={[
                  styles.catBtnText,
                  categoryFilter === cat && styles.catBtnTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Locating nearby veterinary facilities...</Text>
        </View>
      ) : (
        <ScrollView
          style={isDesktop ? styles.desktopScrollView : undefined}
          contentContainerStyle={[styles.list, isDesktop && styles.desktopList]}
        >
          {filteredVets.map((vet) => {
            const isEmergency = vet.is_emergency_24x7 === 1 || (vet as any).is_emergency === 1;
            const categoryDisplay = vet.category || (vet as any).facility_type || 'Veterinary Hospital';
            const phone = vet.emergency_phone || vet.phone || '+91 2692 260120';

            return (
              <View
                key={vet.id}
                style={[
                  styles.card,
                  isDesktop && styles.desktopCard,
                  isDesktop && { width: cardDesktopWidth, maxWidth: cardDesktopWidth },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.clinicIconBox}>
                    <Stethoscope size={22} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clinicName}>{vet.name}</Text>
                    <Text style={styles.clinicCategory}>{categoryDisplay}</Text>
                  </View>
                  {isEmergency && (
                    <View style={styles.badge247}>
                      <Clock size={10} color="#ffffff" />
                      <Text style={styles.badge247Text}>24x7</Text>
                    </View>
                  )}
                </View>

                <View style={styles.addressRow}>
                  <MapPin size={14} color={colors.textSecondary} style={{ marginTop: 2 }} />
                  <Text style={styles.addressText}>
                    {vet.address}, {vet.district}, {vet.state}
                  </Text>
                </View>

                {vet.distance_km !== undefined && (
                  <View style={styles.distanceRow}>
                    <Text style={styles.distanceText}>
                      📍 Approximately <Text style={{ fontWeight: '700' }}>{vet.distance_km} km</Text> from your location
                    </Text>
                  </View>
                )}

                {/* Action Buttons: Call & Directions */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.callBtn}
                    onPress={() => initiatePhoneCall(phone)}
                  >
                    <Phone size={14} color="#ffffff" />
                    <Text style={styles.callBtnText}>Call Clinic</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dirBtn}
                    onPress={() => openMapDirections(vet.latitude, vet.longitude, vet.name)}
                  >
                    <Navigation size={14} color={colors.primary} />
                    <Text style={styles.dirBtnText}>Directions</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
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
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7f1d1d',
    padding: 14,
  },
  emergencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emergencyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  emergencySub: {
    fontSize: 10,
    color: '#fca5a5',
  },
  emergencyCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  emergencyCallText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7f1d1d',
  },
  filterSection: {
    padding: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f3',
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    paddingVertical: 8,
  },
  catScroll: {
    gap: 8,
  },
  catBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f1f5f3',
  },
  catBtnActive: {
    backgroundColor: colors.primary,
  },
  catBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  catBtnTextActive: {
    color: '#ffffff',
  },
  desktopContainer: {
    backgroundColor: 'transparent',
  },
  desktopScrollView: {
    overflow: 'visible' as any,
    flex: 'none' as any,
    height: 'auto' as any,
  },
  list: {
    padding: 14,
    gap: 12,
  },
  desktopList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  desktopCard: {
    minWidth: 280,
    flexGrow: 1,
    flexShrink: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clinicIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clinicName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  clinicCategory: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge247: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#dc2626',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badge247Text: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
  },
  addressRow: {
    flexDirection: 'row',
    gap: 6,
  },
  addressText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    flex: 1,
  },
  distanceRow: {
    backgroundColor: '#f8faf9',
    padding: 6,
    borderRadius: 6,
  },
  distanceText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 9,
    borderRadius: 8,
  },
  callBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  dirBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    paddingVertical: 9,
    borderRadius: 8,
  },
  dirBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  loadingBox: {
    padding: 40,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
