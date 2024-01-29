import React from "react";
import FeedbackButton from "./FeedbackButton";
import { Product } from "@/interface/products";

interface Props {
  product: Product;
}

const FeedbackContent = (props: Props) => {
  return (
    <div className="rounded-xl border border-grey2 px-10 py-6">
      <FeedbackButton
        isActive
        type="positive"
        className="pointer-events-none max-w-max"
      />
      <h2 className="mb-5 text-xl font-semibold text-grey9">Matthew Lean</h2>
      <p className="text-sm font-normal text-grey7">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamcolaboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
    </div>
  );
};

export default FeedbackContent;
