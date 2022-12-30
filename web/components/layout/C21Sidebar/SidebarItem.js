import React from "react";
import PropTypes from "prop-types";
import NavLink from "~/components/NavLink";
import { Tooltip } from "antd";

function SidebarItem(props) {
  return (
    <Tooltip placement="right" title="">
      <div className="sidebar-item">
        <NavLink href={props.href}>
          <div
            className={
              "group sidebar-item-link flex items-center gap-4 px-8 py-3 rounded-[5px]"
            }
          >
            <div className="sidebar-item-title whitespace-nowrap font-medium text-[14px]">
              {props.title}
            </div>
          </div>
        </NavLink>
      </div>
    </Tooltip>
  );
}

SidebarItem.propTypes = {
  href: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  currentPath: PropTypes.string.isRequired,
};

export default SidebarItem;
