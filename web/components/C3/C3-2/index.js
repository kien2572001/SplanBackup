import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Modal, Spin } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import client from "~/api/client";
import Icon from "~/components/Icon";
import NaiteishaTopLayout from "~/components/layout/NaiteishaTopLayout";
import { showNotification } from "~/components/Notification";
import PageHeader from "~/components/PageHeader";
import ContestTarget from "./ContestTarget";

const { confirm } = Modal;

const CreateTarget = ({ userData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [targets, setTargets] = useState([]);
  const [dateOfTarget, setDateOfTarget] = useState("");
  const [dateOfTargetsFromAPI, setDateOfTargetsFromAPI] = useState([]);
  const [reGetDateOfTargets, setReGetDateOfTargets] = useState(false);
  const [form] = Form.useForm();
  const ref = useRef(0);

  const handleAddContestTarget = (category) => {
    const newTarget =
      category === "言語"
        ? {
            id: ref.current++,
            category: "言語",
            exam_date: "",
            type: 0,
            contest_name: "",
            score_eaches: [],
          }
        : {
            id: ref.current++,
            category: "IT知識・技術",
            exam_date: "",
            type: 0,
            contest_name: "",
            score_eaches: [],
          };
    setTargets([...targets, newTarget]);
  };

  const handleAddFreeContentTarget = () => {
    const newTarget = {
      id: ref.current++,
      category: "その他",
      type: 1,
      content: "",
    };
    setTargets([...targets, newTarget]);
  };

  const handleDeleteTarget = (id) => {
    confirm({
      title: "削除してもよろしいですか?",
      icon: <ExclamationCircleOutlined />,
      content: "削除後に復元できません。",
      cancelText: <span>キャンセル</span>,
      okText: <span>削除</span>,
      onOk() {
        const newTargets = targets.filter((target) => target.id !== id);
        setTargets(newTargets);
      },

      onCancel() {
        console.log("Cancel");
      },
      centered: true,
    });
  };

  const handleEditTarget = (id, target) => {
    const newTargets = [...targets];
    const index = newTargets.indexOf(
      newTargets.find((target) => {
        return target.id === id;
      })
    );
    newTargets[index] = target;
    setTargets(newTargets);
  };

  const handleEditFreeContent = (freeContentTarget, freeContent) => {
    const newFreeContentTarget = { ...freeContentTarget };
    newFreeContentTarget.content = freeContent;
    handleEditTarget(newFreeContentTarget.id, newFreeContentTarget);
  };

  const onFinish = async (values) => {
    const newTarget = {
      date_of_target: dateOfTarget,
      targets,
    };
    try {
      const res = await client.post("targets", { json: newTarget }).json();
      if (res && res.success) {
        form.resetFields();
        setReGetDateOfTargets((state) => !state);
        setTargets([]);
        setDateOfTarget("");
        ref.current = 0;
        showNotification({
          type: "success",
          title: "目標が正常に作成されました",
        });
      } else {
        showNotification({
          type: "error",
          title: "新しい目標が失敗しました",
        });
      }
    } catch (error) {
      showNotification({
        type: "error",
        title: "新しい目標が失敗しました",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleBack = () => {
    if (targets.length === 0 && !dateOfTarget) {
      router.back();
      return;
    }

    confirm({
      title: "変更内容が保存されません。",
      style: { top: 250 },
      destroyOnClose: true,
      icon: <ExclamationCircleOutlined />,
      content: "よろしいですか？",
      okText: "はい",
      cancelText: "いいえ",
      onOk() {
        router.back();
      },
      onCancel() {
        return;
      },
    });
  };

  useEffect(() => {
    const callAPI = async () => {
      try {
        setLoading(true);
        const userId = Number(
          JSON.parse(localStorage.getItem("currentUser")).id
        );
        let dateOfTargetRes = await client
          .get(`targets/date-of-target/${userId}`)
          .json();
        if (!dateOfTargetRes.data) {
          router.push("/");
        } else {
          setDateOfTargetsFromAPI(dateOfTargetRes.data);
        }
      } catch (err) {
        setDateOfTargetsFromAPI([]);
      } finally {
        setLoading(false);
      }
    };
    callAPI();
  }, [reGetDateOfTargets, router]);

  return (
    <NaiteishaTopLayout userInfo={userData} active={"学習目標"}>
      <div className="w-full h-full bg-white mt-2 p-8 overflow-y-scroll rounded-2xl">
        <PageHeader
          type="create"
          title="目標新規登録"
          onBackBtnClick={handleBack}
        />
        <Form
          name="basic"
          form={form}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="edit-test-form"
        >
          <div className="flex w-full justify-center">
            <Form.Item
              label={
                <h4 className="text-default font-medium">マイルストーン</h4>
              }
              name="dateOfTarget"
              wrapperCol={{ span: 10, offset: 1 }}
              validateStatus={
                targets.length > 0 && !dateOfTarget ? "error" : undefined
              }
              help={
                targets.length > 0 && !dateOfTarget
                  ? "この項目は必須です"
                  : undefined
              }
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
                className="w-60"
                disabledDate={(current) => {
                  return (
                    (current && current < moment().subtract(1, "days")) ||
                    dateOfTargetsFromAPI.find(
                      (dateOfTarget) =>
                        moment(dateOfTarget.dateOfTarget).format("YYYY-MM") ===
                        moment(current._d).format("YYYY-MM")
                    )
                  );
                }}
                mode="month"
                picker="month"
                labelAlign="right"
                placeholder="マイルストーン"
                onChange={(date, dateString) =>
                  setDateOfTarget(dateString + "-01")
                }
              />
            </Form.Item>
          </div>
          <div className="flex justify-between mt-3">
            <h4 className="text-xl text-default font-bold">学習目標:</h4>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={!dateOfTarget}>
                作成
              </Button>
            </Form.Item>
          </div>

          <div
            className="flex mt-3 py-9 px-8 flex-col"
            style={{ border: "1px solid rgba(0, 0, 0, 0.25)" }}
          >
            <h4 className="text-2xl text-default font-bold">試験</h4>
            <div className="flex py-7 px-12 flex-col">
              <div>
                <h5 className="text-xl text-default font-bold">言語</h5>
                <div className="flex justify-center px-28 w-full flex-col">
                  <div>
                    {targets
                      .filter((target) => target.category === "言語")
                      .map((target, index) =>
                        index > 0 ? (
                          <div
                            style={{
                              borderTop: "1px solid rgba(0, 0, 0, 0.25)",
                            }}
                            key={target.id}
                          >
                            <ContestTarget
                              target={target}
                              handleDeleteTarget={handleDeleteTarget}
                              handleEditTarget={handleEditTarget}
                              dateOfTarget={dateOfTarget}
                            />
                          </div>
                        ) : (
                          <ContestTarget
                            target={target}
                            key={target.id}
                            handleDeleteTarget={handleDeleteTarget}
                            handleEditTarget={handleEditTarget}
                            dateOfTarget={dateOfTarget}
                          />
                        )
                      )}
                  </div>

                  <div className="flex justify-start px-28 w-full">
                    <Icon
                      style={{
                        borderTop: "1px solid rgba(0, 0, 0, 0.25)",
                      }}
                      name="plus-circle"
                      color={"primary"}
                      size={16}
                      onClick={() => handleAddContestTarget("言語")}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h5 className="text-xl text-default font-bold">IT知識・技術</h5>
                <div className="flex justify-center px-28 w-full flex-col">
                  <div>
                    {targets
                      .filter((target) => target.category === "IT知識・技術")
                      .map((target, index) =>
                        index > 0 ? (
                          <div
                            style={{
                              borderTop: "1px solid rgba(0, 0, 0, 0.25)",
                            }}
                            key={target.id}
                          >
                            <ContestTarget
                              target={target}
                              handleDeleteTarget={handleDeleteTarget}
                              handleEditTarget={handleEditTarget}
                              dateOfTarget={dateOfTarget}
                            />
                          </div>
                        ) : (
                          <ContestTarget
                            target={target}
                            key={target.id}
                            handleDeleteTarget={handleDeleteTarget}
                            handleEditTarget={handleEditTarget}
                            dateOfTarget={dateOfTarget}
                          />
                        )
                      )}
                  </div>
                  <div className="flex justify-start px-28 w-ful">
                    <Icon
                      name="plus-circle"
                      color={"primary"}
                      size={16}
                      onClick={() => handleAddContestTarget("IT知識・技術")}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex mt-3 py-9 px-8 flex-col"
            style={{ border: "1px solid rgba(0, 0, 0, 0.25)" }}
          >
            <h4 className="text-2xl text-default font-bold">その他</h4>
            <div className="flex flex-col items-center">
              <div className="w-full px-28">
                {targets.map(
                  (target) =>
                    target.category === "その他" && (
                      <div className="flex w-full items-center" key={target.id}>
                        <div className="flex-1">
                          <Form.Item
                            name={`content${target.id}`}
                            className="m-0"
                            rules={[
                              {
                                required: true,
                                message: "この項目は必須です",
                              },
                            ]}
                          >
                            <Input
                              onChange={(e) =>
                                handleEditFreeContent(target, e.target.value)
                              }
                              placeholder="目標を入力してください"
                              maxLength={250}
                            />
                          </Form.Item>
                        </div>
                        <div className="justify-end items-center flex ">
                          {" "}
                          <Icon
                            className="cursor-pointer mb-6 mx-4"
                            name="delete"
                            color="danger"
                            size={18}
                            onClick={() => {
                              handleDeleteTarget(target.id);
                            }}
                          />
                        </div>
                      </div>
                    )
                )}
                <Icon
                  name="plus-circle"
                  color={"primary"}
                  size={16}
                  onClick={handleAddFreeContentTarget}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={!dateOfTarget}>
                作成
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
      {loading && (
        <div
          className={
            "loading flex flex-col gap-3 justify-center items-center w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-60 z-[999] "
          }
        >
          <style>
            {`
              .loading .ant-spin-text {
                color: #fff;
              }
              .loading .ant-spin-dot-item {
                background-color: white;
              }
            `}
          </style>
          <Spin size="large" />
          <div className="text-white text-lg"> 読み込んでいます... </div>
        </div>
      )}
    </NaiteishaTopLayout>
  );
};

export default CreateTarget;
