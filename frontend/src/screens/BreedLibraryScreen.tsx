import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  Search,
  BookOpen,
  Filter,
  MapPin,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Camera,
} from 'lucide-react';
import { colors } from '../theme/colors';
import { BreedItem, AnimalType } from '../types';
import { getBreeds } from '../services/api';

interface BreedLibraryScreenProps {
  onSelectBreedForScan?: (breedName: string) => void;
}

export const BreedLibraryScreen: React.FC<BreedLibraryScreenProps> = ({
  onSelectBreedForScan,
}) => {
  const [breeds, setBreeds] = useState<BreedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<'All' | 'Cattle' | 'Buffalo'>('All');
  const [expandedBreed, setExpandedBreed] = useState<string | null>(null);

  useEffect(() => {
    getBreeds()
      .then((data) => setBreeds(data))
      .catch((err) => console.log('Error fetching breeds library:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredBreeds = breeds.filter((b) => {
    const matchesSpecies = speciesFilter === 'All' || b.animal_type === speciesFilter;
    const matchesSearch =
      b.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.region && b.region.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.purpose && b.purpose.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSpecies && matchesSearch;
  });

  const cattleCount = breeds.filter((b) => b.animal_type === 'Cattle').length;
  const buffaloCount = breeds.filter((b) => b.animal_type === 'Buffalo').length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.screenTitle}>ICAR-NBAGR Breed Library</Text>
          <Text style={styles.screenSubtitle}>
            Official catalog of 41 indigenous bovine breeds recognized for national livestock registration.
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Search size={16} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by breed or region (e.g. Gujarat, Punjab)..."
            placeholderTextColor={colors.textMuted}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Species Filter Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabPill, speciesFilter === 'All' && styles.tabPillActive]}
            onPress={() => setSpeciesFilter('All')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                speciesFilter === 'All' && styles.tabTextActive,
              ]}
            >
              All Breeds ({breeds.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabPill,
              speciesFilter === 'Cattle' && styles.tabPillActive,
            ]}
            onPress={() => setSpeciesFilter('Cattle')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                speciesFilter === 'Cattle' && styles.tabTextActive,
              ]}
            >
              Cattle ({cattleCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabPill,
              speciesFilter === 'Buffalo' && styles.tabPillActive,
            ]}
            onPress={() => setSpeciesFilter('Buffalo')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                speciesFilter === 'Buffalo' && styles.tabTextActive,
              ]}
            >
              Buffalo ({buffaloCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Breed List */}
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading ICAR breed database...</Text>
          </View>
        ) : filteredBreeds.length === 0 ? (
          <View style={styles.centerBox}>
            <Text style={styles.emptyText}>No breeds found matching your criteria</Text>
          </View>
        ) : (
          <View style={styles.breedList}>
            {filteredBreeds.map((b) => {
              const isExpanded = expandedBreed === b.breed;
              const isBuffalo = b.animal_type === 'Buffalo';

              return (
                <View key={b.breed} style={styles.breedCard}>
                  <TouchableOpacity
                    style={styles.cardHeader}
                    onPress={() =>
                      setExpandedBreed(isExpanded ? null : b.breed)
                    }
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardHeaderLeft}>
                      <View style={styles.breedNameRow}>
                        <Text style={styles.breedName}>{b.display_name}</Text>
                        <View
                          style={[
                            styles.speciesBadge,
                            isBuffalo ? styles.badgeBuffalo : styles.badgeCattle,
                          ]}
                        >
                          <Text
                            style={[
                              styles.speciesBadgeText,
                              isBuffalo ? styles.textBuffalo : styles.textCattle,
                            ]}
                          >
                            {b.animal_type}
                          </Text>
                        </View>
                      </View>

                      {b.region ? (
                        <View style={styles.regionRow}>
                          <MapPin size={12} color={colors.textMuted} />
                          <Text style={styles.regionText}>{b.region}</Text>
                        </View>
                      ) : null}
                    </View>

                    {isExpanded ? (
                      <ChevronUp size={18} color={colors.textMuted} />
                    ) : (
                      <ChevronDown size={18} color={colors.textMuted} />
                    )}
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.cardBody}>
                      <View style={styles.traitsGrid}>
                        <View style={styles.traitBox}>
                          <Text style={styles.traitLabel}>PURPOSE</Text>
                          <Text style={styles.traitValue}>{b.purpose || 'Dual Purpose'}</Text>
                        </View>
                        <View style={styles.traitBox}>
                          <Text style={styles.traitLabel}>COAT COLOR</Text>
                          <Text style={styles.traitValue}>{b.coat_color || 'Variable'}</Text>
                        </View>
                        <View style={[styles.traitBox, { width: '100%' }]}>
                          <Text style={styles.traitLabel}>HORN STRUCTURE</Text>
                          <Text style={styles.traitValue}>{b.horn_type || 'Distinctive'}</Text>
                        </View>
                      </View>

                      {b.characteristics ? (
                        <View style={styles.charBox}>
                          <Text style={styles.charTitle}>Identification Markers:</Text>
                          <Text style={styles.charText}>{b.characteristics}</Text>
                        </View>
                      ) : null}

                      {onSelectBreedForScan && (
                        <TouchableOpacity
                          style={styles.scanWithBreedBtn}
                          onPress={() => onSelectBreedForScan(b.breed)}
                          activeOpacity={0.8}
                        >
                          <Camera size={14} color="#ffffff" />
                          <Text style={styles.scanWithBreedText}>
                            Load Benchmark Sample for {b.display_name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  titleSection: {
    marginBottom: 14,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  screenSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  tabPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  centerBox: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  breedList: {
    gap: 8,
  },
  breedCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  breedNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  breedName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  speciesBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeCattle: {
    backgroundColor: colors.cattleBg,
    borderColor: '#bae6fd',
  },
  badgeBuffalo: {
    backgroundColor: colors.buffaloBg,
    borderColor: '#e9d5ff',
  },
  speciesBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  textCattle: {
    color: colors.cattleBadge,
  },
  textBuffalo: {
    color: colors.buffaloBadge,
  },
  regionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  regionText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  cardBody: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 8,
  },
  traitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  traitBox: {
    width: '48%',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  traitLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
  },
  traitValue: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 1,
  },
  charBox: {
    backgroundColor: '#fafdfa',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  charTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 2,
  },
  charText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
  },
  scanWithBreedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  scanWithBreedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
});
