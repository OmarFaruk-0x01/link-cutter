import { ActionFunctionArgs, data, redirect } from "react-router";
import { removeByShortCode } from "./links.server";
import { requireAuth } from "../_auth+/auth.server";

export const loader = () => redirect("/");

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await requireAuth(request);

  const code = params["code"] as string;

  const removed = await removeByShortCode(code);

  if (!removed) {
    return data({
      message: "Somthing went wrong. Link is not created",
      errors: {},
    });
  }

  return data({
    ok: true,
    message: "Your Link is removed",
  });
};
