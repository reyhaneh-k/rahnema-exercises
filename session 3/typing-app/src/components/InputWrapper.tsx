import React, { ReactNode } from "react";

export default function InputWrapper({ children }: { children: ReactNode }) {
  return <section className="InputWrap">{children}</section>;
}
