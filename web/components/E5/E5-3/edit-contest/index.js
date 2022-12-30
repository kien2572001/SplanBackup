import { ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Upload } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import client from "~/api/client";
import Icon from "~/components/Icon";
import SettingLayout from "~/components/layout/SettingLayout";
import { showNotification } from "~/components/Notification";
import PageHeader from "~/components/PageHeader";
const { confirm } = Modal;


const EditContest = () => {
  const router = useRouter();
  const { contest_id: testId } = router.query;
  const [total, setTotal] = useState(0);
  const [testInfo, setTestInfo] = useState({
    id: testId,
    contestName: "",
    contestScoreEachs: [],
    image: "/images/contest-no-image.gif",
  });
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([]);
  const formRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await client.get(`contests/${testId}`).json();
      setTestInfo(data);
      if (data.contestScoreEachs.length == 0) {
        setTotal(data.totalScore);
      }
      formRef.current.setFieldsValue({
        totalScore: data.totalScore,
      });

      for (let index = 0; index < data.contestScoreEachs.length; index++) {
        formRef.current.setFieldsValue({
          [`itemName-${data.contestScoreEachs[index].id}`]:
            data.contestScoreEachs[index].name,
          [`itemScore-${data.contestScoreEachs[index].id}`]:
            data.contestScoreEachs[index].maxScore,
        });
      }

      setItems(
        data.contestScoreEachs.map((item) => ({
          itemName: item.name,
          itemScore: item.maxScore,
          id: item.id,
        }))
      );

      formRef.current.setFieldsValue({
        contestName: data.contestName,
        passScore: data.passScore,
      });
    };

    fetchData();
  }, [testId]);

  const handleChangeImage = ({ file, fileList: _fileList }) => {
    setFileList(_fileList);
    if (_fileList.length === 0) {
      setImage(testInfo.image);
      return;
    }
    setChanged(true);
    setImage(file.originFileObj);
  };
  const handleAddItem = () => {
    setTotal(0);
    const newItem = {
      id: Date.now(),
      itemName: "",
      itemScore: 0,
    };
    setItems([...items, newItem]);
    setChanged(true);
  };

  const handleDeleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    setChanged(true);
    if (newItems.length === 0) {
      setTotal(1);
    }
  };

  const handleSubmit = async (value) => {
    let newTestInfo = new FormData();
    newTestInfo.append("contestName", value.contestName);
    newTestInfo.append("passScore", value.passScore);
    newTestInfo.append("totalScore", value.totalScore);
    if (items.length !== 0) {
      newTestInfo.append("items", JSON.stringify(items));
      newTestInfo.set(
        "totalScore",
        items.reduce((p, c) => p + c.itemScore, 0)
      );
    }
    if (image instanceof File) {
      newTestInfo.append("image", image);
    } else {
      newTestInfo.append("image", testInfo.image);
    }

    try {
      const res = await client
        .post(`contests/${testId}?_method=PUT`, { body: newTestInfo })
        .json();
      router.push(`/settings/exams/${testId}`);
      showNotification({
        type: "success",
        title: "試験が編集されました。",
      });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleCancel = () => {
    if (!changed) {
      router.push(`/settings/exams/${testId}`);
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
        router.push(`/settings/exams/${testId}`);
      },
      onCancel() {
        return;
      },
    });
  };

  return (
    <SettingLayout>
      <div>
        <style>
          {`
        .ant-form-item-label {
          color: 
        }
        `}
        </style>
        <PageHeader
          type="edit"
          title="試験編集"
          onBackBtnClick={handleCancel}
        />
        <Form
          name="edit-test-form"
          ref={formRef}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 12,
            offset: 1,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
          autoComplete="off"
          className="edit-test-form w-full mt-6"
        >
          <Form.Item
            label={<h4 className="text-default font-medium">サムネイル</h4>}
          >
            <Upload
              accept="image/*"
              onChange={handleChangeImage}
              maxCount={1}
              showUploadList={false}
              fileList={fileList}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>

            {/*
              `image` là ảnh mới 
              `testInfo.image` là ảnh cũ (fetch từ database)
              == Ảnh nào được hiển thị? ==
              Nếu không có ảnh mới (`image = null`) thì sẽ hiển thị ảnh cũ
              Nếu có ảnh mới (`image` là 1 object) thì sẽ hiển thị ảnh mới
              == Xóa ảnh ==
              Nếu xóa ảnh mới (`image` = "") thì sẽ hiển thị ảnh cũ
              Nếu xóa ảnh cũ (`testInfo.image` = "") thì sẽ hiển thị ảnh mặc định (`image` = "/images/contest-no-image.png") 
            
            ==> ENG:
              image is new image
              testInfo.image is old image (fetch from database) 
              == Which image is shown? ==
              If there is no new image (`image = null`) then show old image
              If there is new image (`image` is an object) then show new image
              == Delete image ==
              If delete new image (`image` = "") then show old image
              If delete old image (`testInfo.image` = "") then show default image (`image` = "/images/contest-no-image.png")
          */}

            {image && typeof image === "object" && (
              <div className="mt-2 transition-all relative">
                <Image
                  src={URL.createObjectURL(image)}
                  width={160}
                  height={90}
                  objectFit="cover"
                  alt="#"
                />
                <div
                  className="w-40 h-[90px] bg-black bg-opacity-70 flex opacity-0 hover:opacity-100 transition-all justify-center items-center absolute left-0 top-0 cursor-pointer"
                  onClick={() => {
                    setImage(null);
                    setFileList([]);
                  }}
                >
                  <Icon name="delete" color="danger" size={18} />
                </div>
              </div>
            )}
            {!image && testInfo.image.length !== 0 && (
              <div className="mt-2 transition-all relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    (testInfo.image.startsWith("images/") ? `/` : "") +
                    testInfo.image
                  }
                  width={160}
                  height={90}
                  style={{ objectFit: "cover" }}
                  alt="#"
                />
                {testInfo.image !== "images/contest-no-image.gif" && (
                  <div
                    className="w-40 h-[90px] bg-black bg-opacity-70 flex opacity-0 hover:opacity-100 transition-all justify-center items-center absolute left-0 top-0 cursor-pointer"
                    onClick={() => {
                      setTestInfo({
                        ...testInfo,
                        image: "/images/contest-no-image.gif",
                      });
                    }}
                  >
                    <Icon name="delete" color="danger" size={18} />
                  </div>
                )}
              </div>
            )}
          </Form.Item>
          <Form.Item
            label={<h4 className="text-default font-medium">試験名</h4>}
            name="contestName"
            wrapperCol={{ span: 10, offset: 1 }}
            rules={[
              {
                required: true,
                message: "試験名を入力してください",
              },
            ]}
          >
            <Input
              placeholder="試験名を入力してください"
              onChange={() => setChanged(true)}
              maxLength={64}
            />
          </Form.Item>
          <Form.Item
            label={<h4 className="text-default font-medium">合格点</h4>}
            name="passScore"
            rules={[
              { required: true, message: "合格点を入力してください" },
              {
                message: "合格点は、総合得点以下でなければなりません",
                validator: (_, value) => {
                  if (
                    (items.length > 0 &&
                      items.reduce((p, c) => p + c.itemScore, 0) < value) ||
                    (items.length === 0 &&
                      formRef.current.getFieldValue("totalScore") &&
                      formRef.current.getFieldValue("totalScore") < value)
                  ) {
                    return Promise.reject("Some message here");
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <InputNumber min={0} onChange={() => setChanged(true)} />
          </Form.Item>

          {items.length === 0 || total !== 0 ? (
            <Form.Item
              label={<h4 className="text-default font-medium">総合得点</h4>}
              initialValue={total}
              value={total}
              name="totalScore"
              labelCol={{ offset: 12, span: 4 }}
              wrapperCol={8}
              rules={[
                {
                  required: true,
                  message: "総合得点を入力してください",
                },
              ]}
            >
              <InputNumber
                className="w-[88px]"
                style={{ marginLeft: "4%" }}
                onChange={() => {
                  setChanged(true);
                }}
              />
            </Form.Item>
          ) : (
            <Form.Item
              label={<h4 className="text-default font-medium">総合得点</h4>}
              labelCol={{ offset: 12, span: 4 }}
              wrapperCol={8}
            >
              <InputNumber
                className="w-[88px]"
                style={{ marginLeft: "4%" }}
                value={items.reduce((p, c) => p + c.itemScore, 0)}
                disabled
              />
            </Form.Item>
          )}
          {items.map((item, index) => (
            <div className="ant-row" key={item.id}>
              <Form.Item
                name={`itemName-${item.id}`}
                className="ant-col ant-col-8"
                style={{ marginLeft: "22.25%", display: "flex" }}
                wrapperCol={{ offset: 3 }}
                label={
                  <h4 className="text-default font-medium">
                    項目名{index + 1}
                  </h4>
                }
                rules={[
                  {
                    required: true,
                    message: "項目名を入力してください",
                  },
                ]}
                required
              >
                <Input
                  value={item.itemName}
                  placeholder="成分点"
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].itemName = e.target.value;
                    setItems(newItems);
                    setChanged(true);
                  }}
                  maxLength={64}
                />
              </Form.Item>
              <div className="ant-col ant-col-8 flex-nowrap relative">
                <Form.Item
                  name={`itemScore-${item.id}`}
                  label={<h4 className="text-default font-medium">点数</h4>}
                  key={item.id}
                  rules={[
                    {
                      required: true,
                      message: "点数を入力してください",
                    },
                  ]}
                  required
                >
                  <InputNumber
                    min={0}
                    value={item.itemScore}
                    placeholder="点数"
                    onChange={(value) => {
                      const newItems = [...items];
                      newItems[index].itemScore = value;
                      setItems(newItems);
                      setChanged(true);
                    }}
                  />
                </Form.Item>
                <div
                  className="absolute top-[6px]"
                  style={{ left: "calc(138px + 33%) " }}
                >
                  <Icon
                    className="cursor-pointer"
                    name="delete"
                    color="danger"
                    size={18}
                    onClick={() => handleDeleteItem(index)}
                  />
                </div>
              </div>
            </div>
          ))}
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button
              type="link"
              onClick={handleAddItem}
              className="text-lg font-bold text-primary"
            >
              +項目を追加する
            </Button>
          </Form.Item>

          <div className="ant-row gap-3">
            <Button onClick={handleCancel} className="ant-col-offset-15">
              キャンセル
            </Button>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </SettingLayout>
  );
};

export default EditContest;
