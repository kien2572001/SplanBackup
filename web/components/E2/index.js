import { Pagination } from "antd";
import React from "react";
import SettingLayout from "../layout/SettingLayout";
import NoData from "../NoData";
import PageHeader from "../PageHeader";
import EnterpriseCard from "./EnterpriseCard";
import { useState, useEffect } from "react";
import EnterpriseSearch from "./EnterpriseSearch";

const data = ([
  {
    enterpriseName: "Yumemi Inc.",
    enterpriseLogo:
      "https://yumemi.co.jp/grow-with-new-logo/img/common/logo_new.svg",
  },
  {
    enterpriseName: "Sun* Inc.",
    enterpriseLogo:
      "https://image.bnews.vn/MediaUpload/Org/2019/03/04/151429_01.png",
  },
  {
    enterpriseName: "Money Forward Inc.",
    enterpriseLogo:
      "https://corp.moneyforward.com/assets/common/img/logo.png",
  },
  {
    enterpriseName: "Brains Technology Inc.",
    enterpriseLogo:
      "https://www.brains-tech.co.jp/wp-content/themes/brains/assets/img/logo/bti_logo.png",
  },
  {
    enterpriseName: "Cydas Inc.",
    enterpriseLogo:
      "https://res.cloudinary.com/crunchbase-production/image/upload/g0zeiiicjygnbzcwap9d",
  },
  {
    enterpriseName: "Linkbal Inc.",
    enterpriseLogo:
      "https://scp.sun-asterisk.com/storage/images/logos/default-logo.png",
  },
  {
    enterpriseName: "Sun* Inc.",
    enterpriseLogo:
      "https://scp.sun-asterisk.com/storage/images/logos/default-logo.png",
  },
  {
    enterpriseName: "Sun* Inc.",
    enterpriseLogo:
      "https://scp.sun-asterisk.com/storage/images/logos/default-logo.png",
  },
  {
    enterpriseName: "Sun* Inc.",
    enterpriseLogo:
      "https://scp.sun-asterisk.com/storage/images/logos/default-logo.png",
  },
  {
    enterpriseName: "Sun* Inc.",
    enterpriseLogo:
      "https://scp.sun-asterisk.com/storage/images/logos/default-logo.png",
  },
])
const numberItemPerPage = 6;

const EnterpreseList = () => {
  const [page, setPage] = useState(1);
  const [enterpriseData, setEnterpriseData] = useState([]);
  const [search, setSearch] = useState("");
  const handleInputChange = (e) => {
    setTimeout(() => setSearch(e.target.value.toLowerCase()), 500);
    setPage(1)
  };
  useEffect(() => {
    if(search) {
      const searchData = data.filter(each => each.enterpriseName.toLowerCase().includes(search));
      setEnterpriseData([...searchData]);
    } else {
      try {
        setEnterpriseData([...data]);
      } catch {}
    }
  }, [search, page]);

  return (
    <SettingLayout>
      <PageHeader type="list" title="企業一覧" showAddBtn={false} />
      <EnterpriseSearch 
        setSearch={(e) => handleInputChange(e)}
        search={search}
      />
      <div className="grid grid-cols-3 gap-24 px-24 pb-8 mt-12">
        {enterpriseData && enterpriseData.length > 0 && (
          <>
            {enterpriseData.slice((page - 1 ) * numberItemPerPage, page * numberItemPerPage).map((enterprise, index) => {
              return (
                <EnterpriseCard
                  key={index}
                  enterpriseName={enterprise.enterpriseName}
                  enterpriseLogo={enterprise.enterpriseLogo}
                />
              );
            })}
          </>
        )}
      </div>
      {enterpriseData.length === 0 && <NoData />}
      {enterpriseData.length > numberItemPerPage && (
        <div className="flex justify-center">
          <Pagination
            defaultCurrent={1}
            current={page}
            total={data.length}
            pageSize={numberItemPerPage}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}
    </SettingLayout>
  );
};

export default EnterpreseList;
