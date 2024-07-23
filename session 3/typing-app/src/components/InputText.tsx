import React from "react";
export default function InputText({
  inputText,
  setInputText,
}: {
  inputText: string;
  setInputText: (arg: string) => void;
}) {
  return (
    <input
      value={inputText}
      type="text"
      className="inputForm"
      onChange={(event) => {
        setInputText(event.target.value);
      }}
    />
  );
}
