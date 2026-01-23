"use client";

import dynamic from "next/dynamic";
import type { EditorProps } from "./Editor";

const Editor = dynamic(() => import("./Editor").then((m) => m.Editor), {
    ssr: false,
    loading: () => (
        <div className="min-h-[300px] animate-pulse rounded-md border border-grey5 bg-gray-100" />
    ),
});

export default function DynamicEditor(props: EditorProps) {
    return <Editor {...props} />;
}
