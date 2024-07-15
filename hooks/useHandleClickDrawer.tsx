import React, { useState } from "react";

export default function UseHandleClickDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  function handleClickDrawerChange() {
    setIsOpen(!isOpen);
  }
  return { isOpen, handleClickDrawerChange };
}
