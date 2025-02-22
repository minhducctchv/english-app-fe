import { useQuery } from "@tanstack/react-query";
import { Button, message, Spin, Switch, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import useVocabularyApi from "../../hook/api/useVocabularyApi";
import { IVocabulary, StudyCoefficient } from "../../types/types";
import RIf from "../common/RIf";
import WordGuessingGame from "./WordGuessingGame";

export const handleLearnVoca = (
  voca: IVocabulary,
  coefficient: StudyCoefficient
): IVocabulary => {
  if (!voca.cycle) {
    voca.cycle = {
      countStudy: 0,
      nextStudyCoefficient: 1,
      lastedStudyDate: dayjs().toDate(),
      nextStudyDate: dayjs().toDate(),
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
  return voca;
};

const FourBtn = [
  // {
  //   label: "FORGET",
  //   color: "bg-red-500",
  //   value: StudyCoefficient.FORGET,
  // },
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
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isChiu, setIsChiu] = useState<boolean>(false);

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
    setIsChiu(false);
    setIsSuccess(false);
  }, [data?.data]);

  const updateVocaLearn = (
    item: IVocabulary,
    coefficient: StudyCoefficient
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
            <WordGuessingGame
              voca={data?.data[0] ?? {}}
              isSuccess={isSuccess}
              setIsSuccess={setIsSuccess}
            />
            <Spin spinning={loadingUpdate}>
              <div className="flex items-center justify-center gap-1">
                {isChiu ? (
                  <Button
                    className={`${"bg-red-500"} min-w-[100px] min-h-[60px] text-center font-bold text-white`}
                    onClick={() =>
                      updateVocaLearn(data?.data[0], StudyCoefficient.FORGET)
                    }
                  >
                    FORGET
                  </Button>
                ) : (
                  <Button
                    className={`${"bg-red-500"} min-w-[100px] min-h-[60px] text-center font-bold text-white`}
                    onClick={() => {
                      setIsChiu(true);
                      setIsSuccess(true);
                    }}
                  >
                    CHỊU
                  </Button>
                )}
                {isSuccess &&
                  !isChiu &&
                  FourBtn.map((btn) => (
                    <Button
                      key={btn.value}
                      className={`${btn.color} min-w-[100px] min-h-[60px] text-center font-bold text-white`}
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
