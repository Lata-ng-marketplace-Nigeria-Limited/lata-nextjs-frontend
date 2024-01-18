import React from "react";

interface Props {
  subcategory: string;
  handleClick?: () => void;
}

const Subcategory = ({ subcategory, handleClick }: Props) => {
  return (
    <div className="overflow-y-auto bg-white p-6" onClick={handleClick}>
      {JSON.parse(subcategory).map((title: string, index: number) => (
        <div
          className="cursor-pointer border-b border-grey2 p-3 hover:bg-purp1"
          key={index}
        >
          <p>{title}</p>
        </div>
      ))}
    </div>
  );
};

export default Subcategory;
