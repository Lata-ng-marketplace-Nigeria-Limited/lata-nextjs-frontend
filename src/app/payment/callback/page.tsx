"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifySingleProductPromotionPaymentApi } from "@/api/payment.client";
import { Loader2 } from "lucide-react";
import { showToast } from "@/utils";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setErrorMessage("No payment reference found in URL.");
      return;
    }

    let isMounted = true;

    async function handleVerification() {
      try {
        const res = await verifySingleProductPromotionPaymentApi(reference!);
        if (isMounted) {
          setStatus("success");
          showToast(res.message || "Payment verified successfully!", "success");
          setTimeout(() => {
            router.push("/balance");
          }, 1500);
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus("error");
          const msg = err?.message || err?.error || "Payment verification failed.";
          setErrorMessage(msg);
          showToast(msg, "destructive");
        }
      }
    }

    handleVerification();

    return () => {
      isMounted = false;
    };
  }, [reference, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      {status === "loading" && (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">Verifying your payment...</h2>
          <p className="text-sm text-gray-500">
            Please wait while we confirm your transaction with Paystack. Do not close this window.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold">
            ✓
          </div>
          <h2 className="text-xl font-semibold text-green-700">Payment Successful!</h2>
          <p className="text-sm text-gray-500">Redirecting you to your account...</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center space-y-4 max-w-md">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-bold">
            ✕
          </div>
          <h2 className="text-xl font-semibold text-red-700">Payment Verification Failed</h2>
          <p className="text-sm text-gray-600">{errorMessage}</p>
          <button
            onClick={() => router.push("/balance")}
            className="px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="mt-4 text-sm text-gray-500">Loading payment status...</p>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
