"use client";

import { useEffect, useState } from "react";

function AddedPopUp() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 3000);
  }, []);
  return (
    <div
      className={`drop-shadow-lg fixed bottom-4 px-10 py-6 bg-white left-4 rounded-lg ${
        !show ? "animate-fade-away" : "animate-fade-in"
      }`}
    >
      <span>Product Added</span>
    </div>
  );
}

export default AddedPopUp;
