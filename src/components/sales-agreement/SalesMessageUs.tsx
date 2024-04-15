"use client";
import MobileBorderArea from "@atom/MobileBorderArea";
import { cn } from "@/utils";
import HeaderText from "@atom/HeaderText";
import HeaderSubText from "@atom/HeaderSubText";
import Button from "@atom/Button";
import { useToast } from "@components/ui/use-toast";
import { useState } from "react";
import TextAreaInput from "@components/input/TextAreaInput";
import { messageLataApi } from "@/api/feedback";
import useGetSwitchedRolesQueries from "@/hooks/useGetSwitchedRolesQueries";

export const SalesMessageUs = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const queries = useGetSwitchedRolesQueries();
  const handleSend = async () => {
    setLoading(true);
    try {
      await messageLataApi({
        message: message,
        queries,
      });
      toast({
        variant: "success",
        title: "Message sent successfully",
      });
      setMessage("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Message not sent",
        description: "An error occured while sending your message",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileBorderArea
      showBorderInDesktop
      className={cn(`h-max w-full px-6 py-6 sm:px-[60px]`)}
      removePadding
    >
      <HeaderText>Message LATA.ng</HeaderText>
      <HeaderSubText>
        You can send the LATA.ng team a direct message from here.
      </HeaderSubText>
      <HeaderSubText>
        If you have made a transfer, please include the payment ID, amount and
        date of transfer in your message.
      </HeaderSubText>

      <TextAreaInput
        wrapperClass={"mt-6 w-full "}
        inputClass={"h-[150px] sm:h-[150px] "}
        placeholder={"Write message"}
        value={message}
        setValue={setMessage}
        disabled={loading}
      />

      <Button
        disabled={!message || loading}
        format={"primary"}
        className={"ml-auto mt-[40px] block"}
        onClick={handleSend}
      >
        Send message
      </Button>
    </MobileBorderArea>
  );
};
