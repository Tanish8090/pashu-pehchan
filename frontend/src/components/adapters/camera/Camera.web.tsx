import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { Camera as CameraIcon, Upload, RotateCcw, Check, Sparkles } from 'lucide-react';
import { colors } from '../../../theme/colors';

export interface CameraCaptureProps {
  onCapture: (file: File | Blob, previewUrl: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onCancel,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUri(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUri(url);
    }
  };

  const handleConfirm = () => {
    if (selectedFile && previewUri) {
      onCapture(selectedFile, previewUri);
    }
  };

  const handleReset = () => {
    setPreviewUri(null);
    setSelectedFile(null);
  };

  return (
    <View style={styles.container}>
      {/* Hidden Web Input for Camera/File */}
      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef as any}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      )}

      {previewUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: previewUri }} style={styles.previewImage} resizeMode="cover" />
          <View style={styles.previewActionRow}>
            <TouchableOpacity style={styles.retakeBtn} onPress={handleReset} activeOpacity={0.8}>
              <RotateCcw size={16} color={colors.textSecondary} />
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, disabled && styles.btnDisabled]}
              onPress={handleConfirm}
              disabled={disabled}
              activeOpacity={0.8}
            >
              <Check size={18} color="#ffffff" />
              <Text style={styles.confirmText}>Analyze Breed</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          style={{ width: '100%' }}
        >
          <View style={[styles.dropZone, dragActive && styles.dropZoneActive]}>
            <View style={styles.iconCircle}>
              <CameraIcon size={28} color={colors.primary} />
            </View>
            <Text style={styles.dropZoneTitle}>Capture or Upload Livestock Photo</Text>
            <Text style={styles.dropZoneSub}>
              Drag & drop cattle/buffalo photo, or use camera on mobile web
            </Text>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.primaryUploadBtn}
                onPress={() => fileInputRef.current?.click()}
                activeOpacity={0.8}
              >
                <Upload size={16} color="#ffffff" />
                <Text style={styles.primaryUploadText}>Select Cattle Photo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.guidanceBox}>
              <Sparkles size={14} color={colors.primary} />
              <Text style={styles.guidanceText}>
                Side profile with visible hump, ear posture, and horn shape gives highest classification certainty.
              </Text>
            </View>
          </View>
        </div>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  dropZone: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropZoneActive: {
    backgroundColor: '#f0fdf4',
    borderColor: colors.success,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dropZoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  dropZoneSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 280,
    lineHeight: 16,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  primaryUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 2,
  },
  primaryUploadText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  guidanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    maxWidth: 320,
  },
  guidanceText: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 14,
    flex: 1,
  },
  previewContainer: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewImage: {
    width: '100%',
    height: 240,
  },
  previewActionRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#f8fafc',
  },
  retakeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  confirmBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
