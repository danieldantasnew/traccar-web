import Map from "/Map.svg";

const SideImage = () => {
  return (
    <img
      src={Map}
      alt=""
      style={{
        objectFit: "cover",
        objectPosition: "top",
        width: "100%",
        height: "100%",
        borderRadius: "12px",
      }}
    />
  );
};

export default SideImage;
