import axios from "axios";

interface IVocaInDic {
  phonetics: {
    audio?: string;
  }[];
}

export class CallDictionaryService {
  static async getAudio(voca: string) {
    const response = await axios.get<IVocaInDic[]>(
      "https://api.dictionaryapi.dev/api/v2/entries/en/" + voca.trim()
    );
    for (const voca of response.data) {
      for (const phonetic of voca.phonetics) {
        if (phonetic?.audio) return phonetic.audio;
      }
    }
    throw new Error("Audio not found");
  }
}
