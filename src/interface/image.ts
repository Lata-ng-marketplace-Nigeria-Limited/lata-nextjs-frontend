export type UploadImageFormat = "profile" | "product" | "blocked-account"

export interface ImagePreview {
  url: string;
  name: string
  file?: File
}
