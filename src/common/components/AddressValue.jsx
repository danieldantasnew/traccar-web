import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCatch } from '../../reactHelper';

const AddressValue = ({ latitude, longitude, originalAddress }) => {

  const addressEnabled = useSelector((state) => state.session.server.geocoderEnabled);

  const [address, setAddress] = useState();
  const [textWhileNoAddress, setTextWhileNoAddress] = useState(false)

  useEffect(() => {
    setAddress(originalAddress);
  }, [latitude, longitude, originalAddress]);

  const showAddress = useCatch(async () => {
    const query = new URLSearchParams({ latitude, longitude });
    const response = await fetch(`/api/server/geocode?${query.toString()}`);
    if (response.ok) {
      setAddress(await response.text());
      if(!address) {
        setTextWhileNoAddress('Não foi possível encontrar o endereço')
      }
      else {
        setTextWhileNoAddress(false);
      }
    } else {
      throw Error(await response.text());
    }
  });

  if (address) {
    return address;
  }
  if(textWhileNoAddress) return textWhileNoAddress;
  if (addressEnabled) {
    return showAddress();
  }
  return address;
};

export default AddressValue;
