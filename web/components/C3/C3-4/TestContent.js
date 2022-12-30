import { InputNumber } from "antd";
import moment from "moment";
import React from "react";
import EachInput from "./EachInput.js";

const TestContent = ({ targetData, target, setTarget }) => {
  const handleChangeInput = (value, part) => {
    const updateScore = targetData.test_content.score_eachs.map((each) => {
      if (each.id === part.id) each.result = value;
      return each;
    });
    const updateTest = target.testContent.map((each) => {
      if (each.id === targetData.id) {
        return {
          ...targetData,
          test_content: {
            ...targetData.test_content,
            score_eachs: [...updateScore],
          },
        };
      }
      return each;
    });
    setTarget({
      ...target,
      testContent: [...updateTest],
      changed: true,
    });
  };

  return (
    <div className="flex w-full gap-20">
      <div className="flex-grow flex flex-col">
        <h2 className="m-0 text-default text-3xl font-bold mb-2">
          {targetData.test_content?.contest.contest_name}
        </h2>
        <h5 className="text-sm font-normal w-1/4">
          {moment(targetData.test_content.date_of_contest).format("YYYY/MM/DD")}
        </h5>
        <div className="pl-10 flex flex-col">
          <div className="flex flex-row">
            <div className="w-full justify-center mb-2"></div>
            <div className="w-full justify-center text-lg text-default font-bold mb-2">
              <span className="flex justify-center">目標</span>
            </div>
            <div className="w-64 justify-center text-lg text-primary font-bold mb-2">
              <span className="flex justify-center">実績</span>
            </div>
          </div>
          {targetData.test_content?.score_eachs?.map((each, index) => (
            <EachInput
              key={`score-${each.id}-${index}`}
              label={each.part_name}
              partId={each.id}
              defaultValue={each.expected_score}
              rules={[
                {
                  required: true,
                  message: (
                    <div className="w-full relative">
                      <span className="absolute right-0">
                        この項目は必須です
                      </span>
                    </div>
                  ),
                },
              ]}
            >
              <div className="w-full text-xl text-default">
                <span className="flex justify-center">
                  {each.expected_score}
                </span>
              </div>
              <div className="w-64 text-xl text-default">
                <span className="flex justify-end">
                  <InputNumber
                    className="text-xl text-default justify-center"
                    placeholder="0"
                    value={each.result}
                    min={0}
                    max={each.maxScore ? each.maxScore : 10000}
                    onChange={(value) => handleChangeInput(value, each)}
                  />
                </span>
              </div>
            </EachInput>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(TestContent);
