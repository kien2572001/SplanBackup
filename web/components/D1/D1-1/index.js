import { Card, Col, Modal, Pagination, Row, Tooltip, Form, Select, Spin } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import ky from "ky";
import Button from "~/components/Button";
import Icon from "~/components/Icon";
import Navbar from "~/components/layout/Navbar";
import DefaultAvatar from "~/assets/images/default-document.png";
import { showNotification } from "~/components/Notification";
import SearchBar from "~/components/SearchBar";
import { deleteDoc, getAllDocs } from "~/utils/document";
import { getAllCategories } from "~/utils/category";
import { getAllUnits } from "~/utils/unit";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import PageHeader from "~/components/PageHeader";
import UserRole from "~/Enums/UserRole";
import NoData from "~/components/NoData";
const { Meta } = Card;
const { Option } = Select;
const messages = {
  deleteAlert: "この教材を削除してもよろしいですか? 削除後に復元できません。",
  deleteSuccess: "教材が削除されました。",
};

export default function ListDocs() {
  const router = useRouter();
  const filteringTimeout = useRef(null);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [docs, setDocs] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [totalPage, setTotalPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterFields, setFilterFields] = useState({
    categories: [],
    units: [],
  });
  const [form] = Form.useForm();
  const [search, setSearch] = useState({
    name: "",
    category_id: "",
    unit_id: "",
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      router.push("/login");
    } else {
      setUserInfo(currentUser);
      setLoading(false)
    }
  }, [router]);

  useEffect(() => {
    const getAllFilterFields = async () => {
      const categoryRes = await getAllCategories();
      const unitRes = await getAllUnits();

      if (categoryRes.success && unitRes.success) {
        setFilterFields({
          categories: categoryRes.data,
          units: unitRes.data,
        });
      } else {
        if (!categoryRes.success) {
          showNotification({
            type: "error",
            title: categoryRes.message,
          });
        }

        if (!unitRes.success) {
          showNotification({
            type: "error",
            title: unitRes.message,
          });
        }
      }
    };
    getAllFilterFields();
  }, []);

  useEffect(() => {
    const getDocBySearch = async () => {
      try {
        const res = await ky
          .get(
            `/api/document/get-by-search?
              ${search.name && `name=${search.name}`}&
              ${search.category_id && `category_id=${search.category_id}`}&
              ${search.unit_id && `unit_id=${search.unit_id}`}&
              page=${currentPage}
            `
          )
          .json();
        if (res.success) {
          setDocs(res.data.data);
          setTotalPage(res.data.last_page);
        }
      } catch (error) {
      }
    };
    if (filteringTimeout.current) {
      clearTimeout(filteringTimeout.current);
    }
    filteringTimeout.current = setTimeout(() => {
      getDocBySearch();
    }, 500);
  }, [search, currentPage]);

  const handleAdd = () => {
    router.push("/documents/register");
  };

  const handleDelete = (docId) => {
    Modal.confirm({
      title: (
        <div className="text-default font-bold text-base">
          削除後に復元できません。
        </div>
      ),
      icon: <ExclamationCircleOutlined />,
      content: <div className="">この教材を削除してもよろしいですか? </div>,
      okText: "削除",
      cancelText: "キャンセル",
      centered: true,
      onOk() {
        const delDoc = async () => {
          const res = await deleteDoc(docId);

          if (res.success) {
            showNotification({
              type: "success",
              title: messages.deleteSuccess,
            });
            const docsRes = await getAllDocs(currentPage);

            if (docsRes.success) {
              if(docsRes.data.data.length != 0 ){
                setTotalPage(docsRes.data.last_page);
                setDocs(docsRes.data.data);
              } else {
                setCurrentPage(prev => prev - 1)
              }
            }
          } else {
            showNotification({
              type: "error",
              title: res.message,
            });
          }
        };

        delDoc();
      },
      onCancel() {},
    });
  };

  const handleEdit = (docId) => {
    router.push(`/documents/${docId}/edit`);
  };
  const onFinish = async (values) => {
    setSearch({
      ...search,
      category_id: values.category,
      unit_id: values.unit,
    });
  };

  const handleClickCard = (id) => {
    return router.push(`/documents/${id}`);
  };


  if(loading){
    return(
      <div className="flex justify-center mt-10"><Spin size="middle" /></div>
    )
  }
  return (
    <div className="text-default pb-10">
      <Navbar />
      <div className="p-8">
        <PageHeader type="list" title="教材一覧" onAddBtnClick={handleAdd} 
          showAddBtn={userInfo.role === UserRole.MENTOR}
        />
      </div>
      <div className="flex justify-center">
        <div className="w-[378px] md:w-[688px]">
          <SearchBar
            placeholder="検索"
            showFilter={true}
            handleSearch={(e) => setSearch({ ...search, name: e.target.value })}
            name={search.name}
            visibleFilter={visibleFilter}
            handleVisibleFilter={(newVisible) => setVisibleFilter(newVisible)}
          >
            <Form
              name="basic"
              form={form}
              autoComplete="off"
              onFinish={onFinish}
              initialValues={{
                category: "",
                unit: "",
              }}
            >
              <div className="flex flex-col gap-4 mt-3">
                <div className="flex items-center px-2">
                  <span className="text-default pr-5 w-20 text-right">
                    カテゴリ
                  </span>
                  <Form.Item name="category" style={{marginBottom: "0"}}>
                    <Select style={{ width: 148 }} className="text-default">
                      <Option value="" className="text-default">
                        ALL
                      </Option>
                      {filterFields.categories.map((category) => (
                        <Option
                          value={category.id}
                          key={category.id}
                          className="text-default"
                        >
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="flex items-center px-2">
                  <span className="text-default w-20 text-right pr-5">
                    単位
                  </span>
                  <Form.Item  name="unit" style={{marginBottom: "0"}}>
                    <Select style={{ width: 148 }} className="text-default">
                      <Option value="" className="text-default">
                        ALL
                      </Option>
                      {filterFields.units.map((unit) => (
                        <Option
                          value={unit.id}
                          key={unit.id}
                          className="text-default"
                        >
                          {unit.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="px-2 flex justify-end gap-x-2">
                  <Form.Item >
                    <Button
                      onClick={() => {
                        form.resetFields();
                        setVisibleFilter(false);
                      }}
                    >
                      リセット
                    </Button>
                  </Form.Item>
                  <Form.Item className="mb-0">
                    <Button
                      type="fill"
                      htmlType="submit"
                      onClick={() => setVisibleFilter(false)}
                    >
                      検索
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </SearchBar>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <div className="grid mx-16 gap-4 grid-cols-1 sm:grid-cols-2 md:mx-32 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 ">
          {docs.length > 0 &&
            docs?.map((doc) => {
              const thumbnail = doc.images?.find(
                (image) => image.is_thumbnail === 1
              );
              return (
                // eslint-disable-next-line react/jsx-key
                  <Card
                    onClick={() => handleClickCard(doc.id)}
                    headStyle={{ border: "none" }}
                    style={{ border: "1px solid #d9d9d9" }}
                    hoverable
                    title={<span className="text-default">{doc.doc_name}</span>}
                    actions={
                      userInfo.role === UserRole.MENTOR && [
                        <div
                          key={"delete"}
                          className="group flex-1 h-6 flex justify-center items-center hover:text-danger transition-all"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            //handleDelete(doc.id);
                          }}
                        >
                          <Icon
                            name="delete"
                            color="disabled"
                            className="group-hover:bg-danger transition-all"
                          />
                        </div>,
                        <div
                          key={"edit"}
                          className="flex flex-1 h-6 justify-center items-center text-center group hover:text-primary transition-all"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(doc.id);
                          }}
                        >
                          <Icon
                            name="pencil-squared"
                            color="disabled"
                            className="group-hover:bg-primary transition-all"
                          />
                        </div>,
                      ]
                    }
                    cover={
                      // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
                      <img
                        className={`h-[180px] object-contain`}
                        src={thumbnail ? thumbnail.img_link : DefaultAvatar.src}
                      />
                    }
                  >
                    <Meta
                      title={
                        <span className="text-default">{doc?.category}</span>
                      }
                      description={
                        <div className="h-[44px]">
                          {doc.doc_content.length > 64 ? (
                            <>
                              {doc.doc_content.substring(0, 64)}
                              <Tooltip title={doc.doc_content}> ...</Tooltip>
                            </>
                          ) : (
                            <>{doc.doc_content}</>
                          )}
                        </div>
                      }
                    />
                  </Card>
              );
            })}
          </div>
      </div>
      {docs.length === 0 && (
            <div className="flex justify-center w-full">
              <NoData />
            </div>
          )}
      {totalPage > 1 && docs && (
        <Row className="flex justify-center py-4">
          <Pagination
            current={currentPage}
            total={totalPage * 10}
            onChange={(page) => setCurrentPage(page)}
          />
        </Row>
      )}
    </div>
  );
}
