import defaultUniversity from "~/assets/images/default-university.png";
import Link from "next/link";
import Icon from "../../Icon";
import confirmModal from "../../ConfirmModal";
import { useRouter } from "next/router";
import { useState } from "react";

const UniversityCard = ({ id, image, name, abbreviation, handleDelete }) => {
  const router = useRouter();
  const { university_id } = router.query;
  const [universityInfo, setUniversityInfo] = useState({
    id: university_id,
    year: "",
    code: "",
    image: "images/university-no-image.png",
  });
  const handleRemove = () =>
    confirmModal(
      "この大学を削除してもよろしですか?",
      "削除後に復元できません。",
      "削除",
      "キャンセル",
      () => handleDelete(id)
    );

  return (
    <div
      className="col-span-4 hover:shadow-xl transition-all duration-300"
      style={{ border: "1px solid #D9D9D9" }}
    >
      <Link href={`/settings/universities/${id}`}>
        <a>
          <div className="flex flex-col justify-center ">
            <picture>
              <source
                srcSet={
                  image
                    ? image.startsWith("images/")
                      ? "/" + image
                      : "" + image
                    : defaultUniversity.src
                }
                type="image/webp"
              />
              <img
                src={
                  image
                    ? image.startsWith("images/")
                      ? "/" + image
                      : "" + image
                    : defaultUniversity.src
                }
                width="100%"
                height="173px"
                alt="#"
                style={{ objectFit: "contain" }}
              />
            </picture>

            <h4 className="text-center mt-5 font-medium text-primary">
              {abbreviation ? abbreviation : "大学の名前（略称)"}
            </h4>
            <h4 className="text-center mt-2 font-bold">
              {name ? name : "大学の名前"}
            </h4>
          </div>
        </a>
      </Link>
      <div
        className="grid grid-cols-2 gap-0 py-3 mt-10"
        style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}
      >
        <div
          className="group col-span-1 text-center hover:text-danger transition-all"
          style={{ borderRight: "1px solid rgba(0,0,0,0.1)" }}
          onClick={handleRemove}
        >
          <Icon
            className="cursor-pointer group-hover:bg-danger transition-all"
            name="delete"
            color="disabled"
          />
        </div>
        <div className="col-span-1 text-center">
          <Link href={`/settings/universities/${id}/edit`}>
            <a>
              <div className="group hover:text-primary transition-all">
                <Icon
                  className="group-hover:bg-primary"
                  color="disabled"
                  name="pencil-squared"
                />
              </div>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;
