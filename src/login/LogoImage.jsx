import React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import Logo from '/logo-main.svg';

const useStyles = makeStyles((theme) => ({
  image: {
    alignSelf: 'center',
    maxWidth: '240px',
    maxHeight: '120px',
    width: 'auto',
    height: 'auto',
    margin: theme.spacing(2),
  },
}));

const LogoImage = ({ color }) => {
  const theme = useTheme();
  const classes = useStyles();

  const expanded = !useMediaQuery(theme.breakpoints.down('lg'));

  const logo = '/logo-main.svg'
  const logoInverted = useSelector((state) => state.session.server.attributes?.logoInverted);

  if (logo) {
    if (expanded && logoInverted) {
      return <img className={classes.image} src={logoInverted} alt="" />;
    }
    return <img className={classes.image} src={logo} alt="" />;
  }
  return <Logo className={classes.image} style={{ color }} />;
};

export default LogoImage;
