const Button = ({ children, type, onClick, disabled, htmlType }) => {
  let styles = "";
  if (type === "fill") {
    styles =
      "custom-btn-fill w-full lg:w-auto px-4 py-1 bg-primary text-white hover:bg-[#228BDD] rounded transition-all cursor-pointer";
  } else {
    styles =
      "custom-btn px-4 w-full lg:w-auto py-1 bg-white text-default rounded border  hover:text-primary transition-all cursor-pointer";
  }
  return (
    <button className={styles} onClick={onClick} disabled={disabled} type={htmlType}>
      {children}
    </button>
  );
};
export default Button;