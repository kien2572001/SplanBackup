import { Input, Popover } from "antd";
import React, { useContext } from "react";
import Icon from "../../Icon";
import NaiteiShaFilter from "./NaiteiShaFilter";
import { useState } from "react";
import KyoushiFilter from "./KyoushiFilter";
import KigyoutantoushaFilter from "./KigyoutantoushaFilter";
import { UserListContext } from "./index";

const UserSearch = ({ role }) => {
  const [visible, setVisible] = useState(false);
  const { name, setName } = useContext(UserListContext);

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };
  return (
    <div className="flex justify-between 2xl:justify-center">
      <div className="2xl:w-[680px] 2xl:h-[40px] w-full">
        <div className="rounded-2xl">
          <div className="grid justify-items-center">
            <div className="block items-center w-[100%]">
              <div className="flex items-center">
                <Input
                  className="my-4 mr-4 h-[35px]
                              border-[1px]  border-input-default rounded-[2px]
                              focus:outline-0 focus:border-[1px] focus:border-input-focus focus:shadow-input
                              "
                  placeholder="検索"
                  style={{ marginRight: "4px" }}
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                <Popover
                  content={
                    <div className="pt-4">
                      {role === "naiteisha" && (
                        <NaiteiShaFilter
                          handleVisibleChange={handleVisibleChange}
                        />
                      )}

                      {role === "teachers" && (
                        <KyoushiFilter
                          handleVisibleChange={handleVisibleChange}
                        />
                      )}

                      {role === "clients" && (
                        <KigyoutantoushaFilter
                          handleVisibleChange={handleVisibleChange}
                        />
                      )}
                    </div>
                  }
                  title={<h4>検索オプション</h4>}
                  trigger="click"
                  visible={visible}
                  placement="bottomRight"
                  onVisibleChange={handleVisibleChange}
                >
                  {role !== "mentor" && (
                    <div className="flex justify-center items-center">
                      <Icon name="filter cursor-pointer" size={32}></Icon>
                    </div>
                  )}
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
