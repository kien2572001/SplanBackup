import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, Spin } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import client from "~/api/client";
import CreateUserForm from "~/components/E1/E1-2/CreateUserForm";
import SettingLayout from "~/components/layout/SettingLayout";
import PageHeader from "~/components/PageHeader";

export default function UserCreateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [universityData, setUniversityData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [userData, setUserData] = useState({});
  const [returnAble, setReturnAble] = useState(false);

  const showConfirm = () => {
    if (returnAble) {
      Modal.confirm({
        title: "変更内容が保存されません。",
        centered: true,
        icon: <ExclamationCircleOutlined />,
        content: "よろしいですか？",
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

  useEffect(() => {
    const fetchCompanyUniversityData = async () => {
      setLoading(true);
      try {
        const res = await client.get("users/get-inf").json();
        if (res) {
          setUniversityData(res.universities);
          setCompanyData(res.companies);
        }
      } catch (error) {
        console.log("Fetching error: ", error);
      }
      setUserData(JSON.parse(localStorage.getItem("currentUser")));
      setLoading(false);
    };

    fetchCompanyUniversityData();
  }, []);

  return (
    <SettingLayout>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <PageHeader
            type="create"
            title="ユーザ新規登録"
            onBackBtnClick={showConfirm}
          />
          <CreateUserForm
            universityData={universityData}
            companyData={companyData}
            userData={userData}
            returnAble={returnAble}
            setReturnAble={setReturnAble}
          />
        </>
      )}
    </SettingLayout>
  );
}
