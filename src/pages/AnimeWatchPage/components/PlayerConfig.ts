export const SUBTITLE_STORAGE_KEY = 'artplayer_sub_style';

export interface SubtitleStyle {
  color: string;
  fontSize: string;
  background: string;
  visible: boolean;
}

export const DEFAULT_STYLE: SubtitleStyle = {
  color: '#ffffff',
  fontSize: '24px',
  background: 'rgba(0,0,0,0)',
  visible: true,
};

export const SUB_COLORS = [
  { html: 'White', value: '#ffffff' },
  { html: 'Yellow', value: '#ffff00' },
  { html: 'Green', value: '#00ff00' },
  { html: 'Cyan', value: '#00ffff' },
];

export const SUB_SIZES = [
  { html: 'Small', value: '18px' },
  { html: 'Normal', value: '24px' },
  { html: 'Large', value: '30px' },
  { html: 'Extra Large', value: '36px' },
];

export const SUB_BACKGROUNDS = [
  { html: 'Transparent', value: 'rgba(0,0,0,0)' },
  { html: 'Semi-Black', value: 'rgba(0,0,0,0.5)' },
  { html: 'Black', value: 'rgba(0,0,0,1)' },
];

export const getSavedSubtitleStyle = (): SubtitleStyle => {
  try {
    const saved = localStorage.getItem(SUBTITLE_STORAGE_KEY);
    return saved ? { ...DEFAULT_STYLE, ...JSON.parse(saved) } : DEFAULT_STYLE;
  } catch (e) {
    return DEFAULT_STYLE;
  }
};

export const saveSubtitleSetting = (key: keyof SubtitleStyle, value: string | boolean) => {
  const current = getSavedSubtitleStyle();
  const newStyle = { ...current, [key]: value };
  localStorage.setItem(SUBTITLE_STORAGE_KEY, JSON.stringify(newStyle));
};