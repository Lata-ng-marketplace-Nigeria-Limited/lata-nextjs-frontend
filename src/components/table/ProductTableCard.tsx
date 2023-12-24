import { Product } from "@/interface/products";
import { cn } from "@/utils";
import Image from "next/image";

interface Props {
  product: Product;
}
export default function ProductTableCard(props: Props) {
  return (
    <div className={cn(`flex gap-x-3 items-center`)}>
      <div className={cn("w-16 h-16 rounded-md shrink-0")}>
        <Image
          className={"w-full h-full rounded-md shrink-0"}
          width={64}
          height={64}
          src={props?.product?.meta?.selectedImage || ""}
          alt={props?.product?.name}
        />
      </div>

      <div className={"flex flex-col "}>
        <p className={"text-sm font-medium"}>{props.product?.name}</p>
        <p className={"text-sm font-normal"}>{props.product?.category?.name}</p>
      </div>
    </div>
  );
}
