import { useState, useEffect, useRef } from "react";
import propTypes from "prop-types";
import NaiteishaCard from "../NaiteishaCard";
import client from "~/api/client";
import B1SearchBox from "~/components/B1/B1SearchBox";
import NaiteishaCardSkeleton from "../NaiteishaCard/Skeleton";
import NoData from "~/components/NoData";

NaiteishaList.propTypes = {};

NaiteishaList.defaultProps = {};

export default function NaiteishaList() {
  const [name, setName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [users, setUsers] = useState([]);
  const isFetched = useRef(false);
  const filteringTimeout = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client
          .get(
            "users/naiteishas" +
              ((name || companyId || graduationYear || universityId) && "?") +
              (name && `name=${name}&`) +
              (companyId && `company_id=${companyId}&`) +
              (universityId && `university_id=${universityId}&`) +
              (graduationYear && `graduation_year=${graduationYear}`)
          )
          .json();
        if (res.success) {
          setUsers(res.data);
        }
      } catch (error) {}
      isFetched.current = true;
    };

    if (filteringTimeout.current) {
      clearTimeout(filteringTimeout.current);
    }
    filteringTimeout.current = setTimeout(() => {
      fetchData();
    }, 500);
  }, [name, companyId, graduationYear, universityId]);

  return (
    <div className="w-[600px] h-full overflow-y-scroll py-2 flex flex-col gap-2">
      <B1SearchBox
        setName={setName}
        setGraduationYear={setGraduationYear}
        setCompanyId={setCompanyId}
        setUniversityId={setUniversityId}
      />
      <div className="naiteisha-list flex gap-2 flex-wrap w-full">
        {isFetched.current === false ? (
          <>
            <NaiteishaCardSkeleton />
            <NaiteishaCardSkeleton />
            <NaiteishaCardSkeleton />
            <NaiteishaCardSkeleton />
            <NaiteishaCardSkeleton />
            <NaiteishaCardSkeleton />
          </>
        ) : ( users.length !== 0 ?
          users.map((naiteisha) => (
            <NaiteishaCard
              key={naiteisha.id}
              userId={naiteisha.id}
              name={naiteisha.japaneseFullname}
              university={naiteisha.universityName}
              gradeCode={naiteisha.gradeCode}
              company={naiteisha.companyName}
              receiveNaiteiDate={naiteisha.receiveNaiteiDate
                .split("-")
                .slice(0, 2)
                .join("/")}
              graduateTime={naiteisha.graduationDate
                .split("-")
                .slice(0, 2)
                .join("/")}
              avatarUrl={naiteisha.avatar}
            />
          )) : <div className="d-flex gap-2 flex-wrap w-full justify-content-around"><NoData/></div> 
        )}
      </div>
    </div>
  );
}
