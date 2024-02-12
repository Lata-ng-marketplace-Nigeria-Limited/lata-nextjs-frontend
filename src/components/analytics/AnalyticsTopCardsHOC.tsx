import React from "react";

interface Props {
  children: React.ReactNode;
}

const AnalyticsTopCardsHOC = (props: Props) => {
  return (
    <section className="mb-8 mt-6 rounded-[0.625rem] border border-solid border-grey2 px-6 py-6 lg:py-[2.19rem]">
      <div className="grid grid-cols-1 gap-6 xs:grid-cols-2  lg:grid-cols-4">
        {props.children}
      </div>
    </section>
  );
};

export default AnalyticsTopCardsHOC;
