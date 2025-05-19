import { Paper } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import SideImage from "./SideImage";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    height: "100%",
    maxHeight: "100%",
    [theme.breakpoints.down("lg")]: {
      gridTemplateColumns: "1fr",
    },
  },
  sidebar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#ffffff",
    width: "100%",
    maxHeight: "100%",
    overflow: "hidden",
    padding: ".5rem",
    [theme.breakpoints.down("lg")]: {
      "& svg": {
        width: "100px",
      },
    },
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingBottom: theme.spacing(8),
    boxShadow: "none !important",
    [theme.breakpoints.down("lg")]: {
      justifyContent: "flex-start",
      paddingBottom:0,
    },
  },
  form: {
    padding: theme.spacing(5),
    width: "100%",
    maxWidth: "500px !important",
    [theme.breakpoints.down("lg")]: {
      padding: theme.spacing(2),
    }
  },
}));

const LoginLayout = ({ children }) => {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <div className={classes.sidebar}>
        <SideImage />
      </div>
      <Paper className={classes.paper}>
        <form className={classes.form}>{children}</form>
      </Paper>
    </main>
  );
};

export default LoginLayout;
