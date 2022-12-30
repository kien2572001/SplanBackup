import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import client from "~/api/client";
import DefaultAvatar from "~/assets/images/default-avatar.png";
import Icon from "~/components/Icon";
import { showNotification } from "~/components/Notification";
import UserRole from "~/Enums/UserRole";
import ModalContent from "../E1-3/user-detail/ModalContent";
import { useState } from "react";
const UserCard = ({
  avatar,
  userId,
  name,
  company,
  university,
  role,
  setReRender,
  userType,
  currentUserRole,
}) => {
  const router = useRouter();
  const [disableOKButton,setDisableOKButton] = useState(true);
  let state = true;
  const handleDeleteUser = async () => {
    try {
      const res = await client.delete(`users/${userId}`).json()
      if (res.success) {
        setReRender((state) => !state)
        showNotification({
          type: 'success',
          title: 'ユーザを削除することに成功しました。',
        })
      } else {
        showNotification({
          type: 'error',
          title: 'ユーザを削除することに失敗しました。',
        })
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const showConfirm = () => {
    
    const modal = Modal.confirm({
      title: "このユーザを削除してもよろしいですか?",
      icon: <ExclamationCircleOutlined />,
      content: <ModalContent change = {(disable) => {
        state = disable;
         modal.update({ okButtonProps: { disabled: state}});
       }} />,
      cancelText: <span>キャンセル</span>,
      okText: <span>削除</span>,
      okButtonProps: { disabled: disableOKButton},
      async onOk() {
        await handleDeleteUser()
      },
      onCancel() {
        console.log('Cancel')
      },
      centered: true,
    })
  }

  return (
    <div
      className="rounded-sm grid grid-cols-1 content-between gap-4 cursor-pointer hover:shadow-xl transition-all duration-300"
      style={{ border: '1px solid #d9d9d9' }}
    >
      <Link href={`${userType}/${userId}`}>
        <div className="flex items-center flex-col w-full">
          <div className="mt-5 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar ? avatar : DefaultAvatar.src}
              alt="avatar"
              className="object-cover rounded-full w-[96px] h-[96px]"
            />
          </div>

          <h5 className="font-medium max-w-[75%] truncate hidden lg:inline-block">
            {name}
          </h5>
          <h5 className="font-medium max-w-[75%] truncate inline-block lg:hidden">
            {name.split('・').map((value, index) => {
              if (index < name.split('・').length - 2) {
                return value + '・'
              }
              if (index === name.split('・').length - 2) {
                return value
              }
            })}
          </h5>
          <h5 className="font-medium max-w-[75%] truncate inline-block lg:hidden">
            {name.split('・')[name.split('・').length - 1]}
          </h5>
          {university && (
            <span className="max-w-[75%] text-disabled truncate  ">
              {university}
            </span>
          )}

          {company && (
            <>
              <span className="max-w-[75%] text-disabled truncate hidden lg:inline-block">
                {company}
              </span>
              <span className="max-w-[75%] text-disabled truncate inline-block lg:hidden">
                {company.split(' ').map((value, index) => {
                  if (index < company.split(' ').length - 2) {
                    return value + ' '
                  }
                  if (index === company.split(' ').length - 2) {
                      return value
                  }
                })}
              </span>
              <span className="max-w-[75%] text-disabled truncate inline-block lg:hidden">
                { company.split(' ')[company.split(' ').length - 1]}
              </span>
            </>
          )}

          {role === UserRole.MENTOR && (
            <span className="max-w-[75%] text-disabled truncate">GEU</span>
          )}
        </div>
      </Link>
      {((role && role !== UserRole.MENTOR) ||
        currentUserRole === UserRole.SUPER_ADMIN) && (
        <div
          className="w-full h-12 flex items-center"
          style={{ borderTop: '1px solid #d9d9d9' }}
        >
          <div
            className="group flex-1 h-6 flex justify-center items-center hover:text-danger transition-all"
            style={{ border: 'none' }}
            onClick={showConfirm}
          >
            <Icon
              name="delete"
              size={18}
              color="disabled"
              className="group-hover:bg-danger transition-all"
            />
          </div>
          <Link href={`${userType}/${userId}/edit`}>
            <div
              className="flex flex-1 h-6 justify-center items-center text-center group hover:text-primary transition-all"
              style={{ borderLeft: '1px solid #d9d9d9' }}
            >
              <Icon
                name="pencil-squared"
                size={18}
                color="disabled"
                className="group-hover:bg-primary transition-all"
              />
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}

export default UserCard
