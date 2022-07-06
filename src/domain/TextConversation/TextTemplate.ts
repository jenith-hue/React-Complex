export interface QuickResponse {
  title: string;
  message: string;
  spanishMessage: string;
}

export interface TextTemplate {
  category: string;
  order: number;
  quickresponse: QuickResponse[];
}
