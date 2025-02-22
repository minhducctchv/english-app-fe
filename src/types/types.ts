import { z } from "zod";
import { TextSchema } from "./jsonSchema";

export interface IVocabulary {
  _id?: any;
  id?: string;
  vocabulary: string;
  translatedVi: string;
  partsOfSpeech:
    | "verb"
    | "noun"
    | "adverb"
    | "adjective"
    | "pronoun"
    | "conjunction"
    | "preposition"
    | "article"
    | "interjection"
    | "determiner"
    | "other";
  pronunciation: string;
  definitionEn: string;
  definitionVi: string;
  exampleSentences: string;
  exampleSentencesVi: string;
  originalVocabulary: string;
  originalVocabularyBackup: string;
  audioUrl?: string;

  createdAt?: Date;
  updatedAt?: Date;

  cycle?: {
    countStudy: number;
    lastedStudyDate: Date;
    nextStudyDate: Date;
    nextStudyCoefficient: number;
  };
}

export type IText = z.infer<typeof TextSchema>;

export interface ISplitTextResult {
  smallerTexts: string[];
}

export interface IUser {
  id?: string;
  _id?: any;
  username: string;
  password: string;
  role: "ADMIN" | "CUSTOMER";
  createdAt: Date;
}

export const vocaTest = {
  _id: "any",
  pronunciation: "ˈiːmˌəʊdʒi",
  exampleSentences: "The message ended with a smiling emoji.",
  definitionVi:
    "biểu tượng cảm xúc kỹ thuật số, thường được sử dụng trong giao tiếp điện tử, điển hình là để thể hiện cảm xúc, ý tưởng hoặc đối tượng",
  definitionEn:
    "a digital image or icon used in electronic communication, typically to express an emotion, idea, or object",
  exampleSentencesVi: "Tin nhắn kết thúc bằng một biểu tượng cảm xúc cười.",
  originalVocabulary: "emoji",
  partsOfSpeech: "noun",
  vocabulary: "emoji",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export interface technicalTerms {
  aSoftwareSpecificTerm: string;
  meaning: string;
}

export enum StudyCoefficient {
  FORGET = 1,
  HARD = 2,
  REMEMBER = 3,
  EASY = 4,
}
