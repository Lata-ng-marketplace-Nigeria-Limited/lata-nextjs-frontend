import React from "react";
import { CallManagerButton } from "../call-manager/CallManagerButton";

const ContactSupport = () => {
  return (
    <section className="mt-12 flex justify-center">
      <div className="max-w-screen-lg rounded-[0.625rem] border border-grey2 p-6">
        <h1 className="mb-6 text-center text-xl font-semibold xs:text-2xl">
          Contact Support
        </h1>
        <div className="rounded-[0.625rem] border border-grey2 p-6">
          <h2 className="mb-3 text-center text-xl font-semibold">
            Call manager
          </h2>
          <p className="text-center text-grey9">
            You can call the LATA.ng manager on the number below
          </p>
          <div className="flex justify-center">
            <CallManagerButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSupport;
