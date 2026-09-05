import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import {
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Clock,
  Tag,
  X,
  FileText,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { colors } from '../theme/colors';
import { RecordResponse, VerificationStatus } from '../types';
import { getRecords } from '../services/api';

interface HistoryScreenProps {
  onScanNew: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onScanNew }) => {
  const [records, setRecords] = useState<RecordResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedRecord, setSelectedRecord] = useState<RecordResponse | null>(null);

  const fetchHistory = () => {
    setLoading(true);
    getRecords({
      search: searchTerm.trim() || undefined,
      status: statusFilter,
    })
      .then((data) => setRecords(data))
      .catch((err) => console.log('Failed fetching records:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, [statusFilter]);

  const handleSearchSubmit = () => {
    fetchHistory();
  };

  const getStatusBadge = (status: VerificationStatus) => {
    if (status === 'Human Verified') {
      return {
        bg: colors.successBg,
        text: colors.success,
        label: 'Human Verified',
      };
    }
    if (status === 'Overridden') {
      return {
        bg: colors.warningBg,
        text: colors.warning,
        label: 'Overridden',
      };
    }
    return {
      bg: colors.dangerBg,
      text: colors.danger,
      label: 'Manual Review',
    };
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
      <ScrollView
        style={isDesktop ? styles.desktopScrollView : undefined}
        contentContainerStyle={[styles.content, isDesktop && styles.desktopContent]}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.screenTitle}>Verification Audit Trail</Text>
          <Text style={styles.screenSubtitle}>
            Traceability log of all livestock verified under Bharat Pashudhan program.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={16} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Ear Tag #, or breed name..."
            placeholderTextColor={colors.textMuted}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchTerm(''); fetchHistory(); }}>
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {['All', 'Human Verified', 'Overridden', 'Manual Review'].map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setStatusFilter(tab)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Records List */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Fetching SQLite audit logs...</Text>
          </View>
        ) : records.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FileText size={40} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No matching audit records</Text>
            <Text style={styles.emptySub}>
              Perform a new livestock verification to populate records.
            </Text>
            <TouchableOpacity
              style={styles.emptyScanBtn}
              onPress={onScanNew}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyScanBtnText}>Start New Verification</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.recordsList, isDesktop && styles.desktopRecordsList]}>
            {records.map((rec) => {
              const badge = getStatusBadge(rec.verification_status);
              const isOverridden = rec.verification_status === 'Overridden';

              return (
                <TouchableOpacity
                  key={rec.id}
                  style={[
                    styles.recordCard,
                    isDesktop && { width: cardDesktopWidth, maxWidth: cardDesktopWidth },
                  ]}
                  onPress={() => setSelectedRecord(rec)}
                  activeOpacity={0.75}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.tagWrap}>
                      <Tag size={13} color={colors.primary} />
                      <Text style={styles.tagText}>{rec.animal_identifier || `PB-${rec.id}`}</Text>
                      {rec.is_demo === 1 && (
                        <View style={styles.demoBadge}>
                          <Text style={styles.demoBadgeText}>DEMO</Text>
                        </View>
                      )}
                    </View>

                    <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.breedCompareRow}>
                    <View style={styles.compareCol}>
                      <Text style={styles.compareLabel}>AI SUGGESTION</Text>
                      <Text style={styles.compareBreed}>
                        {rec.predicted_breed.replace(/_/g, ' ')}
                      </Text>
                      <Text style={styles.compareConf}>
                        {(rec.predicted_confidence * 100).toFixed(1)}% conf
                      </Text>
                    </View>

                    <View style={styles.arrowCol}>
                      <ChevronRight size={16} color={colors.textMuted} />
                    </View>

                    <View style={styles.compareCol}>
                      <Text style={styles.compareLabel}>VERIFIED BREED</Text>
                      <Text
                        style={[
                          styles.compareBreed,
                          isOverridden && { color: colors.warning },
                        ]}
                      >
                        {rec.verified_breed.replace(/_/g, ' ')}
                      </Text>
                      <Text style={styles.compareSpecies}>{rec.animal_type}</Text>
                    </View>
                  </View>

                  {rec.notes ? (
                    <Text style={styles.notesExcerpt} numberOfLines={1}>
                      Notes: {rec.notes}
                    </Text>
                  ) : null}

                  <View style={styles.cardFooter}>
                    <View style={styles.timeWrap}>
                      <Clock size={11} color={colors.textMuted} />
                      <Text style={styles.timeText}>
                        {new Date(rec.created_at).toLocaleString()}
                      </Text>
                    </View>
                    <Text style={styles.detailsPrompt}>View Details →</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <Modal
          visible={!!selectedRecord}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedRecord(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Verification Record #{selectedRecord.id}</Text>
                  <Text style={styles.modalSub}>
                    Tag: {selectedRecord.animal_identifier || `PB-${selectedRecord.id}`}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedRecord(null)}
                  style={styles.closeBtn}
                >
                  <X size={18} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll}>
                <View style={styles.detailGrid}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Verified Breed:</Text>
                    <Text style={[styles.detailVal, { color: colors.primaryDark, fontWeight: '800' }]}>
                      {selectedRecord.verified_breed}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>AI Initial Prediction:</Text>
                    <Text style={styles.detailVal}>
                      {selectedRecord.predicted_breed} ({(selectedRecord.predicted_confidence * 100).toFixed(1)}%)
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Status:</Text>
                    <Text style={styles.detailVal}>
                      {selectedRecord.verification_status}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Species:</Text>
                    <Text style={styles.detailVal}>{selectedRecord.animal_type}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Vision Model:</Text>
                    <Text style={styles.detailVal}>{selectedRecord.model_version}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Timestamp:</Text>
                    <Text style={styles.detailVal}>
                      {new Date(selectedRecord.created_at).toLocaleString()}
                    </Text>
                  </View>

                  {selectedRecord.notes ? (
                    <View style={styles.notesBlock}>
                      <Text style={styles.detailKey}>Field Worker Notes:</Text>
                      <Text style={styles.notesBlockText}>{selectedRecord.notes}</Text>
                    </View>
                  ) : null}
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.modalDismissBtn}
                onPress={() => setSelectedRecord(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalDismissText}>Close Audit View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  desktopScrollView: {
    overflow: 'visible' as any,
    flex: 'none' as any,
    height: 'auto' as any,
  },
  desktopContent: {
    padding: 0,
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
  filterTabs: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
    overflow: 'scroll',
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  centerContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 240,
  },
  emptyScanBtn: {
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyScanBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  recordsList: {
    gap: 10,
  },
  desktopRecordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  recordCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  demoBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  demoBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  breedCompareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  compareCol: {
    flex: 1,
  },
  arrowCol: {
    paddingHorizontal: 6,
  },
  compareLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  compareBreed: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 1,
  },
  compareConf: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  compareSpecies: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 1,
  },
  notesExcerpt: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  detailsPrompt: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    position: (Platform.OS === 'web' ? 'fixed' : 'absolute') as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: '100%',
    maxWidth: 520,
    maxHeight: ('90vh' as any),
    overflowY: ('auto' as any),
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  modalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    marginBottom: 14,
  },
  detailGrid: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  detailKey: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  notesBlock: {
    marginTop: 6,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },
  notesBlockText: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  modalDismissBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalDismissText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
