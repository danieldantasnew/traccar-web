const ColorsDevice = (value) => {
  const reportColor = value
    ? value.split(";")
    : "rgb(68, 74, 93);white;rgb(98, 104, 123)".split(";");
  const bgColor = reportColor[0];
  const color = reportColor[1];
  const subColor = reportColor[2];
  return { bgColor, subColor, color };
};

export default ColorsDevice;
