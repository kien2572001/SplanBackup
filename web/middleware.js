import { NextResponse } from "next/server";
import { documents, naitei, setting } from "./Enums/RouterRegex";
import {
  CLIENT,
  MENTOR,
  NAITEISHA,
  SUPER_ADMIN,
  TEACHER,
} from "./Enums/UserRole";

const privateRoute = {
  superAdmin: [
    // /setting
    setting.user.CREATE,
    setting.user.mentor.DETAIL,
    setting.user.mentor.EDIT,
    setting.user.mentor.LIST,
  ],
  naiteisha: [
    // /naitei
    naitei.DETAIL,
    naitei.ACHIEVEMENT_DETAIL,
    naitei.TARGET_DETAIL,
    naitei.POST_DETAIL,
    naitei.milestones.DETAIL,
    naitei.milestones.DETAIL_NO_PARAMS,
    naitei.milestones.EDIT_TARGET,
    naitei.milestones.EDIT_ACHIEVEMENT,
    naitei.milestones.EDIT_PLAN,
    naitei.milestones.REGISTER,
    // /documents
    documents.LIST,
    documents.DETAIL,
  ],
  mentor: [
    // /naitei
    naitei.DETAIL,
    naitei.ACHIEVEMENT_DETAIL,
    naitei.TARGET_DETAIL,
    naitei.POST_DETAIL,
    naitei.milestones.DETAIL,
    naitei.milestones.DETAIL_NO_PARAMS,
    // /setting
    // /setting/user
    setting.user.CREATE,
    setting.user.naiteisha.LIST,
    setting.user.naiteisha.DETAIL,
    setting.user.naiteisha.EDIT,
    setting.user.client.LIST,
    setting.user.client.DETAIL,
    setting.user.client.EDIT,
    setting.user.teacher.LIST,
    setting.user.teacher.DETAIL,
    setting.user.teacher.EDIT,
    setting.user.mentor.LIST,
    setting.user.mentor.DETAIL,
    setting.user.mentor.EDIT,
    // /setting/enterprises
    setting.enterprise.LIST,
    // /setting/university
    setting.university.CREATE,
    setting.university.LIST,
    setting.university.DETAIL,
    setting.university.EDIT,
    // /setting/contest
    setting.contest.CREATE,
    setting.contest.LIST,
    setting.contest.DETAIL,
    setting.contest.EDIT,
    // /documents
    documents.CREATE,
    documents.LIST,
    documents.DETAIL,
    documents.EDIT,
  ],
  teacher: [
    // /naitei
    naitei.DETAIL,
    naitei.ACHIEVEMENT_DETAIL,
    naitei.TARGET_DETAIL,
    naitei.milestones.DETAIL,
    naitei.milestones.DETAIL_NO_PARAMS,
    naitei.POST_DETAIL,
    // documents
    documents.LIST,
    documents.DETAIL,
  ],
  client: [
    // /naitei
    naitei.DETAIL,
    naitei.ACHIEVEMENT_DETAIL,
    naitei.TARGET_DETAIL,
    naitei.milestones.DETAIL,
    naitei.milestones.DETAIL_NO_PARAMS,
    naitei.POST_DETAIL,
    // documents
    documents.LIST,
    documents.DETAIL,
  ],
};

export default async function middleware(req) {
  let role = null;
  const current_user = req.cookies.get("current_user");
  if (current_user) {
    role = JSON.parse(current_user).role;
  }
  const verify = req.cookies.get("token");
  const url = req.url;
  const pathname = req.nextUrl.pathname;

  if (!verify && !pathname.includes("/login")) {
    return NextResponse.redirect(new URL("/login", url));
  }
  if (verify) {
    if (pathname.includes("/login"))
      return NextResponse.redirect(new URL("/", url));
    else if (pathname === "/" && role !== "0") return NextResponse.next();
    else if (pathname === "/" && role === "0")
      return NextResponse.redirect(new URL("/settings/users/mentors", url));
    else if (pathname === "/settings/users" && role === 2)
      return NextResponse.redirect(new URL("/settings/users/naiteisha", url));
    else if (pathname === "/settings/users" && role !== 2)
      return NextResponse.redirect(new URL("/settings/users/mentors", url));
    else {
      switch (role) {
        case SUPER_ADMIN:
          if (
            privateRoute?.superAdmin
              .map((each) => each.test(pathname))
              .includes(true)
          )
            return NextResponse.next();
          else return NextResponse.redirect(new URL("/404", url));
        case NAITEISHA:
          if (
            privateRoute?.naiteisha
              .map((each) => each.test(pathname))
              .includes(true)
          )
            return NextResponse.next();
          else return NextResponse.redirect(new URL("/404", url));
        case MENTOR:
          if (
            privateRoute?.mentor
              .map((each) => each.test(pathname))
              .includes(true)
          )
            return NextResponse.next();
          else return NextResponse.redirect(new URL("/404", url));
        case TEACHER:
          if (
            privateRoute?.teacher
              .map((each) => each.test(pathname))
              .includes(true)
          )
            return NextResponse.next();
          else return NextResponse.redirect(new URL("/404", url));
        case CLIENT:
          if (
            privateRoute?.client
              .map((each) => each.test(pathname))
              .includes(true)
          )
            return NextResponse.next();
          else return NextResponse.redirect(new URL("/404", url));
        default:
          return NextResponse.redirect(new URL("/404", url));
      }
    }
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/naitei/:path*",
    "/settings/:path*",
    "/documents/:path*",
  ],
};
