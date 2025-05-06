import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  "@keyframes crown": {
    "0%": {
      transform: "translateX(0)",
    },
    "12%": {
      transform: "translateX(-24px) rotate(1deg)",
    },
    "25%": {
      transform: "translateX(24px) rotate(-1deg)",
    },
    "33%": {
      transform: "translateX(0)",
    },
    "100%": {
      transform: "translateX(0)",
    },
  },
  "@keyframes pendulum": {
    "0%": {
      transform: "translateX(0)",
    },
    "12%": {
      transform: "translateX(30px)",
    },
    "25%": {
      transform: "translateX(-30px)",
    },
    "33%": {
      transform: "translateX(0)",
    },
    "100%": {
      transform: "translateX(0)",
    },
  },
  main: {
    height: "32px",
    width: "32px",
    fill: "white",
  },
  crown: {
    animation: `$crown 1s infinite cubic-bezier(0.25, 0.46, 0.45, 1)`,
  },
  pendulum: {
    animation: `$pendulum 1s infinite cubic-bezier(0.25, 0.46, 0.45, 1)`,
  },
}));

const BellOn = ({ color }) => {
  const styles = useStyles();

  return (
    <svg
      width="333"
      height="267"
      viewBox="0 0 333 267"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.main}
    >
      <g className={styles.crown}>
        <path
          d="M158.602 1.81715C153.002 4.21715 150.202 9.95049 150.202 19.0172V26.3505L142.602 28.4838C124.869 33.5505 105.135 48.7505 95.6688 64.3505C87.0021 78.7505 84.7355 87.5505 83.5355 111.15C82.8688 122.884 81.8021 135.15 81.0021 138.484C77.0021 155.95 69.1355 171.417 57.0021 185.817C51.4021 192.35 50.2021 194.617 50.2021 198.884C50.2021 201.684 51.1355 205.684 52.2021 207.817C56.4688 216.084 51.9355 215.817 166.202 215.817C280.469 215.817 275.935 216.084 280.202 207.817C284.335 199.817 283.002 195.017 273.002 181.95C255.802 159.55 251.135 145.684 249.002 111.15C248.202 97.6838 246.869 88.3505 245.002 82.4838C237.135 57.5505 216.069 36.6172 191.269 29.0172L182.202 26.2171V19.0172C182.202 9.81715 179.269 4.21715 173.535 1.68382C167.935 -0.582855 164.069 -0.582855 158.602 1.81715Z"
          fill={color}
        />
      </g>
      <g className={styles.pendulum}>
        <path
          d="M132.869 234.617C132.869 240.084 136.602 248.617 141.135 253.817C155.002 269.55 173.802 270.484 189.135 256.084C195.135 250.484 199.535 241.417 199.535 234.884C199.535 233.55 192.869 233.15 166.202 233.15C143.669 233.15 132.869 233.55 132.869 234.617Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export default BellOn;
