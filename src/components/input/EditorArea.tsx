"use client";
import { Editor, EditorProps } from "@components/input/Editor";
import { useCallback, useState } from "react";
import { Toggle } from "@components/ui/toggle";
import { updateALegalDocApi } from "@/api/legal";
import { useToast } from "@components/ui/use-toast";

interface Props extends EditorProps {
  dontEdit?: boolean;
  id?: string;
}

export const EditorArea = ({ dontEdit, id, ...props }: Props) => {
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [docHtml, setDocHtml] = useState<string>();
  const { toast } = useToast();

  const onSave = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      await updateALegalDocApi(id, {
        html: docHtml,
      });
      toast({
        variant: "success",
        description: "Document saved successfully",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        description: "Document could not be saved",
      });
    } finally {
      setLoading(false);
    }
  }, [docHtml, id, toast]);

  return (
    <div>
      {!dontEdit ? (
        <div className={"mb-16 flex gap-x-6"}>
          <Toggle
            data-state={!preview ? "on" : "off"}
            variant={"outline"}
            onClick={() => setPreview(false)}
            className={"data-[state=on]:bg-primary data-[state=on]:text-white"}
          >
            Edit
          </Toggle>
          <Toggle
            data-state={preview ? "on" : "off"}
            variant={"outline"}
            onClick={() => setPreview(true)}
            className={"data-[state=on]:bg-primary data-[state=on]:text-white"}
          >
            Preview
          </Toggle>
        </div>
      ) : null}

      <Editor
        key={preview + ""}
        {...props}
        editable={dontEdit ? false : !preview}
        saving={loading}
        onSave={onSave}
        setDocHtml={setDocHtml}
        docHtml={docHtml}
      />
    </div>
  );
};
