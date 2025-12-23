"use client";

import { useState } from "react";
import Button from "@atom/Button";
import HeaderText from "@/components/atom/HeaderText";
import TextInput from "@components/input/TextInput";
import { SelectInput } from "@components/input/SelectInput";
import TextAreaInput from "@components/input/TextAreaInput";
import Small from "@atom/Small";
import {
  EmailBroadcastCategory,
  EmailTemplateType,
  getUserCountByCategoryApi,
  sendBroadcastEmailApi,
} from "@/api/admin.client";
import { useToast } from "@/components/ui/use-toast";

const categoryOptions: { value: EmailBroadcastCategory; label: string }[] = [
  { value: "all", label: "All Users" },
  { value: "sellers", label: "All Sellers" },
  { value: "buyers", label: "All Buyers" },
  {
    value: "sellers_with_properties",
    label: "Sellers with Active Properties",
  },
  {
    value: "sellers_without_properties",
    label: "Sellers without Active Properties",
  },
  { value: "verified_users", label: "Verified Users" },
  { value: "unverified_users", label: "Unverified Users" },
  { value: "active_subscribers", label: "Active Subscribers" },
  { value: "expired_subscribers", label: "Expired Subscribers" },
  { value: "never_subscribed", label: "Users Never Subscribed" },
];

const templateOptions: { value: EmailTemplateType; label: string }[] = [
  { value: "custom", label: "Custom Message" },
  { value: "announcement", label: "Announcement" },
  { value: "promotion", label: "Promotion" },
];

export default function EmailBroadcast() {
  const { toast } = useToast();
  const [category, setCategory] = useState<EmailBroadcastCategory>("all");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [templateType, setTemplateType] = useState<EmailTemplateType>("custom");
  const [userCount, setUserCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleGetUserCount = async () => {
    setIsLoadingCount(true);
    try {
      const response = await getUserCountByCategoryApi(
        category,
        recipientEmail.trim() || undefined,
      );
      if (response.success) {
        setUserCount(response.data.count);
        toast({
          title: "Success",
          description: `Found ${response.data.count} user(s) in this category`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.data?.message || error?.message || "Failed to get user count",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCount(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Subject and message are required",
        variant: "destructive",
      });
      return;
    }

    if (userCount === 0) {
      toast({
        title: "Error",
        description: "No users found in the selected category",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await sendBroadcastEmailApi({
        category,
        recipientEmail: recipientEmail.trim() || undefined,
        subject,
        message,
        templateType,
      });

      if (response?.success) {
        toast({
          title: "Success",
          description: `Email sent to ${response.data.totalRecipients} user(s)!`,
        });
        // Reset form
        setRecipientEmail("");
        setSubject("");
        setMessage("");
        setUserCount(null);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.data?.message || error?.message || "Failed to send email",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <HeaderText title className="mb-6">
        Send Email Broadcast
      </HeaderText>

      <form onSubmit={handleSendEmail} className="space-y-6">
        <div>
          <TextInput
            label="Recipient Email (optional)"
            placeholder="Enter a single user's email to target"
            value={recipientEmail}
            onChange={(e) => {
              setRecipientEmail(e.target.value);
              setUserCount(null);
            }}
            name="recipientEmail"
            inputClass="!h-12"
          />
          <Small className="mt-1 text-gray-500">
            If provided, the broadcast will be sent only to this user.
          </Small>
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Select User Category
          </label>
          <SelectInput
            inputProps={{
              id: "category",
              name: "category",
              value: category,
            }}
            placeholder="Select category"
            options={categoryOptions}
            value={category}
            onValueChange={(value) => {
              setCategory(value as EmailBroadcastCategory);
              setUserCount(null);
            }}
            inputClass="!min-h-12"
          />
        </div>

        {/* Get User Count Button */}
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Button
            format="secondary"
            type="button"
            onClick={handleGetUserCount}
            disabled={isLoadingCount}
          >
            {isLoadingCount ? "Loading..." : "Preview Recipient Count"}
          </Button>
          {userCount !== null && (
            <span className="text-sm font-semibold text-gray-700">
              {userCount} user(s) will receive this email
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="templateType"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email Template Type
          </label>
          <SelectInput
            inputProps={{
              id: "templateType",
              name: "templateType",
              value: templateType,
            }}
            placeholder="Select template"
            options={templateOptions}
            value={templateType}
            onValueChange={(value) =>
              setTemplateType(value as EmailTemplateType)
            }
            inputClass="!min-h-12"
          />
        </div>

        <div>
          <TextInput
            label="Email Subject"
            placeholder="Enter email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            name="subject"
            inputClass="!h-12"
            required
            minLength={3}
            maxLength={200}
          />
          <Small className="mt-1 text-red-500">* Required</Small>
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email Message
          </label>
          <TextAreaInput
            placeholder="Enter email message (HTML supported)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            name="message"
            inputClass="h-[250px]"
            wrapperClass={"w-full"}
            required
            minLength={10}
          />
          <div className="mt-1 flex items-start gap-2">
            <Small className="text-red-500">* Required</Small>
            <Small className="text-gray-500">
              You can use HTML tags for formatting (e.g., &lt;b&gt;, &lt;i&gt;,
              &lt;br&gt;, &lt;p&gt;)
            </Small>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button
            format="primary"
            type="submit"
            disabled={isSending || userCount === null || userCount === 0}
          >
            {isSending ? "Sending..." : "Send Email Broadcast"}
          </Button>

          <Button
            format="secondary"
            type="button"
            onClick={() => {
              setRecipientEmail("");
              setSubject("");
              setMessage("");
              setUserCount(null);
            }}
          >
            Clear Form
          </Button>
        </div>

        {userCount !== null && userCount > 0 && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Warning: This action will send an email to {userCount} user(s).
              Please review your message carefully before sending.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
