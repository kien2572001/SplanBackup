import React from "react";
import PropTypes from "prop-types";
import NavLink from "~/components/NavLink";
import Icon from "~/components/Icon";
import { Tooltip } from "antd";

function SidebarItem(props) {
  return (
    <Tooltip placement="right" title={props.minimized ? props.title : ""}>
      <div className="sidebar-item ">
        <NavLink href={props.href}>
          <div
            className={
              "group sidebar-item-link flex items-center xl:justify-start gap-4 px-1 py-2 xl:px-8 xl:py-3" +
              (props.minimized ? "" : " rounded-[5px]") +
              (!props.bigSideBar ? " justify-center" : " ")
            }
          >
            {props.iconName && (
              <div className="sidebar-item-icon">
                <Icon
                  name={props.iconName}
                  size={28}
                  className="group-hover:bg-primary transition-all"
                  color="default"
                />
              </div>
            )}
            {!props.minimized && (
              <div className={
                "sidebar-item-title whitespace-nowrap text-xs sm:text-sm" + 
                (props.bigSideBar ? " hidden lg:inline-block" : " ")
              }
              >
                {props.title}
              </div>
            )}
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
  minimized: PropTypes.bool,
  bigSideBar: PropTypes.bool,
};

SidebarItem.defaultProps = {
  minimized: false,
};

export default SidebarItem;
