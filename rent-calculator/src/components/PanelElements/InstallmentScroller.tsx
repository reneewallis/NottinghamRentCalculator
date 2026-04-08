import React from "react";
import ArrowButton from "../Buttons/ArrowButton";
import { InstallementScrollerProps } from "../../types/PanelElements";

function InstallementScroller({
  totalInstallments,
  installmentNumber,
  frequency,
  onChange,
}: InstallementScrollerProps) {
  const weekDown = () => {
    if (installmentNumber > 0) {
      if (onChange) {
        onChange(installmentNumber - 1);
      }
    }
  };

  const weekUp = () => {
    if (installmentNumber < totalInstallments) {
      if (onChange) {
        onChange(installmentNumber + 1);
      }
    }
  };
  return (
    <div className="flex items-center justify-between gap-4 pt-4">
      <ArrowButton direction="left" onClick={weekDown}></ArrowButton>
      <h1 className="text-2xl text-gray-200">
        {frequency} {installmentNumber}
      </h1>
      <ArrowButton direction="right" onClick={weekUp}></ArrowButton>
    </div>
  );
}

export default InstallementScroller;
