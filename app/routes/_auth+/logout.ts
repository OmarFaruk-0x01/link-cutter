import {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "react-router";
import { destroySession, getSession } from "./session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("cookie"));

  return redirect("/", {
    headers: { "set-cookie": await destroySession(session) },
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("cookie"));

  return redirect("/", {
    headers: { "set-cookie": await destroySession(session) },
  });
};
