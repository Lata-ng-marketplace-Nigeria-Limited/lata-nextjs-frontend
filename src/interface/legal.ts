export interface LegalDoc {
  id: string;
  json?: Record<any, any>;
  html?: string;
  url?: string;
  name: LegalDocNames;
  createdAt: string;
  updatedAt: string;
}

export type LegalDocNames =
  | "terms and conditions"
  | "privacy policy"
  | "cookie policy"
  | "billing policy"
  | "copyright infringement policy"
  | "agent acquisition expert";
