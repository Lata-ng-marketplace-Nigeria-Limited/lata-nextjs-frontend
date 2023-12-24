"use client";

import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditorHeader } from "@components/input/EditorHeader";
import { TextAlign } from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import "@styles/tiptap.scss";
import { cn } from "@/utils";
import React, { useCallback } from "react";

const extensions = [
  StarterKit,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Underline,
];

export interface EditorProps {
  editable?: boolean;
  html?: string;
  json?: Record<any, any>;
  onSave?: () => void;
  saving?: boolean;
  docHtml?: string;
  setDocHtml?: React.Dispatch<string>;
}

export const Editor = ({
  editable = true,
  json,
  html,
  saving,
  docHtml,
  setDocHtml,
  onSave,
}: EditorProps) => {
  const onSaveDocument = useCallback(() => {
    if (onSave) {
      onSave();
    }
  }, [onSave]);

  return (
    <div className={"relative"}>
      <EditorProvider
        extensions={[
          ...extensions,
          Link.configure({
            openOnClick: !editable,
          }),
        ]}
        content={docHtml || html || json}
        editable={saving ? false : editable}
        // editable={false}
        slotBefore={
          !editable ? undefined : (
            <EditorHeader onSaveDocument={onSaveDocument} saving={saving} />
          )
        }
        editorProps={{
          attributes: {
            class: cn(
              `
            outline-none 
            p-4 
            border 
            border-grey5 
            rounded-md 
            border-solid 
            min-h-[calc(100vh-50px-200px)]
            md:min-h-[calc(100vh-60px-200px)]
            `,
              {
                "p-0 border-none": !editable,
                "overflow-y-auto shadow-md mt-10 md:max-h-[calc(100vh-60px-200px)] max-h-[calc(100vh-50px-200px)]":
                  editable,
              },
            ),
          },
        }}
        onUpdate={({ editor }) => setDocHtml?.(editor?.getHTML() || "")}
      >
        <></>
      </EditorProvider>
    </div>
  );
};
