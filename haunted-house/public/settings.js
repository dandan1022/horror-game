// A single exposure value for all players. This is not a user preference.
export const FIXED_EXPOSURE = 1.23;
const defaults = Object.freeze({volume:.65,musicVolume:.7,quality:'medium',reduced:false,sensitivity:.0025});
export function loadSettings(read) {
  const settings = {...defaults};
  try {
    const saved = JSON.parse(read() || '{}');
    for (const key of Object.keys(defaults)) {
      if (saved != null && Object.hasOwn(saved,key) && typeof saved[key] === typeof defaults[key]) settings[key] = saved[key];
    }
  } catch {}
  return settings;
}
