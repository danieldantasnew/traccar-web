import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "2rem",
  },
  spin: {
    height: "44px",
    width: "44px",
    borderRadius: "50%",
    animation: "$spin 1s linear infinite",
  },
}));

const SpinLoading = ({ backgroundColor }) => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <div
        className={styles.spin}
        style={{
          border: `4px solid ${backgroundColor}`,
          borderRightColor: "transparent",
        }}
      ></div>
    </div>
  );
};

export default SpinLoading;
