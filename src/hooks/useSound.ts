import { useState, useEffect, useCallback } from 'react';
import { playSound, toggleSound as toggleSoundLib, getSoundStatus } from '../lib/sound';

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    setSoundEnabled(getSoundStatus());
  }, []);

  const toggle = useCallback(() => {
    const newState = toggleSoundLib();
    setSoundEnabled(newState);
    if (newState) {
      playSound.click();
    }
  }, []);

  return {
    soundEnabled,
    toggleSound: toggle,
    play: playSound
  };
}
