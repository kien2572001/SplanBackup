import { useState, useEffect, useRef } from "react";
import SettingLayout from "~/components/layout/SettingLayout";
import UniversitySearch from "~/components/E3/E3-1/UniversitySearch";
import UniversityCard from "~/components/E3/E3-1/UniversityCard";
import { Pagination } from "antd";
import NaiteishaCardSkeleton from "~/components/B1/NaiteishaCard/Skeleton";
import ky from "ky";
import { useRouter } from "next/router";
import PageHeader from "~/components/PageHeader";
import NoData from "~/components/NoData";
import index from "~/pages/naitei";
import { showNotification } from "~/components/Notification";

const University = () => {
  const router = useRouter();
  const [universities, setUniversities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [search, setSearch] = useState("");
  const typingTimeoutRef = useRef(null);
  const [wasFetched, setWasFetched] = useState(false);
  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };
  const handleDelete = async (id) => {
    try {
      const res = await ky.delete(`/api/universities/${id}`).json();
      if (res.success) {
        const res = await ky
          .get(`/api/universities/filter?name=${search}&page=${currentPage}`)
          .json();
        if (res.success) {
          if (res.data.data.length != 0) {
            const data = res.data.data.sort((a, b) => {
              return b.id - a.id;
            });
            setUniversities(data);
          } else {
            setCurrentPage((prev) => prev - 1);
          }
          setTotalPage(res.data.last_page);
        }
      } else {
        if (res.message === "Have user in this university") {
          showNotification({
            type: "error",
            title:
              "この大学には" +
              res.userCount +
              "ユーザーが登録されています。" +
              " 大学を削除する前にユーザーを削除してください。",
            duration: 10,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const searchUniversity = async () => {
      try {
        const res = await ky
          .get(`/api/universities/filter?name=${search}&page=${currentPage}`)
          .json();
        if (res.success) {
          setUniversities(res.data.data);
          setTotalPage(res.data.last_page);
        }
      } catch (error) {
        console.log(error);
      }
      setWasFetched(true);
    };
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef);
    }
    typingTimeoutRef.current = setTimeout(() => {
      searchUniversity();
    }, 500);
  }, [search, currentPage]);

  return (
    <SettingLayout>
      <PageHeader
        type="list"
        title="大学一覧"
        onAddBtnClick={() => router.push("/settings/universities/create")}
      />
      <UniversitySearch
        setSearch={(e) => handleInputChange(e)}
        search={search}
      />
      <div className="grid grid-cols-12 gap-16 px-8 pb-8 mt-12">
        {wasFetched ? (
          universities.length > 0 &&
          universities.map((university) => (
            <UniversityCard
              image={university.image}
              key={university.id}
              id={university.id}
              name={university.name}
              abbreviation={university.abbreviation}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <>
            {[...Array(6).keys()].map((index) => {
              return (
                <div
                  className="col-span-4"
                  key={`skeletoncard` + index}
                  style={{ zoom: "150%" }}
                >
                  <NaiteishaCardSkeleton />
                </div>
              );
            })}
          </>
        )}
      </div>
      {universities.length === 0 && <NoData />}

      {totalPage > 1 && (
        <div className="text-center mt-10">
          <Pagination
            current={currentPage}
            total={totalPage * 10}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </SettingLayout>
  );
};

export default University;
