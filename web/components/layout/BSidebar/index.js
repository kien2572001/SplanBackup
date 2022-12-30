import SearchBox from "./SearchBox";
import UserItem from "./UserItem";
import { useState, useRef, useEffect } from "react";
import moment from "moment";
import Link from "next/link";
import client from "~/api/client";
import NoData from "~/components/NoData";
import BSidebarSkeleton from "./Skeleton"

const BSidebar = () => {
  const [name, setName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [users, setUsers] = useState([]);
  const filteringTimeout = useRef(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await client
          .get(
            "users/naiteishas" +
            ((name || companyId || graduationYear) && "?") +
            (name && `name=${name}&`) +
            (companyId && `company_id=${companyId}&`) +
            (graduationYear && `graduation_year=${graduationYear}`)
          )
          .json();
        if (res.success) {
          setLoading(false)
          setUsers(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (filteringTimeout.current) {
      clearTimeout(filteringTimeout.current);
    }
    filteringTimeout.current = setTimeout(() => {
      fetchData();
    }, 500);
  }, [name, companyId, graduationYear]);

  return (
    <div className="w-[224px] min-h-screen bg-white shadow-md">
      <div className="px-2 my-2">
        <SearchBox
          setName={setName}
          setGraduationYear={setGraduationYear}
          setCompanyId={setCompanyId}
        />
      </div>
      <div>
        {
          loading ?
            <>
              {[...Array(8).keys()].map(e => <BSidebarSkeleton key={e} />)}
            </>
            :
            users && users.length > 0 ? (
              users.map((user) => (
                <Link href={`/naitei/${user.id}`} key={user.id}>
                  <a>
                    <UserItem
                      avatar={user.avatar}
                      userName={user.japaneseFullname}
                      graduationYear={moment(user.graduationDate).format("YYYY")}
                    />
                  </a>
                </Link>
              ))
            ) : (
              <NoData size="small" />
            )
        }
      </div>
    </div>
  );
};

export default BSidebar;
