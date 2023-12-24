import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useInterval } from "usehooks-ts";
import Button from "@atom/Button";
import { cn } from "@/utils";

interface ResendEmailProp {
  onResendEmail: (
    setRestartCountDown: React.Dispatch<SetStateAction<boolean>>,
  ) => void;
  children?: React.ReactNode;
  buttonClass?: string;
  onCountDownEnd?: () => void;
  startCountDown?: boolean;
  initialCount?: number;
  spanClass?: string;
  spanTextClass?: string;
  disabledBtn?: boolean;
}

const ResendEmail = React.forwardRef((props: ResendEmailProp, ref) => {
  const [disabled, setDisabled] = useState(true);
  const [countDown, setCountDown] = useState(props.initialCount || 30);
  const [count, setCount] = useState(1);
  const [restartCountDown, setRestartCountDown] = useState(false);
  const [delay, _] = useState<number>(1000);
  const [isPlaying, setPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!restartCountDown) return;
    setDisabled(true);
    setCount(count + 1);
    setCountDown(count * (props.initialCount || 30));
    setPlaying(true);
    setRestartCountDown(false);
  }, [restartCountDown, count, props.initialCount]);

  useInterval(
    () => {
      const updatedCount = countDown - 1;
      setCountDown(updatedCount);
      if (updatedCount === 0) {
        setDisabled(false);
        props.onCountDownEnd?.();
        setPlaying(false);
        return;
      }
    },
    // Delay in milliseconds or null to stop it
    isPlaying ? delay : null,
  );

  const startCountDown = useCallback(() => {
    const newCount = count + 1;
    setDisabled(true);
    setCount(newCount);
    setCountDown(newCount * (props.initialCount || 30));
    setPlaying(true);
  }, [count, props.initialCount]);

  useImperativeHandle(
    ref,
    () => ({
      startCountDown,
    }),
    [startCountDown],
  );

  return (
    <>
      <Button
        format={"link"}
        type={"button"}
        disabled={props.disabledBtn || disabled}
        onClick={() => {
          props.onResendEmail(setRestartCountDown);
        }}
        className={props.buttonClass}
      >
        {props.children || "Resend Email"}
      </Button>{" "}
      {disabled ? (
        <span className={cn("whitespace-nowrap", props.spanClass)}>
          ({" "}
          <span className={cn("text-grey6", props.spanTextClass)}>
            retry in {countDown}s{" "}
          </span>{" "}
          )
        </span>
      ) : null}
    </>
  );
});

ResendEmail.displayName = "ResendEmail";

export default ResendEmail;
