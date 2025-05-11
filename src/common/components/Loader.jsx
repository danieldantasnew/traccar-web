import { useEffect } from 'react';
import Loading from "./IconsAnimated/Loading"

const Loader = () => {
  // useEffect(() => {
  //   const loader = document.querySelector('.loader');
  //   loader.style.display = '';
  //   return () => loader.style.display = 'none';
  // }, []);
  return <Loading/>;
};

export default Loader;
