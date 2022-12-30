import { Input } from "antd"

const EnterpriseSearch = (props) => {
  return (
    <div className="flex mt-24" style = {{ width: "100%" }} >
      <Input
        placeholder="検索"
        className="h-10 w-[60%] ml-100 placeholder:text-disabled focus:shadown-none "
        style = {{ justifyContent:"center", alignItems: "center",width: "50%" , transform :"translateX(50%)" }}
        onChange={props.setSearch}
      />
    </div>
  )
}

export default EnterpriseSearch