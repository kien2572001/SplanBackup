import { AutoComplete, DatePicker, Form, InputNumber } from "antd";
import { useEffect, useRef, useState } from "react";
import client from "~/api/client";
import Icon from "~/components/Icon";
import EditEachScoreForm from "./EditEachScoreForm";

const ContestTarget = ({
  target,
  handleDeleteTarget,
  handleEditTarget,
  dateOfTarget,
}) => {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState([]);
  const filteringTimeout = useRef(null);
  const [searchedContest, setSearchedContest] = useState(null);

  const handleSelectExamDate = (date, dateString) => {
    const newJapaneseContest = { ...target };
    newJapaneseContest.exam_date = dateString;
    handleEditTarget(newJapaneseContest.id, newJapaneseContest);
  };

  const handleEditScore = (partName, score,max_score) => {
    const newJapaneseContest = { ...target };
    const index = newJapaneseContest.score_eaches.indexOf(
      newJapaneseContest.score_eaches.find(
        (score) => score.part_name === partName
      )
    );
    newJapaneseContest.score_eaches[index] = {
      part_name: partName,
      expected_score: score,
      max_score:max_score
    };
    handleEditTarget(newJapaneseContest.id, newJapaneseContest);
  };

  const onSelect = (data) => {
    setValue(data);
    const newJapaneseContest = { ...target };
    newJapaneseContest.contest_name = data;
    handleEditTarget(newJapaneseContest.id, newJapaneseContest);
  };

  const AutoCompleteOnChange = (data) => {
    setValue(data);
  };


  useEffect(() => {
    const callAPI = async () => {
      try {
        const res = await client
          .post("contests/filter", {
            searchParams: {
              name: value,
              category: target.category,
            },
          })
          .json();
        if (res && res.success) {
          const newOptions = res.data.map((contest) => {
            return {
              label: contest.contestName,
              value: contest.contestName,
            };
          });
          setOptions(newOptions);
          if (res.data.length === 1) {
            const newJapaneseContest = { ...target };
            
            newJapaneseContest.score_eaches = res.data[0].contestScoreEachs.map(
              (scoreEache) => {
                return {
                  part_name: scoreEache.name,
                  expected_score: -1,
                  max_score: scoreEache.maxScore,
                };
              }
            );
            if (newJapaneseContest.score_eaches.length === 0) {
              newJapaneseContest.score_eaches = [
                {
                  part_name: "総合得点",
                  expected_score: -1,
                  max_score: 100,
                },
              ];
            }
            setSearchedContest(newJapaneseContest);
            handleEditTarget(newJapaneseContest.id, newJapaneseContest);
          }
        }
      } catch (error) {}
    };
    if (filteringTimeout.current) {
      clearTimeout(filteringTimeout.current);
    }
    filteringTimeout.current = setTimeout(() => {
      callAPI();
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex p-4 w-full justify-center">
      <div className="">
        <Form.Item
          label={<h4 className="text-default font-medium w-40">試験</h4>}
          name={`contestName${target.id}`}
          rules={[
            {
              required: true,
              message: (
                <span style={{ marginLeft: "200px" }}>この項目は必須です</span>
              ),
            },
          ]}
          initialValue={target.contest_name}
        >
          <AutoComplete
            options={options}
            className="w-40 text-default"
            style={{ width: "160px", marginLeft: "200px" }}
            value={value}
            placeholder="試験名"
            onSelect={onSelect}
            onChange={AutoCompleteOnChange}
            autoFocus
          />
        </Form.Item>

        <Form.Item
          label={<h4 className="text-default font-medium w-40">受験日</h4>}
          name={`examDate${target.id}`}
          rules={[
            {
              required: true,
              message: (
                <span style={{ marginLeft: "200px" }}>この項目は必須です</span>
              )
            },
          ]}
        >
          <DatePicker
            className="w-40"
            disabled={!dateOfTarget || dateOfTarget === "-01"}
            disabledDate={(current) => {
              return current && current < Date.parse(dateOfTarget);
            }}
            labelAlign="right"
            placeholder="受験日"
            onChange={handleSelectExamDate}
            style={{ marginLeft: "200px" }}
          />
        </Form.Item>
        {target.score_eaches.map((score_eache, index) => {
          return (
            <EditEachScoreForm
              key={index}
              index={index}
              score_eache={score_eache}
              handleEditScore={handleEditScore}
              target={target}
              searchedContest={searchedContest}
            />
          );
        })}
      </div>
      <div className="ml-20">
        <Icon
          className="cursor-pointer"
          name="delete"
          color="danger"
          size={18}
          onClick={() => handleDeleteTarget(target.id)}
        />
      </div>
    </div>
  );
};

export default ContestTarget;
