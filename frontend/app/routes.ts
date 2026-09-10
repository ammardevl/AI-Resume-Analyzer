import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),
  route("/upload", "routes/upload.tsx"),
  route("/previous", "routes/previous.tsx"),
  route("/resume/:id", "routes/resume.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
