import { ExclamationCircleOutlined } from "@ant-design/icons";
import { DatePicker, Input, Modal, Select, Spin, Upload } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import client from "~/api/client";
import Button from "~/components/Button";
import EachInput from "~/components/E1/E1-2/EachInput";
import Icon from "~/components/Icon";
import SettingLayout from "~/components/layout/SettingLayout";
import { showNotification } from "~/components/Notification";
import PageHeader from "~/components/PageHeader";
import UserRole from "~/Enums/UserRole";

const errorMessage = {
  emptyError: "この項目は必須です。",
  invaildEmail: "有効なメールアドレスを入力してください。",
  takenEmail: "メールはすでに使用されています。",
};

const EditUser = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [defaultData, setDefaultData] = useState({});
  const [universityData, setUniversityData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [changed, setChanged] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { ...userData },
  });

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

  const handleChangeImage = ({ file, fileList }) => {
    if (fileList.length === 0) {
      setUserData({ ...userData, avatar: "images/user-no-image.png" });
      return;
    }
    setUserData({ ...userData, avatar: file.originFileObj });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    if (changed) {
      try {
        data.avatar = userData.avatar;
        data.role = userData.role;
        const submitData = new FormData();
        if (userData.role == UserRole.NAITEISHA) {
          if (typeof data.graduation_date !== typeof "") {
            data.graduation_date = data.graduation_date.format("YYYY-MM-DD");
          }
          if (typeof data.receive_naitei_date !== typeof "") {
            data.receive_naitei_date =
              data.receive_naitei_date.format("YYYY-MM-DD");
          }
          submitData.append("userId", userId);
          submitData.append("vietnamese_fullname", data.vietnamese_fullname);
          submitData.append("japanese_fullname", data.japanese_fullname);
          submitData.append("email", data.email);
          submitData.append("avatar", data.avatar);
          submitData.append("role", data.role);
          submitData.append("university_id", data.university_id);
          submitData.append("grade_code", data.grade_code);
          submitData.append("company_id", data.company_id);
          submitData.append("graduation_date", data.graduation_date);
          submitData.append("receive_naitei_date", data.receive_naitei_date);
          await client
            .post(`users/${userId}`, {
              body: submitData,
            })
            .json();
        }
        if (userData.role == UserRole.TEACHER) {
          submitData.append("vietnamese_fullname", data.vietnamese_fullname);
          submitData.append("japanese_fullname", data.japanese_fullname);
          submitData.append("email", data.email);
          submitData.append("avatar", userData.avatar);
          submitData.append("role", data.role);
          submitData.append("university_id", data.university_id);
          await client
            .post(`users/${userId}`, {
              body: submitData,
            })
            .json();
        }
        if (userData.role == UserRole.CLIENT) {
          submitData.append("vietnamese_fullname", data.vietnamese_fullname);
          submitData.append("japanese_fullname", data.japanese_fullname);
          submitData.append("email", data.email);
          submitData.append("avatar", data.avatar);
          submitData.append("role", data.role);
          submitData.append("company_id", data.company_id);
          await client
            .post(`users/${userId}`, {
              body: submitData,
            })
            .json();
        }
        if (userData.role == UserRole.MENTOR) {
          submitData.append("vietnamese_fullname", data.vietnamese_fullname);
          submitData.append("japanese_fullname", data.japanese_fullname);
          submitData.append("email", data.email);
          submitData.append("avatar", data.avatar);
          submitData.append("role", data.role);
          await client
            .post(`users/${userId}`, {
              body: submitData,
            })
            .json();
        }
        showNotification({
          type: "success",
          title: "ユーザが編集されました。",
        });
        router.back();
      } catch (error) {
        console.log("Submit failed: ", error);
      }
    } else {
      router.back();
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await client.get(`users/${userId}`).json();
        const res2 = await client.get("users/get-inf").json();
        if (res.success) {
          setValue("avatar", res.data.avatar);
          setUserData(res.data);
          setDefaultData(res.data);
          setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
        } else {
          router.push(`/404`);
        }
        if (res2.success) {
          setUniversityData(res2.universities);
          setCompanyData(res2.companies);
        }
      } catch (error) {
        console.log("Fetching error: ", error);
      }
      setLoading(false);
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    const handleCheck = () => {
      if (
        userData?.vietnamese_fullname !== defaultData?.vietnamese_fullname ||
        userData?.japanese_fullname !== defaultData?.japanese_fullname ||
        userData?.email !== defaultData?.email ||
        userData?.avatar !== defaultData?.avatar ||
        userData?.university_id !== defaultData?.university_id ||
        userData?.grade_code !== defaultData?.grade_code ||
        userData?.company_id !== defaultData?.company_id ||
        userData?.graduation_date !== defaultData?.graduation_date ||
        userData?.receive_naitei_date !== defaultData?.receive_naitei_date
      ) {
        setChanged(true);
      } else {
        setChanged(false);
      }
    };

    handleCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <SettingLayout>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <PageHeader
            type="edit"
            title="ユーザー編集"
            onBackBtnClick={handleBack}
          />
          <form
            className="flex flex-col justify-center items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div
              className="flex flex-col xl:flex-row justify-center items-center w-full lg:w-8/12 xl:w-11/12
            xl:justify-start xl:items-start xl:gap-x-[144px] 2xl:w-9/12"
            >
              <div className="flex flex-col justify-center items-center gap-4">
                {userData?.avatar ? (
                  <div className="rounded-full w-24 h-24 sm:w-[133px] sm:h-[133px] transition-all relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        typeof userData.avatar === "object"
                          ? URL.createObjectURL(userData.avatar)
                          : (userData.avatar.startsWith("images/") ? `/` : "") +
                            userData.avatar
                      }
                      className="rounded-full object-cover w-24 h-24 sm:w-[133px] sm:h-[133px]"
                      alt=""
                    />
                    <div
                      className="rounded-full w-24 h-24 sm:w-[133px] sm:h-[133px] bg-black bg-opacity-70 
                      flex opacity-0 hover:opacity-100 transition-all justify-center items-center 
                      absolute left-0 top-0 cursor-pointer"
                      onClick={() => setUserData({ ...userData, avatar: null })}
                    >
                      <Icon name="delete" color="danger" size={18} />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-full w-24 h-24 sm:w-[133px] sm:h-[133px] transition-all relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/user-no-image.png"
                      className="rounded-full object-cover w-24 h-24 sm:w-[133px] sm:h-[133px]"
                      alt=""
                    />
                  </div>
                )}
                <Upload
                  accept="image/*"
                  onChange={handleChangeImage}
                  maxCount={1}
                  showUploadList={false}
                >
                  <Button className="rounded" type="fill" htmlType="button">
                    <span className="text-sm block w-[128px]"> 画像アップロード</span>
                  </Button>
                </Upload>
              </div>
              <div className="mt-8 w-full grid grid-cols-1 gap-y-6">
                <div className="grid grid-cols-1 gap-y-5 grow w-full">
                  <div>
                    <EachInput
                      title="名前"
                      errorMessage={
                        errors.vietnamese_fullname?.type === "required" &&
                        errorMessage.emptyError
                      }
                      content={
                        <div className="flex items-center gap-x-1 lg:gap-x-4">
                          <Input
                            id="vietnamese_fullname"
                            size="large"
                            className="font-normal  text-default sm:basis-3/4"
                            placeholder="名前"
                            defaultValue={setValue(
                              "vietnamese_fullname",
                              userData.vietnamese_fullname
                            )}
                            value={userData.vietnamese_fullname}
                            maxLength={64}
                            status={errors.vietnamese_fullname && "error"}
                            {...register("vietnamese_fullname", {
                              required: true,
                            })}
                            onChange={(event) => {
                              setValue(
                                "vietnamese_fullname",
                                event.target.value
                              );
                              setUserData({
                                ...userData,
                                vietnamese_fullname: event.target.value,
                              });
                            }}
                          />
                          {currentUser?.role == UserRole.MENTOR && (
                            <Select
                              id="role"
                              size="large"
                              className="font-normal  text-default w-full basis-1/4 hidden
                              sm:block"
                              defaultValue={setValue("role", userData.role)}
                              value={userData.role}
                              {...register("role")}
                              onChange={(value) => {
                                setValue("role", value);
                                setUserData({ ...userData, role: value });
                              }}
                            >
                              <Option value={1} className="text-default">
                                内定者
                              </Option>
                              <Option value={3} className="text-default">
                                教師
                              </Option>
                              <Option value={4} className="text-default">
                                企業担当者
                              </Option>
                            </Select>
                          )}
                          {currentUser?.role == "0" && (
                            <Select
                              id="role"
                              size="large"
                              className="font-normal text-default w-full hidden
                              sm:block"
                              defaultValue={setValue("role", userData.role)}
                              value={userData.role}
                              disabled={true}
                            >
                              <Option value={2} className="text-default">
                                メンター
                              </Option>
                            </Select>
                          )}
                        </div>
                      }
                    />
                    {currentUser?.role == UserRole.MENTOR && (
                      <Select
                        id="role"
                        size="large"
                        className="mt-1 font-normal text-default w-full sm:hidden"
                        defaultValue={setValue("role", userData.role)}
                        value={userData.role}
                        {...register("role")}
                        onChange={(value) => {
                          setValue("role", value);
                          setUserData({ ...userData, role: value });
                        }}
                      >
                        <Option value={1} className="text-default">
                          内定者
                        </Option>
                        <Option value={3} className="text-default">
                          教師
                        </Option>
                        <Option value={4} className="text-default">
                          企業担当者
                        </Option>
                      </Select>
                    )}
                    {currentUser?.role == "0" && (
                      <Select
                        id="role"
                        size="large"
                        className="mt-1 font-normal text-default w-full sm:hidden"
                        defaultValue={setValue("role", userData.role)}
                        value={userData.role}
                        disabled={true}
                      >
                        <Option value={2} className="text-default">
                          メンター
                        </Option>
                      </Select>
                    )}
                  </div>
                  <EachInput
                    title="名前（カタカナ)"
                    errorMessage={
                      errors.japanese_fullname?.type === "required" &&
                      errorMessage.emptyError
                    }
                    content={
                      <Input
                        id="japanese_fullname"
                        size="large"
                        className="mr-4 font-normal text-default "
                        placeholder="名前"
                        defaultValue={setValue(
                          "japanese_fullname",
                          userData.japanese_fullname
                        )}
                        value={userData.japanese_fullname}
                        maxLength={64}
                        status={errors.japanese_fullname && "error"}
                        {...register("japanese_fullname", {
                          required: true,
                        })}
                        onChange={(event) => {
                          setValue("japanese_fullname", event.target.value);
                          setUserData({
                            ...userData,
                            japanese_fullname: event.target.value,
                          });
                        }}
                      />
                    }
                  />
                  <EachInput
                    title="メールアドレス"
                    errorMessage={
                      (errors.email?.type === "required" &&
                        errorMessage.emptyError) ||
                      (errors.email?.type === "pattern" &&
                        errorMessage.invaildEmail)
                    }
                    content={
                      <Input
                        id="email"
                        size="large"
                        className="mr-4 font-normal text-default "
                        placeholder="名前"
                        defaultValue={setValue("email", userData.email)}
                        value={userData.email}
                        maxLength={64}
                        status={errors.email && "error"}
                        {...register("email", {
                          required: true,
                          pattern:
                            /^[a-z][a-z0-9_\.]{5,32}@[\S]{2,}(\.[a-z0-9]{2,4}){1,2}$/,
                        })}
                        onChange={(event) => {
                          setValue("email", event.target.value);
                          setUserData({
                            ...userData,
                            email: event.target.value,
                          });
                        }}
                      />
                    }
                  />
                </div>
                <div className="w-28"></div>
              </div>
            </div>
            {userData?.role != UserRole.MENTOR && (
              <>
                <div className="text-center text-3xl font-medium py-12">
                  詳細
                </div>
                <div className="grid grid-cols-1 gap-y-6 w-full lg:w-8/12 2xl:w-7/12">
                  {(userData?.role == UserRole.TEACHER ||
                    userData?.role == UserRole.NAITEISHA) && (
                    <EachInput
                      title="大学"
                      errorMessage={
                        errors.university_id?.type === "required" &&
                        errorMessage.emptyError
                      }
                      content={
                        <Select
                          id="university_id"
                          size="large"
                          className="w-full text-default font-normal"
                          placeholder="大学"
                          defaultValue={setValue(
                            "university_id",
                            userData.university_id
                          )}
                          value={userData.university_id}
                          status={errors.university_id && "error"}
                          {...register("university_id", {
                            required: true,
                          })}
                          onChange={(value) => {
                            setValue("university_id", value);
                            setUserData({ ...userData, university_id: value });
                          }}
                        >
                          {universityData?.map((each, index) => (
                            <Option
                              key={index}
                              value={each.id}
                              className="text-default"
                            >
                              {each.abbreviation}
                            </Option>
                          ))}
                        </Select>
                      }
                    />
                  )}
                  {userData?.role == UserRole.NAITEISHA && (
                    <EachInput
                      title="年度コード"
                      errorMessage={
                        errors.grade_code?.type === "required" &&
                        errorMessage.emptyError
                      }
                      content={
                        <Select
                          id="grade_code"
                          size="large"
                          className="w-full  font-normal text-default"
                          placeholder="年度コード"
                          defaultValue={setValue(
                            "grade_code",
                            userData.grade_code
                          )}
                          value={
                            userData.grade_code
                              ? userData.grade_code
                              : undefined
                          }
                          status={errors.grade_code && "error"}
                          {...register("grade_code", {
                            required: true,
                          })}
                          onChange={(value) => {
                            setValue("grade_code", value);
                            setUserData({ ...userData, grade_code: value });
                          }}
                          disabled={!userData.university_id}
                        >
                          {universityData
                            ?.find((each) => each.id == userData.university_id)
                            ?.code?.map((each, index) => (
                              <Option
                                key={index}
                                value={each.code}
                                className="text-default"
                              >
                                {each.code}
                              </Option>
                            ))}
                        </Select>
                      }
                    />
                  )}
                  {(userData?.role == UserRole.CLIENT ||
                    userData?.role == UserRole.NAITEISHA) && (
                    <EachInput
                      title="企業"
                      errorMessage={
                        errors.company_id?.type === "required" &&
                        errorMessage.emptyError
                      }
                      content={
                        <Select
                          id="company_id"
                          size="large"
                          className="w-full  text-default font-normal"
                          placeholder="企業"
                          defaultValue={setValue(
                            "company_id",
                            userData.company_id
                          )}
                          value={
                            userData.company_id
                              ? userData.company_id
                              : undefined
                          }
                          status={errors.company_id && "error"}
                          {...register("company_id", {
                            // required: true,
                          })}
                          onChange={(value) => {
                            setValue("company_id", value);
                            setUserData({ ...userData, company_id: value });
                          }}
                        >
                          {companyData?.map((each, index) => (
                            <Option
                              key={index}
                              value={each.id}
                              className="text-default"
                            >
                              {each.company_name}
                            </Option>
                          ))}
                        </Select>
                      }
                    />
                  )}
                  {userData?.role == UserRole.NAITEISHA && (
                    <>
                      <EachInput
                        title="内定取得日"
                        errorMessage={
                          errors.receive_naitei_date?.type === "required" &&
                          errorMessage.emptyError
                        }
                        content={
                          <DatePicker
                            id="receive_naitei_date"
                            format="YYYY/MM/DD"
                            size="large"
                            className="w-full  text-default font-normal"
                            placeholder="年月日選択"
                            defaultValue={setValue(
                              "receive_naitei_date",
                              moment(userData.receive_naitei_date)
                            )}
                            value={moment(
                              userData.receive_naitei_date
                                ? userData.receive_naitei_date
                                : undefined
                            )}
                            status={errors.receive_naitei_date && "error"}
                            disabledDate={(date) => date > new Date()}
                            {...register("receive_naitei_date", {
                              // required: true,
                            })}
                            onChange={(value) => {
                              setValue("receive_naitei_date", value);
                              setUserData({
                                ...userData,
                                receive_naitei_date: value,
                              });
                            }}
                          />
                        }
                      />
                      <EachInput
                        title="卒業予定日"
                        errorMessage={
                          errors.graduation_date?.type === "required" &&
                          errorMessage.emptyError
                        }
                        content={
                          <DatePicker
                            id="graduation_date"
                            format="YYYY/MM/DD"
                            size="large"
                            className="w-full  text-default font-normal"
                            placeholder="年月日選択"
                            defaultValue={setValue(
                              "graduation_date",
                              userData.graduation_date
                            )}
                            value={moment(
                              userData.graduation_date
                                ? userData.graduation_date
                                : undefined
                            )}
                            status={errors.graduation_date && "error"}
                            disabledDate={(date) => date < new Date()}
                            {...register("graduation_date", {
                              // required: true,
                            })}
                            onChange={(value) => {
                              setValue("graduation_date", value);
                              setUserData({
                                ...userData,
                                graduation_date: value,
                              });
                            }}
                          />
                        }
                      />
                    </>
                  )}
                </div>
              </>
            )}
            <div
              className="flex flex-col justify-center items-center gap-2 my-8 w-full
            lg:flex-row lg:justify-end lg:w-8/12 2xl:w-7/12"
            >
              <Button disabled={loading} htmlType="button" onClick={handleBack}>
                <span className="">キャンセル</span>
              </Button>
              <Button type="fill" disabled={loading} htmlType="submit">
                <span className="">保存</span>
              </Button>
            </div>
          </form>
        </>
      )}
    </SettingLayout>
  );
};

export default EditUser;
