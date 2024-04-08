"use client";

import React from "react";
import Button, { ButtonType } from "./Button";
import { useRouter } from "next/navigation";

interface Props {
  buttonFormat: ButtonType;
  children: string | React.ReactNode;
  route: string;
  className?: string;
}
const NavigateButton = (props: Props) => {
  const { push } = useRouter();

  return (
    <Button
      className={props.className}
      format={props.buttonFormat}
      onClick={() => push(props.route)}
    >
      {props.children}
    </Button>
  );
};

export default NavigateButton;
