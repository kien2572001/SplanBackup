import { Button } from "antd";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import BackButton from "./BackButton";
import Icon from "./Icon";
import { PlusCircleOutlined } from "@ant-design/icons";

// prop showBackBtn={true}, showDeleteBtn={true}, showEditBtn={true} to display back button, delete button, edit button
function PageHeader(props) {
  const router = useRouter();
  return (
    <div className="page-header">
      <div className={
        ['list'].includes(props.type)
        ? "flex w-full sm:justify-between flex-col sm:flex-row" 
          : "flex w-full justify-between"
      }>
        {props.type !== "list" ? (
          <BackButton onClick={props.onBackBtnClick} />
        ) : (
            <h1 className="title font-semibold text-2xl lg:text-4xl text-center sm:text-left">
              {props.title}
            </h1>
          )
        }
        <div className="icons flex gap-7 items-center">
          {
            ['detail'].includes(props.type) && props.showDeleteBtn && (
            <div className="h-5 lg:h-9">
              <Icon
                name="delete"
                color="danger"
                size={20}
                className="cursor-pointer lg:hidden"
                onClick={props.onDeleteBtnClick}
              />
              <Icon
                name="delete"
                color="danger"
                size={36}
                className="cursor-pointer hidden lg:block"
                onClick={props.onDeleteBtnClick}
              />
            </div>
            )}
          {
            ['detail'].includes(props.type) && props.showEditBtn && (
            <div className="h-5 lg:h-9">
              <Icon
                name="pencil-squared"
                color="primary"
                size={20}
                className="cursor-pointer lg:hidden"
                onClick={props.onEditBtnClick}
              />
              <Icon
                name="pencil-squared"
                color="primary"
                size={36}
                className="cursor-pointer hidden lg:block"
                onClick={props.onEditBtnClick}
              />
            </div>
            )
          } 
          {
            ['list'].includes(props.type) && props.showAddBtn && (
              <>
                <Button
                className="w-full sm:w-auto"
                size="large"
                icon={<PlusCircleOutlined />}
                type="primary"
                onClick={props.onAddBtnClick}
              >
                追加
              </Button> 
              </>
            )
          }

        </div>
      </div>
      {props.type !== "list" && (
        <h1 className="text-2xl lg:text-4xl title font-semibold text-center mt-6 mb-10">
          {props.title}
        </h1>
      )}
    </div>
  );
}

PageHeader.propTypes = {
  type: PropTypes.oneOf(["list", "detail", "edit", "create"]),
  onEditBtnClick: PropTypes.func,
  onDeleteBtnClick: PropTypes.func,
  onBackBtnClick: PropTypes.func,
  onAddBtnClick: PropTypes.func,
  showAddBtn: PropTypes.bool,
  showBackBtn: PropTypes.bool,
  showDeleteBtn: PropTypes.bool,
  showEditBtn: PropTypes.bool,
};

PageHeader.defaultProps = {
  type: "create",
  onDeleteBtnClick: null,
  onBackBtnClick: null,
  onEditBtnClick: null,
  onAddBtnClick: null,
  showAddBtn: true,
  showBackBtn: true,
  showDeleteBtn: true,
  showEditBtn: true,
  addBtnText: "追加",
};

export default PageHeader;
