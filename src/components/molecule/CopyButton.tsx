import { useToast } from "@components/ui/use-toast";
import { useCopyToClipboard } from "usehooks-ts";
import Button from "@atom/Button";
import { cn } from "@/utils";
import { CopyIcon } from "@atom/icons/Copy";

interface Props {
  value: string;
  success?: () => void;
  error?: (error: any) => void;
}

export const CopyButton = (props: Props) => {
  const [value, copy] = useCopyToClipboard();
  const { toast } = useToast();
  const onClick = async () => {
    try {
      await copy(props.value);
      toast({
        title: "Success",
        description: "Copied to clipboard",
        variant: "success",
      });
      props.success?.();
    } catch (error) {
      props.error?.(error);
    }
  };

  return (
    <Button
      format={"tertiary"}
      className={cn(`
      bg-offwhite
      flex
      items-center
      justify-between
      text-black
      gap-x-2`)}
      onClick={onClick}
    >
      <CopyIcon />
      Copy
    </Button>
  );
};
