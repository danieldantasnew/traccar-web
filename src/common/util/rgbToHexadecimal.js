const namedColors = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#FF0000',
  green: '#008000',
  blue: '#0000FF',
  yellow: '#FFFF00',
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  gray: '#808080',
  grey: '#808080',
};

export default function rgbToHexadecimal(color) {
  if (!color) return color;

  const colorLower = color.toLowerCase();

  if (namedColors[colorLower]) {
    return namedColors[colorLower];
  }

  const isRgb = colorLower.startsWith('rgb');
  if (!isRgb) return color;

  const rgbValues = color
    .replace(/rgba?\(|\s+|\)/g, '')
    .split(',')
    .map(Number);

  const [r, g, b, a] = rgbValues;

  if (rgbValues.length === 4) {
    const alpha = Math.round(a * 255);
    return (
      '#' +
      [r, g, b, alpha]
        .map((x) => x.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()
    );
  }

  return (
    '#' +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}
