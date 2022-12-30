import React, { useEffect, useState } from "react";
import { Form, InputNumber, message } from "antd";

const EditEachScoreForm = ({
  score_eache,
  target,
  handleEditScore,
  index,
  searchedContest,
}) => {
  return (
    <Form.Item
      label={
        <h4 className="text-default font-medium ml-14 w-40">
          {score_eache.part_name}
        </h4>
      }
      name={`${score_eache.part_name}${target.id}`}
      rules={[
        {
          required: true,
          message: (
            <span style={{ marginLeft: "144px" }}>この項目は必須です</span>
          ),
        },
      ]}
      key={index}
    >
      <InputNumber
        className="text-default"
        style={{ marginLeft: "144px" }}
        min={1}
        max={searchedContest.score_eaches[index].max_score}
        onChange={(value) => {
          handleEditScore(
            score_eache.part_name,
            value,
            searchedContest.score_eaches[index].max_score
          );
        }}
      />
    </Form.Item>
  );
};

export default EditEachScoreForm;
