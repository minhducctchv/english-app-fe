import { IVocabulary, Level } from "../../../../types/types";
import VocaExerciseEasy from "./VocaExerciseEasy";
import VocaExerciseNormal from "./VocaExerciseNormal";

interface IProps {
  vocabulary: IVocabulary;
}
export default function VocaExercise({ vocabulary }: IProps) {
  const difficulty = vocabulary.cycle?.level || Level.NEW;
  if (difficulty === Level.REMEMBER || difficulty === Level.EASY)
    return <VocaExerciseNormal vocabulary={vocabulary} />;

  return <VocaExerciseEasy vocabulary={vocabulary} />;
}
