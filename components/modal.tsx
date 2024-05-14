import React, { useEffect, useRef } from "react";

interface Props {
  isOpen: boolean;
  onClose: (value?: boolean) => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: Props) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [isOpen]);

  const handleClickBackdrop = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (modalRef.current !== event.target) {
      onClose(false);
    }
  };

  return (
    <>
      {isOpen ? (
        <div
          className="w-full h-screen fixed top-0 left-0 bg-backDrop z-20"
          onClick={handleClickBackdrop}
        >
          <div className="flex  justify-center items-center w-full h-full ">
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
}
