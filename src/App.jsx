import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery, useTheme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import BottomMenu from "./common/components/BottomMenu";
import SocketController from "./SocketController";
import CachingController from "./CachingController";
import { useCatch } from "./reactHelper";
import { sessionActions } from "./store";
import UpdateController from "./UpdateController";
import TermsDialog from "./common/components/TermsDialog";
import Loader from "./common/components/Loader";
import { DevicesProvider } from "./Context/App";
import SnackbarAlert from "./common/components/SnackbarAlert";

const useStyles = makeStyles(() => ({
  page: {
    flexGrow: 1,
    overflow: "auto",
  },
  menu: {
    zIndex: 4,
  },
}));

const App = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const termsUrl = useSelector(
    (state) => state.session.server.attributes.termsUrl
  );
  const user = useSelector((state) => state.session.user);

  const acceptTerms = useCatch(async () => {
    const response = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...user,
        attributes: { ...user.attributes, termsAccepted: true },
      }),
    });
    if (response.ok) {
      dispatch(sessionActions.updateUser(await response.json()));
    } else {
      throw Error(await response.text());
    }
  });

  if (user == null) {
    return <Loader />;
  }
  if (termsUrl && !user.attributes.termsAccepted) {
    return (
      <TermsDialog
        open
        onCancel={() => navigate("/login")}
        onAccept={() => acceptTerms()}
      />
    );
  }
  return (
    <>
      <SocketController />
      <CachingController />
      <UpdateController />
      <DevicesProvider>
        <div className={classes.page}>
          <Outlet />
        </div>
        {!desktop && (
          <div className={classes.menu}>
            <BottomMenu />
          </div>
        )}
        <SnackbarAlert/>
      </DevicesProvider>
    </>
  );
};

export default App;
