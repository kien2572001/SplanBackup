import React, { useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Divider, Form, Input, Modal } from "antd";
import Icon from "~/components/Icon";
import TestContent from "./TestContent";

const EditTest = ({
  type,
  title,
  categoryId,
  targetDetail,
  target,
  setTarget,
  listOption,
}) => {
  const [newTest, setNewTest] = useState(null);
  const { confirm } = Modal;

  const handleDelete = (targetData) => {
    if(!Boolean(targetData.free_content.content) && targetData.new) {
      const updateTest = target.freeContent.filter(
        (test) => test.id !== targetData.id
      );
      setTarget({
        ...target,
        freeContent: [...updateTest],
      });
    } else {
      confirm({
        title: "削除してもよろしいですか？",
        centered: true,
        destroyOnClose: true,
        icon: <ExclamationCircleOutlined />,
        okText: "はい",
        cancelText: "いいえ",
        onOk() {
          const updateTest = target.freeContent.filter(
            (test) => test.id !== targetData.id
          );
          if (targetData.new) {
            setTarget({
              ...target,
              freeContent: [...updateTest],
            });
          } else {
            setTarget({
              ...target,
              freeContent: [
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
    <>
      {targetDetail && type === 0 && (
        <div className="">
          <p className="m-0 text-default text-3xl font-bold mb-2">{title}</p>
          <div className="px-32">
            {targetDetail.map((each, index) => (
              <div key={`test-content-${each.id}-${index}`}>
                <TestContent
                  listOption={listOption}
                  targetData={each}
                  target={target}
                  setTarget={setTarget}
                />
                <Divider />
              </div>
            ))}

            {newTest ? (
              <>
                <TestContent
                  listOption={listOption}
                  target={target}
                  setTarget={setTarget}
                  newTest={newTest}
                  setNewTest={setNewTest}
                  targetData={newTest}
                />
                <Divider />
              </>
            ) : (
              <Icon
                name="plus-circle"
                color={"primary"}
                size={21}
                className=" cursor-pointer"
                onClick={() => {
                  const newTestId = target.testCount + 1;
                  setTarget({
                    ...target,
                    testCount: newTestId,
                    changed: true,
                  });
                  setNewTest({
                    id: newTestId,
                    category_id: categoryId,
                    type,
                    new: true,
                  });
                }}
              />
            )}
          </div>
        </div>
      )}
      {targetDetail && type === 1 && (
        <div className="px-10">
          <div className="pr-32 pl-28 flex flex-col">
            {targetDetail.map((each, index) => {
              if (!each.delete) {
                return (
                  <div 
                    key={`free-content-${each.id}-${index}`} 
                    className="flex w-full justify-center items-start gap-2"
                  >
                    <div className="flex-grow">
                      <Form.Item
                        key={`free-content-${each.id}-${index}`}
                        name={`free-content-${each.id}`}
                        rules={[
                          {
                            required: true,
                            message: "この項目は必須です",
                          },
                        ]}
                        initialValue={each?.free_content?.content}
                      >
                        <Input
                          className="w-full"
                          placeholder="目標を入力してください"
                          value={each?.free_content?.content}
                          onChange={(event) => {
                            const updateTest = target.freeContent.map((test) => {
                              if (test.id === each.id) {
                                return {
                                  ...test,
                                  free_content: {
                                    ...test.free_content,
                                    content: event.target.value,
                                  },
                                };
                              }
                              return test;
                            });
                            setTarget({
                              ...target,
                              freeContent: [...updateTest],
                              changed: true,
                            });
                          }}
                        />
                      </Form.Item>
                    </div>
                    <Icon
                      name="delete"
                      color="danger"
                      size={28}
                      className="cursor-pointer"
                      onClick={() => handleDelete(each)}
                    />
                  </div>
                );
              }
            })}
            <Icon
              name="plus-circle"
              color={"primary"}
              size={21}
              className="cursor-pointer mt-4"
              onClick={() => {
                const newTestId = target.freeCount + 1;
                setTarget({
                  ...target,
                  freeContent: [
                    ...target.freeContent,
                    {
                      id: newTestId,
                      category_id: categoryId,
                      free_content: {
                        content: null,
                      },
                      type,
                      new: true,
                    },
                  ],
                  freeCount: newTestId,
                  changed: true,
                });
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(EditTest);
