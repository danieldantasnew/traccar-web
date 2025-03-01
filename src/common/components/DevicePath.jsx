import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const DevicePath = ({ setItems, handleSubmit }) => {
  const deviceIds = useSelector((state) => state.devices.selectedIds);
  const groupIds = useSelector((state) => state.reports.groupIds);
  const from = dayjs().startOf("day");
  const to = dayjs().endOf("day");

  function handleClick() {
    handleSubmit({
      deviceIds,
      groupIds,
      from: from.toISOString(),
      to: to.toISOString(),
    });
  }

  useEffect(()=> {
    handleClick();
    return ()=> {
        setItems([]);
    }
  }, []);
};

export default DevicePath;
