import moment from "moment";
import { useEffect, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { DatePicker, Form, Button, Modal } from "antd";
import NaiteishaTopLayout from "~/components/layout/NaiteishaTopLayout";
import { showNotification } from "~/components/Notification";
import Loading from "~/components/C3/Loading";
import { getMilestoneById } from "~/utils/C3/plan";
import { useRouter } from "next/router";
import PageHeader from "~/components/PageHeader";
import EditTest from "./EditTest";
import ky from "~/api/ky";

const msg = {
  errorNullInput: "この項目は必須です",
  saveSuccess: "保存完了しました",
  cancelTitle: "変更内容が保存されません。",
  saveError: "保存できませんでした",
  cancelContent: "よろしいですか？",
};

const EditTarget = ({ userData }) => {
  const router = useRouter();
  const { confirm } = Modal;
  const milestoneId = parseInt(router.query.milestone_id);
  const [isLoading, setIsLoading] = useState(false);
  const [target, setTarget] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getMilestoneById(milestoneId);
        if (!data) {
          router.push("/404");
          return;
        }

        const testContent = data.target.target_details.filter(
          (each) => each.type === 0
        );
        const freeContent = data.target.target_details.filter(
          (each) => each.type === 1
        );
        setTarget({
          targetId: data.target.id,
          currentDate: data.target.date_of_target,
          testContent,
          freeContent,
          changed: false,
          isNewUpdate: data.target.created_at === data.target.updated_at,
        });
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [milestoneId, router]);

  const handleSubmit = async () => {
    try {
      await ky
        .put(`/api/targets/${target.targetId}`, {
          json: {
            target: {
              id: target.targetId,
              target_details: [...target.testContent, ...target.freeContent],
            },
          },
        })
        .json();
      console.log([...target.testContent, ...target.freeContent]);
      showNotification({
        type: "success",
        title: msg.saveSuccess,
        description: "",
      });
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = () => {
    if (!target?.changed) {
      router.back();
      return;
    }

    confirm({
      title: "変更内容が保存されません。",
      centered: true,
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

  return (
    <NaiteishaTopLayout userInfo={userData} active={"学習目標"}>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full overflow-y-scroll py-1">
          <div className="bg-white rounded-2xl shadow-md py-8 px-12">
            <PageHeader
              type="create"
              title={target?.isNewUpdate ? "実績登録" : "実績編集"}
              onBackBtnClick={handleBack}
            />

            <div className="px-8">
              <div className="flex justify-center items-center gap-4 mb-8">
                <p className="m-0 text-default text-2xl">マイルストーン :</p>
                {/* <span className="m-0 text-default text-2xl">
                  {moment(target.currentDate).format("YYYY/MM")}
                </span> */}
                <DatePicker
                  className="w-60"
                  mode="month"
                  picker="month"
                  labelAlign="right"
                  placeholder= {moment(target.currentDate).format("YYYY/MM")}
                  disabled
                />
              </div>

              <Form
                onFinish={handleSubmit}
                initialValues={{
                  remember: true,
                }}
                scrollToFirstError
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="m-0 text-default text-3xl font-bold">
                    学習目標 :
                  </p>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!target?.changed}
                  >
                    保存
                  </Button>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="border-solid border-[0.5px] border-gray-300 p-8">
                    <p className="text-4xl text-default font-bold mb-8">試験</p>
                    <div className="flex flex-col px-10 gap-8">
                      <EditTest
                        title="言語"
                        targetDetail={target.testContent?.filter(
                          (each) => each.category_id === 5 && !each.delete
                        )}
                        categoryId={5}
                        target={target}
                        setTarget={setTarget}
                        type={0}
                        listOption={target.gengoList}
                      />
                      <EditTest
                        title="IT知識・技術"
                        targetDetail={target.testContent?.filter(
                          (each) => each.category_id === 3 && !each.delete
                        )}
                        categoryId={3}
                        target={target}
                        setTarget={setTarget}
                        type={0}
                        listOption={target.itList}
                      />
                    </div>
                  </div>

                  <div className="border-solid border-[0.5px] border-gray-300 p-8">
                    <p className="text-4xl text-default font-bold mb-4">
                      その他
                    </p>
                    <EditTest
                      categoryId={4}
                      target={target}
                      setTarget={setTarget}
                      type={1}
                      targetDetail={target.freeContent}
                    />
                  </div>
                  <div className="self-end">
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={!target?.changed}
                    >
                      保存
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      )}
    </NaiteishaTopLayout>
  );
};

export default EditTarget;
