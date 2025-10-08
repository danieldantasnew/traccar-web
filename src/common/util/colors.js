import { rgbToHex } from "@mui/material";

// Turbo Colormap
export const turboPolynomials = {
  r: [
    0.13572138, 4.6153926, -42.66032258, 132.13108234, -152.94239396,
    59.28637943,
  ],
  g: [0.09140261, 2.19418839, 4.84296658, -14.18503333, 4.27729857, 2.82956604],
  b: [
    0.1066733, 12.64194608, -60.58204836, 110.36276771, -89.90310912,
    27.34824973,
  ],
};

const interpolateChannel = (normalizedValue, coeffs) => {
  let result = 0;
  for (let i = 0; i < coeffs.length; i += 1) {
    result += coeffs[i] * normalizedValue ** i;
  }
  return Math.max(0, Math.min(1, result));
};

export const interpolateTurbo = (value) => {
  const normalizedValue = Math.max(0, Math.min(1, value));
  return [
    Math.round(255 * interpolateChannel(normalizedValue, turboPolynomials.r)),
    Math.round(255 * interpolateChannel(normalizedValue, turboPolynomials.g)),
    Math.round(255 * interpolateChannel(normalizedValue, turboPolynomials.b)),
  ];
};

const getSpeedColor = (speed, minSpeed, maxSpeed, uniqueSpeed) => {
  const normalizedSpeed = uniqueSpeed ? uniqueSpeed / 60 : (speed - minSpeed) / (maxSpeed - minSpeed);

  const [r, g, b] = interpolateTurbo(normalizedSpeed);

  return `rgb(${r}, ${g}, ${b})`;
};

export const getRandomColor = () => {
  const baseRed = Math.floor(Math.random() * 256);
  const baseGreen = Math.floor(Math.random() * 256);
  const baseBlue = Math.floor(Math.random() * 256);

  const baseColor = `rgb(${baseRed}, ${baseGreen}, ${baseBlue})`;

  const luminance = 0.2126 * baseRed + 0.7152 * baseGreen + 0.0722 * baseBlue;
  const textColor = luminance > 128 ? "rgb(0,0,0)" : "rgb(255,255,255)";

  const variation = Math.random() > 0.5 ? 30 : -30;

  const variantRed = Math.max(0, Math.min(255, baseRed + variation));
  const variantGreen = Math.max(0, Math.min(255, baseGreen + variation));
  const variantBlue = Math.max(0, Math.min(255, baseBlue + variation));

  const variantColor = `rgb(${variantRed}, ${variantGreen}, ${variantBlue})`;

  const hexBaseColor = rgbToHex(baseColor);
  const hexTextColor = rgbToHex(textColor);
  const hexVariantColor = rgbToHex(variantColor);

  return {
    background: hexBaseColor,
    text: hexTextColor,
    secondary: hexVariantColor,
    icon: hexTextColor,
  };
};

export const setSvgToPngForMap = async (svgUrl) => {
  const response = await fetch(svgUrl);
  const svgText = await response.text();

  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
  const svgElement = svgDoc.documentElement;

  svgElement.querySelectorAll('[fill]').forEach(el => el.setAttribute('fill', 'white'));
  svgElement.querySelectorAll('[stroke]').forEach(el => el.setAttribute('stroke', 'white'));

  const serializer = new XMLSerializer();
  const updatedSvg = serializer.serializeToString(svgElement);

  const img = new Image();
  const svgBlob = new Blob([updatedSvg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width || 16;
      canvas.height = img.height || 16;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        resolve(blob);
      }, "image/png");
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
};



export default getSpeedColor;
