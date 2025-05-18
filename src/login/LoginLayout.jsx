import { Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SideImage from './SideImage';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    height: '100%',
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr 2fr',
    }
  },
  sidebar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#2C76AC',
    width: '100%',
    overflow: "hidden",
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingBottom: theme.spacing(5),
    boxShadow: '-2px 0px 16px rgba(0, 0, 0, 0.25)',
    [theme.breakpoints.down('lg')]: {
      justifyContent: 'flex-start',
    },
  },
  form: {
    padding: theme.spacing(5),
    width: '100%',
    maxWidth: "500px !important",
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
        <form className={classes.form}>
          {children}
        </form>
      </Paper>
    </main>
  );
};

export default LoginLayout;
