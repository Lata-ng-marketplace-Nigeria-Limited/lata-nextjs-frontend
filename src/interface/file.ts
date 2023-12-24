export type FileFormat = "IMAGE" | "VIDEO" | "DOC";

export interface FileData {
  id: string;
  url: string;
  format: FileFormat;
  meta: null | {
    selectedImage: boolean;
    clientName: string;
    size: number;
    type: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}
