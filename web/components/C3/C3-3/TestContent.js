import { DatePicker, InputNumber, Select, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import React from "react";
import Icon from "~/components/Icon";
import EachInput from "./EachInput";

const TestContent = ({
  targetData,
  listOption,
  newTest,
  setNewTest,
  target,
  setTarget,
}) => {
  const { Option } = Select;
  const { confirm } = Modal;

  const handleSelect = (value) => {
    const selectedTest = listOption.filter((each) => each.id === value);
    if (selectedTest.length === 0) return;
    let scoreEachs = [];
    console.log("==> test", selectedTest[0].contestScoreEachs);
    if (selectedTest[0].contestScoreEachs?.length !== 0) {
      scoreEachs = selectedTest[0].contestScoreEachs.map(
        ({ id, name, maxScore }) => {
          return {
            id,
            part_name: name,
            expected_score: null,
            result: 0,
            maxScore,
          };
        }
      );
    } else {
      scoreEachs = [
        {
          id: selectedTest[0].id,
          part_name: "総合得点",
          expected_score: null,
          result: 0,
          maxScore: selectedTest[0].totalScore,
        },
      ];
    }
    if (newTest) {
      setTarget({
        ...target,
        testContent: [
          ...target.testContent,
          {
            ...newTest,
            test_content: {
              contest: {
                id: value,
                contets_name: selectedTest[0].contestName,
              },
              score_eachs: scoreEachs,
              contest_id: value,
              date_of_contest: moment(new Date()).format("YYYY-MM-DD"),
            },
          },
        ],
      });
      setNewTest(null);
    } else {
      const updateTest = target.testContent.map((each) => {
        if (each.id === targetData.id) {
          return {
            ...targetData,
            test_content: {
              contest: {
                id: value,
                contets_name: selectedTest[0].contestName,
              },
              score_eachs: scoreEachs,
              contest_id: value,
              date_of_contest: moment(new Date()).format("YYYY-MM-DD"),
            },
            update: true,
          };
        }
        return each;
      });
      setTarget({
        ...target,
        testContent: [...updateTest],
        changed: true,
      });
    }
  };

  const handleChangeDatePicker = (value) => {
    if (value) {
      const changeDate = value.format("YYYY-MM-DD");
      const updateTest = target.testContent.map((each) => {
        if (each.id === targetData.id) {
          return {
            ...targetData,
            test_content: {
              ...targetData.test_content,
              date_of_contest: changeDate,
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
    }
  };

  const handleChangeInput = (value, part) => {
    const updateScore = targetData.test_content.score_eachs.map((each) => {
      if (each.id === part.id) each.expected_score = value;
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

  const handleDelete = () => {
    if(newTest) {
      setNewTest(null);
    } else {
      confirm({
        title: "削除してもよろしいですか？",
        centered: true,
        destroyOnClose: true,
        icon: <ExclamationCircleOutlined />,
        okText: "はい",
        cancelText: "いいえ",
        onOk() {
          const updateTest = target.testContent.filter(
            (each) => each.id !== targetData.id
          );
          if (targetData.new) {
            setTarget({
              ...target,
            testContent: [
              ...updateTest,
            ],
            changed: true,
            })
          } else {
            setTarget({
              ...target,
              testContent: [
                ...updateTest,
                {
                  ...targetData,
                  delete: true,
                },
              ],
              changed: true,
            });
          }
        },
        onCancel() {
          return;
        },
      });
    }
  };

  return (
    <div className="flex w-full gap-20">
      <div className="flex-grow flex flex-col">
        <EachInput label="試験">
          <Select
            className="text-default font-normal w-1/4"
            value={targetData.test_content?.contest_id}
            onChange={(value) => handleSelect(value)}
            disabled={!targetData.new}
            style={{
              width: "25%",
            }}
          >
            {listOption.map((each, index) => (
              <Option
                className="text-default"
                value={each.id}
                key={`select-option-${each.id}-${index}`}
              >
                {each.contestName}
              </Option>
            ))}
          </Select>
        </EachInput>

        <EachInput label="受験日">
          <DatePicker
            format="YYYY/MM/DD"
            className="text-default font-normal w-1/4"
            placeholder="年月日選択"
            disabledDate={(date) => {
              if (targetData.new) {
                return date < new Date();
              }
              return date < moment(target.currentDate);
            }}
            value={
              targetData.test_content
                ? moment(targetData.test_content.date_of_contest)
                : undefined
            }
            onChange={(value) => handleChangeDatePicker(value)}
          />
        </EachInput>

        <div className="pl-10 flex flex-col">
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
                      <span className="absolute right-0">この項目は必須です</span>
                    </div>
                  ),
                },
              ]}
            >
              <InputNumber
                className="text-default w-[80px]"
                placeholder="0"
                value={each.expected_score}
                min={0}
                max={each.maxScore ? each.maxScore : 10000}
                onChange={(value) => handleChangeInput(value, each)}
              />
            </EachInput>
          ))}
        </div>
      </div>
      <Icon
        name="delete"
        color="danger"
        size={28}
        className="cursor-pointer"
        onClick={handleDelete}
      />
    </div>
  );
};

export default React.memo(TestContent);
