import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  "@global": {
    "@keyframes moveDashes": {
      from: { backgroundPositionX: 0 },
      to: { backgroundPositionX: "60px" },
    },
    "@keyframes device": {
      "0%": { left: "200px" },
      "25%": { left: "260px" },
      "50%": { left: "210px" },
      "75%": { left: "180px" },
      "100%": { left: "200px" },
    },
    [theme.breakpoints.down("md")]: {
      "@keyframes device": {
        "0%": { left: "100px" },
        "25%": { left: "120px" },
        "50%": { left: "110px" },
        "75%": { left: "90px" },
        "100%": { left: "100px" },
      },
    },
  },

  loading: {
    position: "relative",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0, 0.5)",
    zIndex: -1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "& p": {
      fontSize: "2.2rem",
      fontWeight: 600,
      color: "white",
    },
    [theme.breakpoints.down("md")]: {
      "& p": {
        fontSize: "1.6rem",
        lineHeight: ".2rem",
      },
    },
  },

  box: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  circle: {
    zIndex: 2,
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "gold",
    boxShadow: "0px 0px 0px 6px white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    "&::before": {
      content: '""',
      display: "block",
      width: "20px",
      height: "20px",
      top: "40px",
      borderRadius: "50%",
      backgroundColor: "rgb(233, 198, 0)",
      position: "absolute",
      zIndex: 1,
    },
    "&::after": {
      content: '""',
      display: "block",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "rgb(255, 255, 255)",
      position: "absolute",
    },
    "& svg": {
      width: "100px",
      height: "100px",
      position: "absolute",
      top: "-50px",
      left: "50%",
      transform: "translateX(-50%)",
      fill: "red",
      zIndex: 1,
    },
    [theme.breakpoints.down("md")]: {
      width: "60px",
      height: "60px",
      "&::before": {
        width: "11px",
        height: "11px",
        top: "24px",
      },
      "&::after": {
        width: "25px",
        height: "25px",
      },
      "& svg": {
        width: "60px",
        height: "60px",
        top: "-32px",
      },
    },
  },

  circleInside: {
    content: "''",
    display: "block",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "transparent",
    position: "absolute",
    boxShadow: "0px 0px 0px 10px white",
    [theme.breakpoints.down("md")]: {
      width: "35px",
      height: "35px",
      boxShadow: "0px 0px 0px 6px white",
    },
  },

  road: {
    width: "420px",
    height: "70px",
    borderRadius: "4px",
    backgroundColor: "#000",
    position: "relative",
    zIndex: 0,
    left: "-15px",
    overflow: "hidden",
    boxShadow: "0px 0px 0px 4px white",
    backgroundImage:
      "repeating-linear-gradient(to right, transparent 0px, transparent 20px, gold 20px, gold 55px)",
    backgroundRepeat: "repeat-x",
    backgroundSize: "60px 10px",
    backgroundPosition: "0 center",
    animation: "$moveDashes 0.2s linear infinite",
    "& svg": {
      width: "40px",
      height: "40px",
      transform: "translateY(-50%) rotate(-90deg)",
      position: "absolute",
      left: "370px",
      top: "50%",
      zIndex: 5,
      animation: "$device 3s infinite ease-in-out",
    },
    [theme.breakpoints.down("md")]: {
      width: "260px",
      height: "50px",
      "& svg": {
        width: "32px",
        height: "32px",
        left: "370px",
      },
    },
  },
}));

const Loading = () => {
  const styles = useStyles();

  return (
    <div className={styles.loading}>
      <div className={styles.box}>
        <div className={styles.circle}>
          <svg
            width="20"
            height="26"
            viewBox="0 0 20 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_1757_2647)">
              <circle cx="10" cy="9" r="4" fill="#ffffff" />
              <path
                d="M11.2344 25.35C13.9062 22.0898 20 14.1883 20 9.75C20 4.36719 15.5208 0 10 0C4.47917 0 0 4.36719 0 9.75C0 14.1883 6.09375 22.0898 8.76562 25.35C9.40625 26.127 10.5937 26.127 11.2344 25.35ZM10 6.5C10.8841 6.5 11.7319 6.84241 12.357 7.4519C12.9821 8.0614 13.3333 8.88805 13.3333 9.75C13.3333 10.612 12.9821 11.4386 12.357 12.0481C11.7319 12.6576 10.8841 13 10 13C9.11594 13 8.2681 12.6576 7.64298 12.0481C7.01786 11.4386 6.66667 10.612 6.66667 9.75C6.66667 8.88805 7.01786 8.0614 7.64298 7.4519C8.2681 6.84241 9.11594 6.5 10 6.5Z"
                fill="#FF0000"
              />
            </g>
            <defs>
              <clipPath id="clip0_1757_2647">
                <rect width="20" height="26" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <div className={styles.circleInside}></div>
        </div>
        <div className={styles.road}>
          <svg
            width="112"
            height="131"
            viewBox="0 0 112 131"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M51.4473 1.12708C49.6761 2.05929 47.8117 4.11016 46.693 6.44069C40.2607 20.2374 0.828125 118.399 0.828125 120.73C0.828125 126.603 8.84516 131.917 14.1588 129.4C15.2774 128.934 25.1589 121.569 36.159 112.993C48.8371 103.111 56.4813 97.7976 57.1338 98.2637C57.6931 98.7298 66.5492 105.535 76.8035 113.552C96.7529 129.027 98.4308 130.145 101.507 130.145C106.914 130.145 112.414 123.993 111.482 119.052C110.363 113.645 64.9644 4.66949 63.0067 2.61862C60.2101 -0.178022 55.2694 -0.830571 51.4473 1.12708Z"
              fill="red"
            />
          </svg>
        </div>
      </div>
      <p>Carregando...</p>
    </div>
  );
};

