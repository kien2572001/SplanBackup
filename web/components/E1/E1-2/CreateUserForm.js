import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input, Select, DatePicker } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Button from "../../Button";
import Icon from "../../Icon";
import client from "~/api/client";
import EachInput from "./EachInput";
import { showNotification } from "../../Notification";
import UploadImage from "./UploadImage";
import UserRole from "~/Enums/UserRole";

const errorMessage = {
  emptyError: "この項目は必須です。",
  invaildEmail: "有効なメールアドレスを入力してください。",
  takenEmail: "メールはすでに使用されています。",
};

function CreateUserForm({
  universityData,
  companyData,
  userData,
  setReturnAble,
}) {
  const [loading, setLoading] = useState(false);
  const { Option } = Select;
  const [submittedForm, setSubmittedForm] = useState(false);
  const [formData, setFormData] = useState({
    vietnamese_fullname: "",
    japanese_fullname: "",
    email: "",
    avatar: null,
    role:
      userData?.role == UserRole.MENTOR ? UserRole.NAITEISHA : UserRole.MENTOR,
    university_id: "",
    grade_code: "",
    company_id: "",
    graduation_date: "",
    receive_naitei_date: "",
  });

  const [takenEmail, setTakenEmail] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setTakenEmail(false);
    setLoading(true);
    try {
      data.avatar = formData.avatar;
      data.role = formData.role;
      const submitData = new FormData();
      if (formData.role == UserRole.NAITEISHA) {
        data.receive_naitei_date =
          data.receive_naitei_date.format("YYYY-MM-DD");
        data.graduation_date = data.graduation_date.format("YYYY-MM-DD");
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
          .post("users", {
            body: submitData,
          })
          .json();
      }
      if (formData.role == UserRole.TEACHER) {
        submitData.append("vietnamese_fullname", data.vietnamese_fullname);
        submitData.append("japanese_fullname", data.japanese_fullname);
        submitData.append("email", data.email);
        submitData.append("avatar", data.avatar);
        submitData.append("role", data.role);
        submitData.append("university_id", data.university_id);
        console.log(data);
        await client
          .post("users", {
            body: submitData,
          })
          .json();
      }
      if (formData.role == UserRole.CLIENT) {
        submitData.append("vietnamese_fullname", data.vietnamese_fullname);
        submitData.append("japanese_fullname", data.japanese_fullname);
        submitData.append("email", data.email);
        submitData.append("avatar", data.avatar);
        submitData.append("role", data.role);
        submitData.append("company_id", data.company_id);
        await client
          .post("users", {
            body: submitData,
          })
          .json();
      }
      if (formData.role == UserRole.MENTOR) {
        submitData.append("vietnamese_fullname", data.vietnamese_fullname);
        submitData.append("japanese_fullname", data.japanese_fullname);
        submitData.append("email", data.email);
        submitData.append("avatar", data.avatar);
        submitData.append("role", data.role);
        await client
          .post("users", {
            body: submitData,
          })
          .json();
      }
      showNotification({
        type: "success",
        title: "新しいユーザ作成が成功しました。",
      });
      setSubmittedForm(!submittedForm);
    } catch (error) {
      console.log("Submit failed: ", error);
      setTakenEmail(true);
    }
    setLoading(false);
  };

  // Reset form data
  useEffect(() => {
    const handleReset = () => {
      setFormData({
        ...formData,
        vietnamese_fullname: "",
        japanese_fullname: "",
        email: "",
        avatar: null,
        role:
          userData?.role == UserRole.MENTOR
            ? UserRole.NAITEISHA
            : UserRole.MENTOR,
        university_id: "",
        grade_code: "",
        company_id: "",
        graduation_date: "",
        receive_naitei_date: "",
      });
    };

    handleReset();
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedForm, userData?.role]);

  useEffect(() => {
    const handleReturn = () => {
      if (
        formData.vietnamese_fullname !== "" ||
        formData.japanese_fullname !== "" ||
        formData.email !== "" ||
        formData.avatar !== null ||
        formData.university_id !== "" ||
        formData.grade_code !== "" ||
        formData.company_id !== "" ||
        formData.graduation_date !== "" ||
        formData.receive_naitei_date !== ""
      ) {
        setReturnAble(true);
      } else {
        setReturnAble(false);
      }
    };

    handleReturn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return (
    <form
      className="flex flex-col justify-center items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col justify-center items-center w-full lg:w-8/12 xl:w-11/12 
      xl:flex-row xl:items-start xl:gap-x-[144px] 2xl:w-9/12 "
      >
        <UploadImage
          formData={formData}
          setFormData={setFormData}
          submittedForm={submittedForm}
        />
        <div className="mt-8 w-full">
          <div className="grid grid-cols-1 gap-y-5 grow">
            <div>
              <EachInput
                title="名前"
                id="vietnamese_fullname"
                errorMessage={
                  errors.vietnamese_fullname?.type === "required" &&
                  errorMessage.emptyError
                }
                content={
                  <div className="flex sm:gap-x-1 lg:gap-x-4">
                    <Input
                      id="vietnamese_fullname"
                      size="large"
                      className="font-normal text-default sm:basis-3/4"
                      placeholder="名前"
                      value={formData.vietnamese_fullname}
                      maxLength={64}
                      status={errors.vietnamese_fullname && "error"}
                      {...register("vietnamese_fullname", {
                        required: true,
                      })}
                      onChange={(event) => {
                        setValue("vietnamese_fullname", event.target.value);
                        setFormData({
                          ...formData,
                          vietnamese_fullname: event.target.value,
                        });
                      }}
                    />
                    {userData?.role == UserRole.MENTOR && (
                      <Select
                        id="role"
                        size="large"
                        className="font-normal text-default w-full basis-1/4 hidden sm:block"
                        defaultValue={{
                          value: UserRole.NAITEISHA,
                          label: "内定者",
                        }}
                        {...register("role")}
                        onChange={(value) => {
                          value = parseInt(value);
                          setValue("role", value);
                          setFormData({ ...formData, role: value });
                        }}
                      >
                        <Option value="1" className="text-default">
                          内定者
                        </Option>
                        <Option value="3" className="text-default">
                          教師
                        </Option>
                        <Option value="4" className="text-default">
                          企業担当者
                        </Option>
                      </Select>
                    )}
                    {userData?.role === UserRole.SUPER_ADMIN && (
                      <Select
                        id="role"
                        size="large"
                        className="font-normal text-default w-full basis-1/4 hidden sm:block"
                        defaultValue={formData?.role}
                        disabled={true}
                      >
                        <Option value="2" className="text-default">
                          メンター
                        </Option>
                      </Select>
                    )}
                  </div>
                }
              />
              {userData?.role == UserRole.MENTOR && (
                <Select
                  id="role"
                  size="large"
                  className="mt-1 font-normal text-default w-full sm:hidden"
                  defaultValue={{
                    value: UserRole.NAITEISHA,
                    label: "内定者",
                  }}
                  {...register("role")}
                  onChange={(value) => {
                    value = parseInt(value);
                    setValue("role", value);
                    setFormData({ ...formData, role: value });
                  }}
                >
                  <Option value="1" className="text-default">
                    内定者
                  </Option>
                  <Option value="3" className="text-default">
                    教師
                  </Option>
                  <Option value="4" className="text-default">
                    企業担当者
                  </Option>
                </Select>
              )}
              {userData?.role === UserRole.SUPER_ADMIN && (
                <Select
                  id="role"
                  size="large"
                  className="mt-1 font-normal text-default w-full sm:hidden"
                  defaultValue={formData?.role}
                  disabled={true}
                >
                  <Option value="2" className="text-default">
                    メンター
                  </Option>
                </Select>
              )}
            </div>
            <EachInput
              title="名前（カタカナ)"
              id="japanese_fullname"
              errorMessage={
                errors.japanese_fullname?.type === "required" &&
                errorMessage.emptyError
              }
              content={
                <Input
                  id="japanese_fullname"
                  size="large"
                  className="mr-4 font-normal  text-default "
                  placeholder="名前（カタカナ）"
                  value={formData.japanese_fullname}
                  maxLength={64}
                  status={errors.japanese_fullname && "error"}
                  {...register("japanese_fullname", {
                    required: true,
                  })}
                  onChange={(event) => {
                    setValue("japanese_fullname", event.target.value);
                    setFormData({
                      ...formData,
                      japanese_fullname: event.target.value,
                    });
                  }}
                />
              }
            />
            <EachInput
              title="メールアドレス"
              id="email"
              errorMessage={
                (errors.email?.type === "required" &&
                  errorMessage.emptyError) ||
                (errors.email?.type === "pattern" &&
                  errorMessage.invaildEmail) ||
                (takenEmail && errorMessage.takenEmail)
              }
              content={
                <Input
                  id="email"
                  size="large"
                  className="mr-4 font-normal  text-default "
                  placeholder="メールアドレス"
                  value={formData.email}
                  maxLength={64}
                  status={errors.email && "error"}
                  {...register("email", {
                    required: true,
                    pattern:
                      /^[a-z][a-z0-9_\.]{5,32}@[\S]{2,}(\.[a-z0-9]{2,4}){1,2}$/,
                  })}
                  onChange={(event) => {
                    setValue("email", event.target.value);
                    setFormData({ ...formData, email: event.target.value });
                  }}
                />
              }
            />
          </div>
          <div className="w-28"></div>
        </div>
      </div>
      {userData?.role === UserRole.MENTOR && (
        <>
          <div className="text-center text-3xl font-medium py-12">詳細</div>
          <div className="grid grid-cols-1 gap-y-6 w-full lg:w-8/12 2xl:w-7/12">
            {(formData.role === UserRole.TEACHER ||
              formData.role === UserRole.NAITEISHA) && (
              <EachInput
                title="大学"
                id="university_id"
                errorMessage={
                  errors.university_id?.type === "required" &&
                  errorMessage.emptyError
                }
                content={
                  <Select
                    id="university_id"
                    size="large"
                    className="w-full  text-default font-normal"
                    placeholder="大学"
                    value={
                      formData.university_id
                        ? formData.university_id
                        : undefined
                    }
                    status={errors.university_id && "error"}
                    {...register("university_id", {
                      required: true,
                    })}
                    onChange={(value) => {
                      setValue("university_id", value);
                      setFormData({ ...formData, university_id: value });
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
            {formData.role === UserRole.NAITEISHA && (
              <EachInput
                title="年度コード"
                id="grade_code"
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
                    value={
                      formData.grade_code ? formData.grade_code : undefined
                    }
                    status={errors.grade_code && "error"}
                    {...register("grade_code", {
                      required: true,
                    })}
                    onChange={(value) => {
                      setValue("grade_code", value);
                      setFormData({ ...formData, grade_code: value });
                    }}
                    disabled={!formData.university_id}
                  >
                    {universityData
                      ?.find((each) => each.id == formData.university_id)
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
            {(formData.role === UserRole.CLIENT ||
              formData.role === UserRole.NAITEISHA) && (
              <EachInput
                title="企業"
                id="company_id"
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
                    value={
                      formData.company_id ? formData.company_id : undefined
                    }
                    status={errors.company_id && "error"}
                    {...register("company_id", {
                      required: true,
                    })}
                    onChange={(value) => {
                      setValue("company_id", value);
                      setFormData({ ...formData, company_id: value });
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
            {formData.role === UserRole.NAITEISHA && (
              <>
                <EachInput
                  title="内定取得日"
                  id="receive_naitei_date"
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
                      value={
                        formData.receive_naitei_date
                          ? formData.receive_naitei_date
                          : undefined
                      }
                      status={errors.receive_naitei_date && "error"}
                      disabledDate={(date) => date > new Date()}
                      {...register("receive_naitei_date", {
                        required: true,
                      })}
                      onChange={(value) => {
                        setValue("receive_naitei_date", value);
                        setFormData({
                          ...formData,
                          receive_naitei_date: value,
                        });
                      }}
                    />
                  }
                />
                <EachInput
                  title="卒業予定日"
                  id="graduation_date"
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
                      value={
                        formData.graduation_date
                          ? formData.graduation_date
                          : undefined
                      }
                      status={errors.graduation_date && "error"}
                      disabledDate={(date) => date < new Date()}
                      {...register("graduation_date", {
                        required: true,
                      })}
                      onChange={(value) => {
                        setValue("graduation_date", value);
                        setFormData({ ...formData, graduation_date: value });
                      }}
                    />
                  }
                />
              </>
            )}
          </div>
        </>
      )}
      <div className="my-8 w-full lg:w-8/12 2xl:w-7/12 lg:text-right">
        <Button type="fill" disabled={loading} htmlType="submit">
          <div className="flex justify-center items-center">
            {loading ? (
              <LoadingOutlined/>
            ) : (
              <Icon name="plus-circle" color="white" size="14px"></Icon>
            )}
            <span className="text-sm pl-2">作成</span>
          </div>
        </Button>
      </div>
    </form>
  );
}
export default CreateUserForm;
