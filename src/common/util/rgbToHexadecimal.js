export default function rgbToHexadecimal(color) {
    const isRgb = color.startsWith('rgb');
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
  