export default Loading;

// import { makeStyles } from "@mui/styles";

// const useStyles = makeStyles((theme) => ({
//   "@global": {
//     "@keyframes moveDashes": {
//       from: { backgroundPositionX: 0 },
//       to: { backgroundPositionX: "60px" },
//     },
//     "@keyframes device": {
//       "0%": { left: "200px" },
//       "25%": { left: "260px" },
//       "50%": { left: "210px" },
//       "75%": { left: "180px" },
//       "100%": { left: "200px" },
//     },
//     [theme.breakpoints.down("md")]: {
//       "@keyframes device": {
//         "0%": { left: "100px" },
//         "25%": { left: "120px" },
//         "50%": { left: "110px" },
//         "75%": { left: "90px" },
//         "100%": { left: "100px" },
//       },
//     },
//   },

//   loading: {
//     position: "relative",
//     height: "100%",
//     width: "100%",
//     backgroundColor: "rgba(0,0,0, 0.5)",
//     zIndex: -1,
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     "& p": {
//       fontSize: "2.2rem",
//       fontWeight: 600,
//       color: "white",
//     },
//     [theme.breakpoints.down("md")]: {
//       "& p": {
//         fontSize: "1.6rem",
//         lineHeight: ".2rem",
//       },
//     },
//   },

//   box: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     position: "relative",
//   },

//   circle: {
//     zIndex: 2,
//     width: "100px",
//     height: "100px",
//     borderRadius: "50%",
//     backgroundColor: "rgba(0, 167, 233, 0.54)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     position: "relative",
//     "&::before": {
//       content: '""',
//       display: "block",
//       width: "50px",
//       height: "50px",
//       top: "50%",
//       transform: "translateY(-50%)",
//       borderRadius: "50%",
//       backgroundColor: "#2C76AC",
//       position: "absolute",
//       zIndex: 1,
//     },
//     "& img": {
//       width: "100px",
//       height: "100px",
//       position: "absolute",
//       top: "-50px",
//       left: "50%",
//       transform: "translateX(-50%)",
//       fill: "red",
//       zIndex: 1,
//     },
//     [theme.breakpoints.down("md")]: {
//       width: "60px",
//       height: "60px",
//       "&::before": {
//         width: "11px",
//         height: "11px",
//         top: "24px",
//       },
//       "&::after": {
//         width: "25px",
//         height: "25px",
//       },
//       "& svg": {
//         width: "60px",
//         height: "60px",
//         top: "-32px",
//       },
//     },
//   },

//   circleInside: {
//     content: "''",
//     display: "block",
//     width: "60px",
//     height: "60px",
//     borderRadius: "50%",
//     backgroundColor: "transparent",
//     position: "absolute",
//     boxShadow: "0px 0px 0px 10px white",
//     [theme.breakpoints.down("md")]: {
//       width: "35px",
//       height: "35px",
//       boxShadow: "0px 0px 0px 6px white",
//     },
//   },

//   road: {
//     width: "420px",
//     height: "90px",
//     borderRadius: "4px",
//     backgroundColor: "#000",
//     position: "relative",
//     zIndex: 0,
//     left: "-15px",
//     overflow: "hidden",
//     boxShadow: "0px 0px 0px 4px white",
//     backgroundImage:
//       "repeating-linear-gradient(to right, transparent 0px, transparent 20px, gold 20px, gold 55px)",
//     backgroundRepeat: "repeat-x",
//     backgroundSize: "60px 10px",
//     backgroundPosition: "0 center",
//     animation: "$moveDashes 0.2s linear infinite",
//     "& svg": {
//       width: "26px",
//       height: "26px",
//     },
//     [theme.breakpoints.down("md")]: {
//       width: "260px",
//       height: "50px",
//       "& svg": {
//         width: "32px",
//         height: "32px",
//         left: "370px",
//       },
//     },
//   },
//   circleDevice: {
//     backgroundColor: "white",
//     height: "40px",
//     width: "40px",
//     borderRadius: "50%",
//     transform: " rotate(-90deg)",
//     position: "absolute",
//     left: "370px",
//     top: ".3rem",
//     zIndex: 5,
//     animation: "$device 3s infinite ease-in-out",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// }));

// const Loading = () => {
//   const styles = useStyles();

//   return (
//     <div className={styles.loading}>
//       <div className={styles.box}>
//         <div className={styles.circle}>
//           <img src="/src/resources/images/icon/locationSmile.svg"/>
//         </div>
//         <div className={styles.road}>
//           <div className={styles.circleDevice}>
//             <svg
//               width="112"
//               height="131"
//               viewBox="0 0 112 131"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M51.4473 1.12708C49.6761 2.05929 47.8117 4.11016 46.693 6.44069C40.2607 20.2374 0.828125 118.399 0.828125 120.73C0.828125 126.603 8.84516 131.917 14.1588 129.4C15.2774 128.934 25.1589 121.569 36.159 112.993C48.8371 103.111 56.4813 97.7976 57.1338 98.2637C57.6931 98.7298 66.5492 105.535 76.8035 113.552C96.7529 129.027 98.4308 130.145 101.507 130.145C106.914 130.145 112.414 123.993 111.482 119.052C110.363 113.645 64.9644 4.66949 63.0067 2.61862C60.2101 -0.178022 55.2694 -0.830571 51.4473 1.12708Z"
//                 fill="red"
//               />
//             </svg>
//           </div>
//         </div>
//       </div>
//       <p>Carregando...</p>
//     </div>
//   );
// };

// export default Loading;
