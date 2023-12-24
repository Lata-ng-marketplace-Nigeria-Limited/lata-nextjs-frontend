import { cn } from "@/utils";

export default function CarouselNextBtn() {
  return (
    <button
      type="button"
      className={cn(
        "absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group outline-none",
      )}
      data-carousel-next
    >
      <span
        className={cn(
          "inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/30 dark:bg-gray-800/30 group-hover:bg-black/50 outline-none",
        )}
      >
        <svg
          className="w-4 h-4 text-white dark:text-gray-800"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 9 4-4-4-4"
          />
        </svg>
        <span className="sr-only">Next</span>
      </span>
    </button>
  );
}
