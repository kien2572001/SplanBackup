import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons"
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import client from "~/api/client";
import defaultUniversity from "~/assets/images/default-university.png";
import UniversityTable from "~/components/E3/E3-3/university-detail/UniversityTable";
import SettingLayout from "~/components/layout/SettingLayout";
import PageHeader from "~/components/PageHeader";
import { showNotification } from "~/components/Notification";

export default function UniversityDetail() {
  const router = useRouter();
  const { university_id } = router.query;
  const [items, setItems] = useState([]);
  const [universityInfo, setUniversityInfo] = useState({
    id: university_id,
    year: "",
    code: "",
    image: "/images/university-no-image.png",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await client.get(`universities/${university_id}`).json();
      setUniversityInfo(data);
      if (data) {
        setImage(data.image);
        if (data.gradeCodes.length > 0) {
          setItems(
            data.gradeCodes.map((item, index) => ({
              id: index + 1,
              code: item.code,
              year: item.year,
            }))
          );
        }
      }
    };
    fetchData();
  }, [university_id]);

  const handleDelete = () => {
    Modal.confirm({
      title: "この大学を削除してもよろしですか?",
      icon: <ExclamationCircleOutlined />,
      content: "削除後に復元できません。",
      okText: "削除",
      cancelText: "キャンセル",
      centered: true,
      onOk(){
        const delete_uni = async () => {
          const res = await client.delete(`universities/${university_id}`).json();
          if(res.success){
            router.push('/settings/universities');
          }
          else{
            if (res.message === "Have user in this university"){
              showNotification({
                type: "error",
                title: 'この大学には' + res.userCount +  'ユーザーが登録されています。' +' 大学を削除する前にユーザーを削除してください。'
              });
            }
          }
        }
        delete_uni()
      }
    })
  }

  return (
    <SettingLayout>
      <div>
        <PageHeader
          title="大学詳細"
          type="detail"
          onBackBtnClick={() => router.push(`/settings/universities`)}
          onEditBtnClick={() =>
            router.push(`/settings/universities/${university_id}/edit`)
          }
          onDeleteBtnClick={() => handleDelete()}
        />
        <div className="py-4 thumbnail-name flex">
          {image && typeof image === "object" ? (
            <div className="mt-2 transition-all">
              <Image
                src={URL.createObjectURL(image)}
                width={160}
                height={90}
                objectFit="cover"
                alt="#"
              />
            </div>
          ) : (
            <div className="mt-2 transition-all">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  universityInfo?.image
                    ? universityInfo?.image.startsWith("images/")
                      ? "/" + universityInfo?.image
                      : "" + universityInfo.image
                    : defaultUniversity.src
                }
                width={160}
                height={90}
                style={{ objectFit: "contain" }}
                alt=""
              />
            </div>
          )}
          <div className="container w-1/5 flex flex-col justify-center">
            <h2 className="ml-8 text-center font-bold">
              {" "}
              {universityInfo?.abbreviation}{" "}
            </h2>
            <h3 className="ml-8 text-center font-bold">
              {" "}
              {universityInfo?.name}{" "}
            </h3>
          </div>
        </div>
        <div className="py-4">
          <UniversityTable data={items} />
        </div>
      </div>
    </SettingLayout>
  );
}
