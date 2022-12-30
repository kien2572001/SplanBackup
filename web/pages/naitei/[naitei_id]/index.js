import { useRouter } from "next/router";
import NaiteishaOverview from "~/components/C1";
import ky from "~/api/ky";

const Index = ({ userData }) => {
  return <NaiteishaOverview userData={userData} />;
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
      if (
        currentUser.role === 4 &&
        res?.data?.company !== currentUser.companyName
      ) {
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
