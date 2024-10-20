"use client";

import React from "react";
import { AddressSuggestions } from "react-dadata";
import "react-dadata/dist/react-dadata.css";

interface Props {
  onChange?: (value?: string) => void;
}

// useState - будем вшивать из рхф
// сюда нельзя зашить регистр из рхф, ну мб можно через useRef
export const AdressInput: React.FC<Props> = ({ onChange }) => {
  return (
    <AddressSuggestions
      token="b5b8bb983ddcd08648080e0271d9dd367bb7aa65" // API key 17:17
      onChange={(data) => onChange?.(data?.value)}
    />
  );
};
