/**
 * Haptic feedback utility for ALTA
 * Provides tactile vibration feedback on touch/focus/selection using the Vibration API.
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'error' | 'warning';

export function triggerHaptic(type: HapticType = 'light'): void {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      switch (type) {
        case 'light':
          navigator.vibrate(35);
          break;
        case 'medium':
          navigator.vibrate(55);
          break;
        case 'heavy':
          navigator.vibrate(80);
          break;
        case 'selection':
          navigator.vibrate([40, 30, 40]);
          break;
        case 'success':
          navigator.vibrate([60, 40, 70]);
          break;
        case 'warning':
          navigator.vibrate([40, 60, 40]);
          break;
        case 'error':
          navigator.vibrate([100, 50, 100]);
          break;
        default:
          navigator.vibrate(40);
          break;
      }
    } catch (e) {
      // Ignore vibration errors gracefully if blocked by device policy
    }
  }
}
