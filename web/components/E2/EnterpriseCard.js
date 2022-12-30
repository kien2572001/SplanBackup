const EnterpriseCard = ({ enterpriseName, enterpriseLogo }) => {
  return (
    <div
      className="rounded-sm flex flex-col items-center gap-4 cursor-pointer hover:shadow-xl transition-all duration-300 pb-4"
      style={{ border: "1px solid #d9d9d9" }}
    >
      <div className="flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={enterpriseLogo}
          width="100%"
          height="173px"
          alt="#"
          style={{ objectFit: "contain" }}
        />

        <h5 className="font-medium max-w-[75%] truncate my-2">
          {enterpriseName}
        </h5>
      </div>
    </div>
  );
};

export default EnterpriseCard;
