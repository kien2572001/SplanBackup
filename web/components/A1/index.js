import { Form, Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { auth } from "~/api/client";
import Logo from "~/assets/app-logo.svg";
import LoginImg from "~/assets/login-image.svg";
import Icon from "~/components/Icon";
import { showNotification } from "~/components/Notification";
import SubmitButton from "~/components/A1/SubmitButton";
import styles from "~/styles/Login.module.css";

const EMAIL_REGEX = /^[a-z][a-z0-9_\.]{4,32}@[\S]{2,}(\.[a-z0-9]{2,4}){1,2}$/;

const errorMessage = {
  invaildEmail: "有効なメールアドレスを入力してください。",
  emptyEmail: "メールアドレスを入力してください。",
  emptyPwd: "パスワードを入力してください。",
  invaildResponse: "メールアドレスまたはパスワードが正しくありません。",
  successLogin: "ログインが成功しました。",
};

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  //Submit Form
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await auth
        .post("auth/login", {
          json: values,
        })
        .json();
      const responseData = response.data;
      if (responseData) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify(responseData.user)
        );

        router.push(`/`);
        showNotification({
          type: "success",
          title: errorMessage.successLogin,
        });
      }
    } catch (error) {
      showNotification({
        type: "error",
        title: errorMessage.invaildResponse,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-auto bg-default">
      <div className="text-white text-center px-7">
        <Image
          src={Logo}
          alt="SPLAN"
          height={97}
          width={128}
          objectFit="cover"
        />
        <div className="text-base font-normal tracking-[0em]">ログイン画面</div>
      </div>
      <div className="flex justify-center items-center w-full">
        <div 
          className="2xl:w-[898px] xl:w-[60vw] lg:w-[85vw] sm:w-[70vw] lg:flex
          2xl:h-[581px] h-[75vh]"
        >
          <div
            className={`${styles.left} max-lg:hidden
            basis-5/12 bg-[#B2DEFF] px-14 pt-10 flex flex-col gap-5
            shadow-[0_4px_10px_0px_rgba(0,0,0,0.5)] z-10`}
          >
            <Image src={LoginImg} alt="" width={300} height={214} />
            <div className="text-center">
              <span className="font-bold text-3xl text-center">SPLAN</span>
              <br />
              <span className="block text-base text-center font-normal py-2">
                小さいことを重ねることが
                <br />
                とんでもないところに行く
                <br />
                ただひとつの道
              </span>
            </div>
          </div>
          <div className="lg:basis-7/12 py-3">
            <div
              className={`${styles.right}
                h-full lg:pl-16 lg:pr-20 px-8 py-10 bg-white
                flex flex-col justify-center gap-10` 
              }
            >
              <h2 className="font-black text-default">ようこそ、</h2>
              <Form
                layout="vertical"
                initialValues={{
                  remember: true,
                }}
                requiredMark={false}
                onFinish={handleSubmit}
              >
                <Form.Item
                  name="email"
                  label={
                    <p className="font-extrabold text-sm text-default m-0">
                      メールアドレス
                      <span className="text-red-400 mx-1">*</span>
                    </p>
                  }
                  rules={[
                    {
                      required: true,
                      message: errorMessage.emptyEmail
                    },
                    {
                      pattern: EMAIL_REGEX,
                      message: errorMessage.invaildEmail
                    }
                  ]}
                >
                  <Input
                    size="default"
                    type="text"
                    id="email"
                    placeholder="メールアドレスを入力してください"
                    prefix={<Icon name="envelope" size={16} />}
                  />
                </Form.Item>
                <Form.Item 
                  name="password"
                  label={
                    <p className="font-extrabold text-sm text-default m-0">
                      パスワード
                      <span className="text-red-400 mx-1">*</span>
                    </p>
                  }
                  rules={[
                    {
                      required: true,
                      message: errorMessage.emptyPwd
                    }
                  ]}                
                >
                  <Input
                    size="default"
                    type="password"
                    id="password"
                    placeholder="パスワードを入力してください"
                    prefix={<Icon name="lock" size={16} />}
                    autoComplete="off"
                  />
                </Form.Item>
                <Link href="#">
                  <a className="block w-full text-right text-xs font-medium underline hover:underline">
                    パスワードをお忘れですか？
                  </a>
                </Link>
                <SubmitButton
                  htmlType="submit"
                  loading={loading}
                >
                  ログイン
                </SubmitButton>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
