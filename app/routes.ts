import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/home.tsx"),
  route("/api/links", "routes/api/links.ts"),
  route("/api/links/:code/delete", "routes/api/links.$code.delete.ts"),
  route("/auth", "routes/_auth+/_auth.tsx", [
    route("login", "routes/_auth+/login.tsx"),
    route("join", "routes/_auth+/join.tsx"),
    route("logout", "routes/_auth+/logout.ts"),
  ]),
  route("/*", "routes/$code.ts"),
] satisfies RouteConfig;
