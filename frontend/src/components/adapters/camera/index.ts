import { Platform } from 'react-native';
import { CameraCapture as WebCamera } from './Camera.web';
import { CameraCapture as NativeCamera } from './Camera.native';

export type { CameraCaptureProps } from './Camera.web';

export const CameraCapture = Platform.OS === 'web' ? WebCamera : NativeCamera;
export default CameraCapture;
