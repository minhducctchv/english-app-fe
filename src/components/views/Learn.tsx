import { useQuery } from "@tanstack/react-query";
import { Button, message, Spin, Switch, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import useVocabularyApi from "../../hook/api/useVocabularyApi";
import { IVocabulary, StudyCoefficient, Level } from "../../types/types";
import RIf from "../common/RIf";
import Exercise from "./exercise/Exercise";

export const handleLearnVoca = (
  voca: IVocabulary,
  coefficient: StudyCoefficient,
): IVocabulary => {
  if (!voca.cycle) {
    voca.cycle = {
      countStudy: 0,
      nextStudyCoefficient: 1,
      lastedStudyDate: dayjs().toDate(),
      nextStudyDate: dayjs().toDate(),
      level: Level.NEW,
    };
  }

  if (!voca.cycle.countStudy) voca.cycle.countStudy = 0;
  if (!voca.cycle.nextStudyCoefficient) voca.cycle.nextStudyCoefficient = 1;
  voca.cycle.countStudy += 1;
  voca.cycle.lastedStudyDate = dayjs().toDate();
  voca.cycle.nextStudyCoefficient *= coefficient;
  voca.cycle.nextStudyDate = dayjs()
    .add(voca.cycle.nextStudyCoefficient, "days")
    .toDate();
  switch (coefficient) {
    case StudyCoefficient.FORGET:
      voca.cycle.level = Level.FORGET;
      break;
    case StudyCoefficient.HARD:
      voca.cycle.level = Level.HARD;
      break;
    case StudyCoefficient.REMEMBER:
      voca.cycle.level = Level.REMEMBER;
      break;
    case StudyCoefficient.EASY:
      voca.cycle.level = Level.EASY;
      break;
  }
  return voca;
};

const FourBtn = [
  {
    label: "FORGET",
    color: "bg-red-500",
    value: StudyCoefficient.FORGET,
  },
  {
    label: "HARD",
    color: "bg-yellow-600",
    value: StudyCoefficient.HARD,
  },
  {
    label: "REMEMBER",
    color: "bg-green-500",
    value: StudyCoefficient.REMEMBER,
  },
  {
    label: "EASY",
    color: "bg-blue-500",
    value: StudyCoefficient.EASY,
  },
];

export default function Learn() {
  const { search, update } = useVocabularyApi();
  const [isToday, setIsToday] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [focusIndex, setFocusIndex] = useState<number>(-1);
  const buttonRefs = useRef<(HTMLElement | null)[]>([]);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["get-vocas", isToday],
    queryFn: () =>
      search({
        isToday: isToday,
        isPast: !isToday,
        page: 1,
        size: 500,
      }),
  });

  useEffect(() => {
    setFocusIndex(-1);
    buttonRefs.current = [];
  }, [data?.data]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl (Windows/Linux) or Command (Mac) + I
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
        e.preventDefault();
        setFocusIndex((prev) => {
          // Calculate total visible buttons based on FourBtn length
          const totalButtons = FourBtn.length;

          const nextIndex = prev + 1;
          if (nextIndex >= totalButtons) {
            return 0; // Loop back to start
          }
          return nextIndex;
        });
      }

      if (e.key === "Enter") {
        if (focusIndex >= 0 && buttonRefs.current[focusIndex]) {
          e.preventDefault();
          buttonRefs.current[focusIndex]?.click();
        }
      }

      if (e.key === "Escape") {
        e.preventDefault();
        setFocusIndex(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusIndex]);

  const updateVocaLearn = (
    item: IVocabulary,
    coefficient: StudyCoefficient,
  ) => {
    item = handleLearnVoca(item, coefficient);
    setLoadingUpdate(true);
    update(item._id, item)
      .then(() => {
        message.success("Learn 1 voca :))");
        refetch();
      })
      .catch((err: any) => {
        message.error(err?.message);
      })
      .finally(() => {
        setLoadingUpdate(false);
      });
  };

  return (
    <Spin spinning={isLoading || isFetching}>
      <div className="mb-4">
        <Switch
          checkedChildren="TODAY"
          unCheckedChildren="PAST"
          checked={isToday}
          onChange={setIsToday}
        />
      </div>
      <RIf
        condition={data?.pagination.total > 0}
        result1={
          <>
            <Exercise vocabulary={data?.data[0]} />
            <Spin spinning={loadingUpdate}>
              <div className="flex items-center justify-center gap-1">
                {FourBtn.map((btn, index) => (
                  <Button
                    key={btn.value}
                    ref={(el) => (buttonRefs.current[index] = el)}
                    className={`${
                      focusIndex === index
                        ? "scale-110 shadow-xl border-2 border-white z-10"
                        : ""
                    } transition-all duration-200 ${
                      btn.color
                    } min-w-[100px] min-h-[60px] text-center font-bold text-white`}
                    onClick={() => updateVocaLearn(data?.data[0], btn.value)}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            </Spin>
          </>
        }
        result2={
          <div className="text-center p-5 bg-gray-50 rounded-lg shadow-md mx-auto">
            <Typography.Title>Congratulations</Typography.Title>
            <div>You learned ALL Vocas</div>
          </div>
        }
      />
    </Spin>
  );
}
