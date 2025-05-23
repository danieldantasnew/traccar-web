import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCatch } from '../../reactHelper';
import { Tooltip } from '@mui/material';

const AddressValue = ({ latitude, longitude, originalAddress, setStateAddress }) => {
  const addressEnabled = useSelector((state) => state.session.server.geocoderEnabled);

  const [address, setAddress] = useState(originalAddress);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setAddress(originalAddress);
    setErrorMessage("");
  }, [latitude, longitude, originalAddress]);

  useEffect(() => {
    if (!address && addressEnabled) {
      fetchAddress();
    }
  }, [address, addressEnabled]);

  const fetchAddress = useCatch(async () => {
    try {
      const query = new URLSearchParams({ latitude, longitude });
      const response = await fetch(`/api/server/geocode?${query.toString()}`);
      
      if (response.ok) {
        const data = await response.text();
        if (data) {
          setAddress(data);
          if(setStateAddress) setStateAddress(data);
        } else {
          setErrorMessage("Não foi possível encontrar o endereço");
        }
      } else {
        throw new Error("Erro ao buscar endereço");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  });

  return <Tooltip title={address || errorMessage || "Carregando endereço..."} placement='top' arrow>{address || errorMessage || "Carregando endereço..."}</Tooltip>;
};

export default AddressValue;
