import React, { useState } from "react";
import { Divider, Form, Modal, Checkbox } from "antd";
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
                {!targetDetail.length == index && <Divider />}
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
            ) : (<div></div>
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
                  <Form.Item
                    key={`free-content-${each.id}-${index}`}
                    name={`free-content-${each.id}`}
                    initialValue={each?.free_content?.content}
                  >
                    <div className="flex justify-start items-center gap-2">
                      <Checkbox
                      className="" 
                      defaultChecked={each?.free_content?.result}
                      onChange={(event) => {
                        const updateTest = target.freeContent.map((test) => {
                          if (test.id === each.id) {
                            if(event.target.checked) {
                              return {
                                ...test,
                                free_content: {
                                  ...test.free_content,
                                  result: "done",
                                },
                              };
                            } else {
                              return {
                                ...test,
                                free_content: {
                                  ...test.free_content,
                                  result: null,
                                },
                              };
                            }
                            
                          }
                          return test;
                        });
                        setTarget({
                          ...target,
                          freeContent: [...updateTest],
                          changed: true,
                        });
                      }}
                      ><span className="text-base text-default">{each?.free_content?.content}</span>
                      </Checkbox>
                    </div>
                  </Form.Item>
                );
              }
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(EditTest);
