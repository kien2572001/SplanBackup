import ky from "~/api/ky";
import NaiteishaPlan from "~/components/C3/C3-1";

const Index = ({ userData, currentUser }) => {
  return <NaiteishaPlan userData={userData} currentUser={currentUser} />;
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
      const resAllMilestones = await ky.get(`api/target/user/${userId}`).json();
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
      const nextMilestone = resAllMilestones.data.find(
        (milestone) => milestone.is_completed === 0
      );
      if (nextMilestone) {
        return {
          redirect: {
            destination: `/naitei/${userId}/milestones/${nextMilestone.id}`,
            permanent: false,
          },
        };
      } else if (resAllMilestones.data.length && !nextMilestone) {
        return {
          redirect: {
            destination: `/naitei/${userId}/milestones/${
              resAllMilestones.data.at(-1).id
            }`,
            permanent: false,
          },
        };
      }
      return {
        props: {
          userData: res.data,
          currentUser: currentUser,
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
