import { Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SideImage from './SideImage';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    height: '100%',
    maxHeight: '100%',
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr 2fr',
    }
  },
  sidebar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#ffffff',
    width: '100%',
    padding: "1rem",
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingBottom: theme.spacing(8),
    boxShadow: 'none',
    background: '#ffffff',
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
