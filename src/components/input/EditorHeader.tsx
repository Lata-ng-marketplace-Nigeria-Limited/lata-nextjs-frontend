import { Toggle } from "@components/ui/toggle";
import {
  Bold,
  Italic,
  ListOrdered,
  List,
  AlignRight,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  Underline,
  Heading1,
  Heading2,
  Indent,
  UndoDot,
  RedoDot,
  Link,
  Unlink,
  Save,
} from "lucide-react";
import { useCurrentEditor } from "@tiptap/react";
import { useCallback } from "react";
import { cn } from "@/utils";
import Button from "@atom/Button";
import { AppTooltip } from "@molecule/AppTooltip";

interface Props {
  onSaveDocument?: () => void;
  saving?: boolean;
}

export const EditorHeader = ({ onSaveDocument, saving }: Props) => {
  const { editor } = useCurrentEditor();

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const clusterClass = cn(
    "flex gap-x-1 border-r pr-2 border-solid border-r-grey8 w-fit",
  );

  return (
    <div
      className={
        "absolute -top-10 left-0 flex w-full max-w-full gap-x-2 overflow-x-auto bg-white"
      }
    >
      <div className={clusterClass}>
        <AppTooltip title={"Paragraph"}>
          <Toggle
            onClick={() => editor.chain().focus().setParagraph().run()}
            data-state={editor.isActive("paragraph") ? "on" : "off"}
            aria-label="Toggle paragraph"
          >
            <span className="h-4 w-4 text-base font-normal leading-tight">
              P
            </span>
          </Toggle>
        </AppTooltip>

        <AppTooltip title={"Heading 1"}>
          <Toggle
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            data-state={editor.isActive("heading", { level: 1 }) ? "on" : "off"}
            aria-label="Toggle align right"
          >
            <Heading1 className="h-4 w-4" />
          </Toggle>
        </AppTooltip>

        <AppTooltip title={"Heading 2"}>
          <Toggle
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            data-state={editor.isActive("heading", { level: 2 }) ? "on" : "off"}
            aria-label="Toggle align right"
          >
            <Heading2 className="h-4 w-4" />
          </Toggle>
        </AppTooltip>
      </div>

      <div className={clusterClass}>
        <AppTooltip title={"Bold"}>
          <Toggle
            data-state={editor.isActive("bold") ? "on" : "off"}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            onClick={() => editor.chain().focus().toggleBold().run()}
            aria-label="Toggle bold"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
        </AppTooltip>

        <AppTooltip title={"Italic"}>
          <Toggle
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            data-state={editor.isActive("italic") ? "on" : "off"}
            aria-label="Toggle italic"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
        </AppTooltip>

        <AppTooltip title={"Underline"}>
          <Toggle
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            data-state={editor.isActive("underline") ? "on" : "off"}
            aria-label="Toggle underline"
          >
            <Underline className="h-4 w-4" />
          </Toggle>
        </AppTooltip>
      </div>

      <div className={clusterClass}>
        <AppTooltip title={"Align left"}>
          <Toggle
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            data-state={editor.isActive({ textAlign: "left" }) ? "on" : "off"}
            aria-label="Toggle align left"
          >
            <AlignLeft className="h-4 w-4" />
          </Toggle>
        </AppTooltip>

        <AppTooltip title={"Align center"}>
          <Toggle
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            data-state={editor.isActive({ textAlign: "center" }) ? "on" : "off"}
            aria-label="Toggle align center"
          >
            <AlignCenter className="h-4 w-4" />
          </Toggle>
        </AppTooltip>

        <AppTooltip title={"Align justify"}>
          <Toggle
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            data-state={
              editor.isActive({ textAlign: "justify" }) ? "on" : "off"
            }
            aria-label="Toggle align justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Toggle>
        </AppTooltip>

        <AppTooltip title={"Align right"}>
          <Toggle
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            data-state={editor.isActive({ textAlign: "right" }) ? "on" : "off"}
            aria-label="Toggle align right"
          >
            <AlignRight className="h-4 w-4" />
          </Toggle>
        </AppTooltip>
      </div>

      <div className={clusterClass}>
        <AppTooltip title={"Ordered list"}>
          <Toggle
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            data-state={editor.isActive("orderedList") ? "on" : "off"}
            aria-label="Toggle ordered list"
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>
        </AppTooltip>

        <AppTooltip title={"Bullet list"}>
          <Toggle
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            data-state={editor.isActive("bulletList") ? "on" : "off"}
            aria-label="Toggle bullet list"
          >
            <List className="h-4 w-4" />
          </Toggle>
        </AppTooltip>

        <AppTooltip title={"Indent"}>
          <Toggle aria-label="Toggle align right">
            <Indent className="h-4 w-4" />
          </Toggle>
        </AppTooltip>

        <AppTooltip title={"Link"}>
          <Toggle
            onClick={setLink}
            data-state={editor.isActive("link") ? "on" : "off"}
            aria-label="Toggle align right"
          >
            <Link className="h-4 w-4" />
          </Toggle>
        </AppTooltip>

        <AppTooltip title={"Unlink"}>
          <Toggle
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
            data-state={"off"}
            aria-label="Toggle align right"
          >
            <Unlink className="h-4 w-4" />
          </Toggle>
        </AppTooltip>

        <AppTooltip title={"Undo"}>
          <Toggle
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            aria-label="Toggle align right"
            data-state={"off"}
          >
            <UndoDot className="h-4 w-4" />
          </Toggle>
        </AppTooltip>

        <AppTooltip title={"Redo"}>
          <Toggle
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            data-state={"off"}
            aria-label="Toggle align right"
          >
            <RedoDot className="h-4 w-4" />
          </Toggle>
        </AppTooltip>
      </div>

      <AppTooltip title={"Save changes"}>
        <Button
          onClick={onSaveDocument}
          disabled={saving}
          format={"primary"}
          className={" px-2 py-0 sm:py-0 md:px-3"}
          aria-label={"Save changes"}
        >
          <Save className="h-5 w-5" />
        </Button>
      </AppTooltip>
    </div>
  );
};
