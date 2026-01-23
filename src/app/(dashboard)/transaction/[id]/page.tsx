import HeaderText from "@atom/HeaderText";
import { Suspense } from "react";
import { Transaction } from "@components/transaction/Transaction";

export default async function Page(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const params = await props.params;
  const { id } = params;
  return (
    <div>
      <HeaderText title className={"mb-6 md:mb-8"}>
        Transaction
      </HeaderText>

      <Suspense key={id} fallback={<div>loading</div>}>
        <Transaction id={id} />
      </Suspense>
    </div>
  );
}
