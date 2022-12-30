import { Pagination } from "antd";
import { useRouter } from "next/router";
import { createContext, useEffect, useRef, useState } from "react";
import client from "~/api/client";
import UserCard from "~/components/E1/E1-1/UserCard";
import UserSearch from "~/components/E1/E1-1/UserSearch";
import SettingLayout from "~/components/layout/SettingLayout";
import SidebarItem from "~/components/layout/SettingSidebar/SidebarItem";
import NoData from "~/components/NoData";
import PageHeader from "~/components/PageHeader";
import UserRole from "~/Enums/UserRole";
import NaiteishaCardSkeleton from "../../B1/NaiteishaCard/Skeleton";

export const UserListContext = createContext();

function UserList() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [gradeCode, setGradeCode] = useState("");
  const [graduationDate, setGraduationDate] = useState("");
  const [receiveNaiteiDate, setReceiveNaiteiDate] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(0);
  const [wasFetched, setWasFetched] = useState(false);
  const filteringTimeout = useRef(null);

  useEffect(() => {
    setCurrentUserRole(JSON.parse(localStorage.getItem("currentUser")).role);
  }, []);
  const value = {
    name,
    setName,
    universityId,
    setUniversityId,
    companyId,
    setCompanyId,
    gradeCode,
    setGradeCode,
    graduationDate,
    setGraduationDate,
    receiveNaiteiDate,
    setReceiveNaiteiDate,
    page,
    setPage,
  };

  useEffect(() => {
    setName("");
    setUniversityId("");
    setCompanyId("");
    setGradeCode("");
    setGraduationDate("");
    setReceiveNaiteiDate("");
    setPage(1);
  }, [router.query.userType]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client
          .get(
            `users/user-type/${router.query.userType}?` +
              (name && `name=${name}&`) +
              (companyId && `company_id=${companyId}&`) +
              (universityId &&
                `university_id=${universityId}&` +
                  (gradeCode &&
                    `grade_code=${gradeCode}&` +
                      (graduationDate && `graduation_date=${graduationDate}&`) +
                      (receiveNaiteiDate &&
                        `receive_naitei_date=${receiveNaiteiDate} &`))) +
              (page && `page=${page}`)
          )
          .json();
        if (res.success) {
          if (res.data.data.length > 0) {
            setUsers(res.data.data);
            setPage(res.data.current_page);
          } else {
            setUsers(res.data.data);
            setPage(1);
          }
          setLastPage(res.data.last_page);
        }
      } catch (error) {}
      setWasFetched(true);
    };
    if (filteringTimeout.current) {
      clearTimeout(filteringTimeout.current);
    }
    filteringTimeout.current = setTimeout(() => {
      fetchData();
    }, 500);
  }, [
    companyId,
    gradeCode,
    graduationDate,
    name,
    page,
    receiveNaiteiDate,
    router.query.userType,
    universityId,
    reRender,
  ]);

  return (
    <UserListContext.Provider value={value}>
      <SettingLayout>
        <PageHeader
          type="list"
          title="ユーザ一覧"
          onAddBtnClick={() => router.push(`/settings/users/register`)}
        />
        <div>
          <div className="flex flex-col xl:flex-row mt-8">
            <div
              className="pr-4 hidden xl:block mr-12"
              style={{ borderRight: "2px solid #D9D9D9" }}
            >
              <h4 className="font-semibold mb-6">役割</h4>
              <div className="setting-sidebar bg-white flex flex-col gap-4 w-full">
                {currentUserRole === UserRole.MENTOR && (
                  <>
                    <SidebarItem
                      href="/settings/users/naiteisha"
                      title="内定者"
                      currentPath={router.asPath}
                      bigSideBar={false}
                    />
                    <SidebarItem
                      href="/settings/users/clients"
                      title="企業担当者"
                      currentPath={router.asPath}
                      bigSideBar={false}
                    />
                    <SidebarItem
                      href="/settings/users/teachers"
                      title="教師"
                      currentPath={router.asPath}
                      bigSideBar={false}
                    />
                  </>
                )}
                <SidebarItem
                  href="/settings/users/mentors"
                  title="メンター"
                  currentPath={router.asPath}
                  bigSideBar={false}
                />
              </div>
            </div>
            <div
              className="xl:hidden pb-2 mb-0"
              style={{ borderBottom: "2px solid #D9D9D9" }}
            >
              <h4 className="font-semibold mb-6">役割</h4>
              <div className="setting-sidebar bg-white grid grid-cols-4 w-full">
                {currentUserRole === UserRole.MENTOR && (
                  <>
                    <SidebarItem
                      href="/settings/users/naiteisha"
                      title="内定者"
                      currentPath={router.asPath}
                      bigSideBar={false}
                    />
                    <SidebarItem
                      href="/settings/users/clients"
                      title="企業担当者"
                      currentPath={router.asPath}
                      bigSideBar={false}
                    />
                    <SidebarItem
                      href="/settings/users/teachers"
                      title="教師"
                      currentPath={router.asPath}
                      bigSideBar={false}
                    />
                  </>
                )}
                <SidebarItem
                  href="/settings/users/mentors"
                  title="メンター"
                  currentPath={router.asPath}
                  bigSideBar={false}
                />
              </div>
            </div>
            <div className="flex justify-center flex-1">
              <div className="w-full sm:mx-8">
                <div className="my-3 2xl:m-6">
                  <UserSearch role={router.query.userType} />
                </div>
                <div className="2xl:m-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 2xl:grid-cols-4 gap-2 lg:gap-5">
                  {wasFetched ? (
                    users.length > 0 &&
                    users.map((user) => (
                      <UserCard
                        avatar={
                          user.avatar &&
                          (user.avatar.startsWith("images/") ? "/" : "") +
                            user.avatar
                        }
                        name={user.japaneseFullname}
                        userId={user.id}
                        company={
                          (user.role === UserRole.NAITEISHA ||
                            user.role === UserRole.CLIENT) &&
                          user.company
                        }
                        university={
                          (user.role === UserRole.NAITEISHA ||
                            user.role === UserRole.TEACHER) &&
                          user.abbreviation
                        }
                        role={user.role}
                        setReRender={setReRender}
                        key={user.id}
                        userType={router.query.userType}
                        currentUserRole={currentUserRole}
                      />
                    ))
                  ) : (
                    <>
                      <NaiteishaCardSkeleton />
                      <NaiteishaCardSkeleton />
                      <NaiteishaCardSkeleton />
                      <NaiteishaCardSkeleton />
                      <NaiteishaCardSkeleton />
                      <NaiteishaCardSkeleton />
                      <NaiteishaCardSkeleton />
                      <NaiteishaCardSkeleton />
                      <NaiteishaCardSkeleton />
                    </>
                  )}
                </div>
                {users.length === 0 && <NoData />}
                <div className="flex justify-center mt-5">
                  {users.length > 0 && lastPage > 1 && (
                    <Pagination
                      current={page}
                      total={lastPage * 10}
                      onChange={(page) => setPage(page)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SettingLayout>
    </UserListContext.Provider>
  );
}

export default UserList;
