import ky from "~/api/ky";
import EditTarget from "~/components/C3/C3-3";

const Index = ({ userData }) => {
  return <EditTarget userData={userData} />;
};

export async function getServerSideProps(context) {
  const userId = context?.params?.naitei_id;
  const cookie = context?.req?.cookies.current_user;
  let currentUser = null;
  if (cookie) {
    currentUser = JSON.parse(cookie);
  }

  if (userId) {
    try {
      const res = await ky.get(`api/users/naiteisha?user_id=${userId}`).json();
      if (currentUser.id !== res?.data?.id) {
        return {
          redirect: {
            destination: "/404",
            permanent: false,
          },
        };
      }
      return {
        props: {
          userData: res.data,
        },
      };
    } catch (error) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }
  }
  return {
    redirect: {
      destination: "/404",
      permanent: false,
    },
  };
}

export default Index;
