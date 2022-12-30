import { Input, Pagination } from "antd";
import { useEffect, useRef, useState } from "react";
import ky from "~/api/ky";
import TestCard from "./TestCard";
import SettingLayout from "~/components/layout/SettingLayout";
import NoData from "~/components/NoData";
import PageHeader from "~/components/PageHeader";
import { useRouter } from "next/router";
import TestCartSkeleton from "./Skeleton";

function TestList() {
  const router = useRouter();
  const [tests, setTests] = useState([]);
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filteringTimeout = useRef(null);
  const itemNumber = 6;
  const isFetched = useRef(false);

  const deletedTest = (id) => {
    setTests((tests) => tests.filter((test) => test.id !== id));
    if (tests.length == 1) setCurrentPage(1);
    else if (tests.length - 1 <= itemNumber * (currentPage - 1))
      setCurrentPage(currentPage - 1);
    testData = tests.filter((item) => {
      return item.contest_name.toLowerCase().includes(query);
    });
  };

  const testData = tests.filter((item) => {
    return item.contest_name.toLowerCase().includes(query);
  });

  useEffect(() => {
    (async () => {
      isFetched.current = false;
      const res = await ky.get(`/api/contests`).json();
      console.log("data", res.data);
      setTests(
        res.data.sort((a, b) => {
          return b.id - a.id;
        })
      );
      isFetched.current = true;
    })();
  }, []);
  return (
    <SettingLayout>
      <PageHeader
        type="list"
        title="試験一覧"
        onAddBtnClick={() => router.push("/settings/exams/create")}
      />
      <div className="flex justify-center pt-10">
        <div className="w-full">
          <div className="flex justify-center pb-10">
            <div className="w-[269px] sm:w-[386px] md:w-[500px] lg:w-[594px] justify-center">
              <Input
                className="my-4 mr-4
                          border-[1px]  border-input-default rounded-[2px]
                          focus:outline-0 focus:border-[1px] focus:border-input-focus focus:shadow-input
                          placeholder-disabled"
                placeholder="検索"
                onChange={(event) => {
                  filteringTimeout.current = setTimeout(() => {
                    setSearchText(event.target.value);
                  }, 500);
                  if (event.target.value !== "") {
                    setQuery(event.target.value.toLowerCase());
                  }
                }}
              />
            </div>
          </div>
          {searchText != "" && (
            <>
              <div className="container justify-center">
                <div className="grid grid-cols-3 gap-24 px-24 pb-8 mt-12">
                  {!isFetched.current && (
                    <>
                      <TestCartSkeleton />
                      <TestCartSkeleton />
                      <TestCartSkeleton />
                      <TestCartSkeleton />
                      <TestCartSkeleton />
                      <TestCartSkeleton />
                      <TestCartSkeleton />
                    </>
                  )}
                  {testData.length > 0 &&
                    testData
                      .slice(
                        (currentPage - 1) * itemNumber,
                        currentPage * itemNumber
                      )
                      .map((test) => {
                        return (
                          <TestCard
                            key={test.id}
                            name={test.contest_name}
                            id={test.id}
                            imageUrl={test.image ? test.image : null}
                            deletedTest={(id) => {
                              deletedTest(id);
                            }}
                          />
                        );
                      })}
                </div>
                {testData.length === 0 && <NoData />}
                {testData.length > itemNumber && (
                  <div className="flex justify-center">
                    <Pagination
                      defaultCurrent={1}
                      total={testData.length}
                      pageSize={itemNumber}
                      onChange={(page) => {
                        setCurrentPage(page);
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
          {searchText == "" && (
            <>
              <div className="container justify-center">
                <div className="pb-8 mx-2 mt-12 grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
                  {!isFetched.current && (
                    <>
                      <TestCartSkeleton />
                      <TestCartSkeleton />
                      <TestCartSkeleton />
                      <TestCartSkeleton />
                      <TestCartSkeleton />
                      <TestCartSkeleton />
                      <TestCartSkeleton />
                    </>
                  )}
                  {tests.length > 0 &&
                    tests
                      .slice(
                        (currentPage - 1) * itemNumber,
                        currentPage * itemNumber
                      )
                      .map((test) => {
                        return (
                          <TestCard
                            key={test.id}
                            name={test.contest_name}
                            id={test.id}
                            imageUrl={test.image ? test.image : null}
                            deletedTest={(id) => {
                              deletedTest(id);
                            }}
                          />
                        );
                      })}
                </div>
                {tests.length > itemNumber && (
                  <div className="flex justify-center">
                    <Pagination
                      defaultCurrent={1}
                      total={tests.length}
                      pageSize={itemNumber}
                      onChange={(page) => {
                        setCurrentPage(page);
                      }}
                    />
                  </div>
                )}
                {tests.length === 0 && <NoData />}
              </div>
            </>
          )}
        </div>
      </div>
    </SettingLayout>
  );
}

export default TestList;
