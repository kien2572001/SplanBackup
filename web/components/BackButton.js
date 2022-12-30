import Icon from "./Icon";

const BackButton = ({ onClick }) => {
  return (
    <button
      className="inline-flex items-center cursor-pointer bg-transparent border-none font-medium 
      text-base lg:text-2xl group hover:text-primary"
      onClick={onClick}
    >
      <Icon
        name="back"
        color="default"
        size={24}
        className="group-hover:bg-primary lg:hidden"
      />
      <Icon
        name="back"
        color="default"
        size={36}
        className="group-hover:bg-primary hidden lg:block"
      />
      <span>戻る</span>
    </button>
  );
};
export default BackButton;
