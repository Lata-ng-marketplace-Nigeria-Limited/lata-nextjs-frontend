import { Invoice, Transaction } from "@/interface/payment";
import { $http } from "@/service/axios";

export const findAnInvoiceApi = async (
  id: string,
): Promise<{
  message: string;
  invoice: Invoice;
  pdfUrl: string;
}> => {
  try {
    const res = await $http.get(`/invoices/${id}`);
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};

export const verifyAnInvoiceApi = async (
  id: string,
): Promise<{
  message: string;
  invoice: Invoice;
  transaction: Transaction;
}> => {
  try {
    const res = await $http.get(`/invoices/verify/${id}`);
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};
