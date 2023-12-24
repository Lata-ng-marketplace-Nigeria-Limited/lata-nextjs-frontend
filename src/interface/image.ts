export type UploadImageFormat = "profile" | "product"

export interface ImagePreview {
  url: string;
  name: string
  file?: File
}
