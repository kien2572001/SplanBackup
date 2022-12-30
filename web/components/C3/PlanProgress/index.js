import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Progress, Select, Modal, InputNumber, Form } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ky from "ky";
import client from "~/api/client";
import Item from "./Item";
import Icon from "~/components/Icon";
import { getAllDocs } from "~/utils/document";
import { getAllCategories } from "~/utils/category";
import Button from "~/components/Button";
import DefaultThumbnail from "~/assets/images/default_test_avatar.gif";
import { showNotification } from "~/components/Notification";
import SearchBar from "~/components/SearchBar";
import NoData from "~/components/NoData";
import moment from "moment";
const errorMessage = {
  emptyError: "この項目は必須です。",
};

export default function PlanProgress({
  type,
  editIcon,
  planData,
  isTrueNaiteisha,
  target_details,
}) {
  const router = useRouter();
  const { Option } = Select;
  const [changed, setChanged] = useState(false);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [currentOpenDoc, setCurrentOpenDoc] = useState({});
  const [formData, setFormData] = useState(planData?.plan?.plan_details);
  const [showError, setShowError] = useState(null);
  const [addAmount, setAddAmount] = useState(undefined);
  const [search, setSearch] = useState({
    name: "",
    category_id: "",
  });
  const [docs, setDocs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();
  const filteringTimeout = useRef(null);

  const handleOpenModal = (doc) => {
    setCurrentOpenDoc({ ...doc });
    setOpen(true);
  };

  const handleBack = () => {
    if (changed) {
      Modal.confirm({
        title: "編集した内容が保存されていません。",
        centered: true,
        icon: <ExclamationCircleOutlined />,
        content: "キャンセルしますか?",
        okText: "はい",
        cancelText: "いいえ",

        onOk() {
          router.back();
        },
      });
    } else {
      router.back();
    }
  };

  const handleAdd = () => {
    setFormData([
      ...formData,
      {
        document: currentOpenDoc,
        doc_id: currentOpenDoc.id,
        expected_amount: currentOpenDoc.limit,
        real_amount: addAmount,
        plan_id: planData?.plan.id,
        new: true,
      },
    ]);
    setAddAmount(undefined);
    setOpen(false);
    setChanged(true);
  };

  const handleSubmit = async () => {
    setShowError(null);
    const error = formData.find((each) => each.real_amount === null);
    let newPost = {
      user_id: parseInt(JSON.parse(localStorage.getItem("currentUser")).id),
      content: moment(planData?.target?.date_of_target).format("YYYY/MM"),
      plan_id: planData.plan.id,
    };
    if (error) {
      setShowError(error.doc_id);
    } else {
      if (changed) {
        try {
          //Tao post type 3
          let total = 0;
          formData.forEach((data) => {
            total += Math.round(
              (data.real_amount / data.expected_amount) * 100
            );
          });
          total = Math.round(total / formData.length);
          await client.post("post/create-type-3", {
            json: {
              date_of_target: planData?.target?.date_of_target,
              process: total,
            },
          });

          const res = await client.post("plan/edit", {
            json: {
              plan: {
                plan_details: formData,
              },
            },
          });
          let res2 = await ky
            .post(`/api/posts/createtype2-post/`, {
              json: newPost,
            })
            .json();
          if (res) {
            showNotification({
              type: "success",
              title: "保存完了しました。",
            });
            router.back();
          }
        } catch (error) {
          console.log("Edit error: ", error);
        }
      } else {
        router.back();
      }
    }
  };
  const handleSelectedFilter = (values) => {
    setSearch({ ...search, category_id: values.category });
  };
  useEffect(() => {
    const getDocs = async () => {
      const res = await getAllDocs();

      if (res.success) {
        setDocs(res.data.data);
      }
    };
    const getAllFilterFields = async () => {
      const categoryRes = await getAllCategories();

      if (categoryRes.success) {
        setCategories([...categoryRes.data]);
      }
    };

    getDocs();
    getAllFilterFields();
  }, []);

  useEffect(() => {
    const handleSetData = () => {
      let total = 0;
      planData?.plan_details?.map(
        (data) =>
          (total += Math.round((data.real_amount / data.expected_amount) * 100))
      );
      total = Math.round(total / planData?.plan_details?.length);
      setProgress(total);
      setFormData(planData?.plan?.plan_details);
    };

    handleSetData();
  }, [planData]);

  useEffect(() => {
    const getDocBySearch = async () => {
      try {
        const res = await ky
          .get(
            `/api/document/get-by-search?
					${search.name && `name=${search.name}`}&
					${search.category_id && `category_id=${search.category_id}`}`
          )
          .json();
        if (res.success) {
          setDocs(res.data.data);
        }
      } catch (error) {}
    };
    if (filteringTimeout.current) {
      clearTimeout(filteringTimeout.current);
    }
    filteringTimeout.current = setTimeout(() => {
      getDocBySearch();
    }, 500);
  }, [search]);

  return (
    <>
      {type === "edit" ? (
        <div className="flex flex-col justify-center items-center gap-16">
          {formData?.length !== 0 && (
            <div className="grid grid-cols-6 auto-rows-auto gap-y-4 font-bold w-full">
              <h3 className="col-span-3 text-2xl">教材名</h3>
              <h3 className="col-span-2 text-2xl">
                計画
                <span className="text-danger"> *</span>
              </h3>
              <div className="row-start-2 col-span-full flex flex-col gap-3 max-h-[240px] overflow-y-scroll">
                {formData?.map(
                  (data, index) =>
                    !data.delete && (
                      <div key={index}>
                        <Item
                          type={type}
                          planData={data}
                          formData={formData}
                          errorMessage={
                            showError == data.doc_id && errorMessage.emptyError
                          }
                          setFormData={setFormData}
                          setChanged={setChanged}
                        />
                      </div>
                    )
                )}
              </div>
            </div>
          )}
          <div className="w-1/2">
            <SearchBar
              placeholder="検索"
              showFilter={true}
              handleSearch={(e) =>
                setSearch({ ...search, name: e.target.value })
              }
              name={search.name}
              visibleFilter={visibleFilter}
              handleVisibleFilter={(newVisible) => setVisibleFilter(newVisible)}
            >
              <Form
                name="basic"
                form={form}
                autoComplete="off"
                onFinish={handleSelectedFilter}
                initialValues={{
                  category: "",
                }}
              >
                <div className="flex flex-col gap-4 mt-3">
                  <div className="flex items-center px-2">
                    <span className="text-default pr-5 w-20 text-right">
                      カテゴリ
                    </span>
                    <Form.Item className="mb-0" name="category">
                      <Select style={{ width: 148 }} className="text-default">
                        <Option value="" className="text-default">
                          ALL
                        </Option>
                        {categories.map((category) => (
                          <Option
                            value={category.id}
                            key={category.id}
                            className="text-default"
                          >
                            {category.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="px-2 flex justify-end">
                    <Form.Item className="mb-0 mr-4">
                      <Button
                        onClick={() => {
                          form.resetFields();
                          setVisibleFilter(false);
                        }}
                      >
                        リセット
                      </Button>
                    </Form.Item>
                    <Form.Item className="mb-0">
                      <Button
                        type="fill"
                        htmlType="submit"
                        onClick={() => setVisibleFilter(false)}
                      >
                        検索
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </SearchBar>
          </div>
          <div className="grid grid-cols-6 auto-rows-auto gap-y-4 font-bold w-full">
            <div className="col-span-full">
              <h3 className="text-2xl text-default">教材一覧</h3>
            </div>
            {docs.length !== 0 && (
              <div className="row-start-2 col-span-full grid grid-cols-6">
                <h3 className="col-start-2 col-span-2 text-primary">
                  教材名・学習内容
                </h3>
                <h3 className="col-span-1 text-primary">カテゴリ</h3>
                <h3 className="col-span-2 justify-self-center text-primary">
                  最大実施内容
                </h3>
              </div>
            )}
            <div className="row-start-3 col-span-full flex flex-col gap-4 h-[400px] overflow-y-scroll">
              {docs.length !== 0 ? (
                docs?.map((doc, index) => {
                  const thumbnail = doc.images?.find(
                    (image) => image.is_thumbnail === 1
                  );
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-6 items-center cursor-pointer hover:bg-slate-100"
                      onClick={() => handleOpenModal(doc)}
                      style={{
                        display: formData?.find(
                          (each) => each.doc_id === doc.id
                        )
                          ? "none"
                          : "",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt="thumbnail"
                        src={thumbnail?.img_link || DefaultThumbnail.src}
                        className="object-cover justify-self-center w-[80px] h-[80px]"
                      />
                      <h4 className="col-start-2 col-span-2">{doc.doc_name}</h4>
                      <h4 className="col-span-1">{doc.category}</h4>
                      <h4 className="col-span-2 justify-self-center">
                        {doc.limit} {doc.unit?.name}
                      </h4>
                    </div>
                  );
                })
              ) : (
                <NoData size="small" />
              )}
            </div>
            <Modal
              centered
              width={400}
              visible={open}
              okText="追加"
              cancelText="キャンセル"
              onOk={handleAdd}
              onCancel={() => {
                setOpen(false);
                setAddAmount(null);
              }}
            >
              <div className="text-default text-center">
                <p className="text-3xl">{currentOpenDoc?.doc_name}</p>
                <div className="flex justify-center items-center gap-4 mt-4">
                  <div className="flex flex-col justify-center items-center gap-2">
                    <label className="text-2xl" htmlFor="plan">
                      計画
                    </label>
                    <InputNumber
                      id="plan"
                      className="text-xl text-default w-[80px]"
                      placeholder="0"
                      defaultValue={undefined}
                      value={addAmount}
                      min={0}
                      max={currentOpenDoc?.limit}
                      onChange={(value) => setAddAmount(value)}
                    />
                  </div>
                  <div className="flex flex-col justify-center items-center gap-2">
                    <label className="text-2xl" htmlFor="plan">
                      最大
                    </label>
                    <p className="text-xl m-0 h-[37px] mt-1">
                      /{currentOpenDoc?.limit}
                      {currentOpenDoc?.unit?.name}
                    </p>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
          <div className="flex justify-center items-center gap-2 self-end mt-8">
            <Button onClick={handleBack}>キャンセル</Button>
            <Button
              type="fill"
              htmlType="submit"
              onClick={() => handleSubmit()}
            >
              保存
            </Button>
          </div>
        </div>
      ) : (
        <div className=" container relative w-full">
          <div className="grid grid-cols-6 mb-5 w-full">
            <div className="col-start-1 col-span-3 justify-self-center self-center ">
              <span className="text-4xl font-bold">計画進捗</span>
            </div>
            {editIcon &&
              isTrueNaiteisha &&
              (target_details?.length !== 0 ? (
                <div className="col-start-5">
                  <Link
                    href={`/naitei/${router.query.naitei_id}/milestones/${router.query.milestone_id}/plans/edit`}
                  >
                    <div className="cursor-pointer h-[20px] w-[20px] float-right">
                      <Icon name="pencil-squared" color="primary" size={20} />
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="col-start-5">
                  <div className="cursor-pointer h-[20px] w-[20px] float-right">
                    <Icon name="pencil-squared" color="disabled" size={20} />
                  </div>
                </div>
              ))}
          </div>

          <div className="grid grid-cols-6 ">
            <div className="col-start-1 col-span-3 justify-self-center self-center">
              <Progress
                strokeLinecap="butt"
                type="circle"
                percent={progress}
                trailColor="#CFD8DC"
                strokeColor="#224656"
                strokeWidth={10}
                width={180}
              />
            </div>
            <div className="col-span-2 flex flex-col justify-center pl-2">
              {planData?.plan_details?.map((data, index) => (
                <Item
                  key={index}
                  planData={data}
                  unit={data.document.unit.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
