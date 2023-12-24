import { cn } from "@/utils";

interface Props {
  label?: string;
  index: number;
  total: number;
}
export default function CarouselPinButton(props: Props) {
  return (
    <button
      type="button"
      className={cn("w-2 h-2 rounded-full aria-[current=true]:bg-primary")}
      aria-current="false"
      aria-label={props.label || `Slide ${props.index + 1}`}
      data-carousel-slide-to={`${props.index}`}
    />
  );
}
