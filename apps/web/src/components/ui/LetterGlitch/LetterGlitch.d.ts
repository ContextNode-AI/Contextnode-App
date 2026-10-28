import { CSSProperties, FC } from 'react';

export interface LetterGlitchProps {
  glitchColors?: string[];
  baseColor?: string;
  characters?: string;
  fontFamily?: string;
  fontSize?: number;
  spacing?: number;
  density?: number;
  baseOpacity?: number;
  glitchAmount?: number;
  speed?: number;
  flow?: number;
  smooth?: boolean;
  interactive?: boolean;
  cursorRadius?: number;
  clickEffect?: 'tear' | 'burst' | 'none';
  edgeFade?: number;
  centerFade?: number;
  intro?: boolean;
  lightMode?: boolean;
  backgroundColor?: string;
  dpr?: number;
  className?: string;
  style?: CSSProperties;
  [key: string]: any;
}

declare const LetterGlitch: FC<LetterGlitchProps>;
export default LetterGlitch;

