import Button, { ButtonType } from "../atom/Button";
import { cn } from "@/utils";
import React from "react";

export interface PromptProps {
  type?: "default" | "error" | "success";
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  classNameName?: string;
  errorMessage?: string;
  buttonAreaJSXClassName?: string;

  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLoading?: boolean;
  confirmDisabled?: boolean;
  confirmType?: ButtonType;

  headerJSX?: React.ReactNode;
  descriptionJSX?: React.ReactNode;
  buttonAreaJSX?: React.ReactNode;
  buttonsJSX?: React.ReactNode;

  hideHeader?: boolean;
  hideDescription?: boolean;
  hideButtonArea?: boolean;
}

const Prompt = React.forwardRef((props: PromptProps, ref) => {
  return (
    <div ref={ref as any} className={cn(``, props.classNameName)}>
      {props.hideHeader ? null : (
        <>
          {props.headerJSX || (
            <h5
              className={cn(`font-bold`, {
                "text-success": props.type === "success",
                "text-danger": props.type === "error",
              })}
            >
              {props.title}
            </h5>
          )}
        </>
      )}

      {!props.hideDescription ? (
        <>
          {props.descriptionJSX || (
            <p
              className={cn(`
              text-sm
              whitespace-pre-wrap
            `)}
            >
              {props.description}
            </p>
          )}
          {props.errorMessage && (
            <p
              className={cn(`
            text-danger
            text-sm
            whitespace-pre-wrap
          `)}
            >
              {props.errorMessage}
            </p>
          )}
        </>
      ) : null}

      {!props.hideButtonArea ? (
        <>
          {props.buttonAreaJSX || (
            <div
              className={cn(
                `flex justify-end gap-x-4 mt-[2rem]`,
                props.buttonAreaJSXClassName,
              )}
            >
              {props.buttonsJSX || (
                <>
                  <Button
                    className={cn(`
                  sm:py-1
                  sm:px-2
                 `)}
                    format={"tertiary"}
                    onClick={props.onCancel}
                    disabled={props.confirmLoading}
                  >
                    {props.cancelText || "Cancel"}
                  </Button>

                  <Button
                    className={cn(`
                    sm:py-2
                    sm:px-3
                   `)}
                    format={props.confirmType || "primary"}
                    onClick={props.onConfirm}
                    disabled={props.confirmLoading || props.confirmDisabled}
                  >
                    {props.confirmText || "Confirm"}
                  </Button>
                </>
              )}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
});

Prompt.displayName = "Prompt";

export default Prompt;
