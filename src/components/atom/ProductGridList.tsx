import { cn } from "@/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  isEmpty?: boolean;
  total?: number;
}

export default function ProductGridList(props: Props) {
  return (
    <div
      className={cn(
        `
          grid
          grid-cols-1
          xms:grid-cols-2
          xs:grid-cols-3
          sm:grid-cols-3
          lg:grid-cols-4
          gap-x-2
          xs:gap-x-1
          sm:gap-x-4
          tablet:gap-x-2
          sl:gap-x-6
          lg:gap-x-2
          xlg:gap-x-6
          gap-y-3
          pt-3
      `,
        {
          block: props.isEmpty,
          [`
              xms:grid-cols-1
              xs:grid-cols-1
              sm:grid-cols-1
              lg:grid-cols-1
          `]: props.total === 1,
          //   [`
          //     xms:grid-cols-2
          //     xs:grid-cols-2
          //     sm:grid-cols-2
          //     lg:grid-cols-2
          // `]: props.total === 2,
        },
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
