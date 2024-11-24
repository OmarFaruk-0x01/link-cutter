import { ActionFunctionArgs, data, redirect } from "react-router";
import Validator from "~/lib/validator";
import { createLinkByUser, linkSchema } from "./links.server";
import { commitSession, getSession } from "../_auth+/session.server";
import { getLoggedInUser, requireAuth } from "../_auth+/auth.server";

export const loader = () => redirect("/");

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAuth(request);

  const url = String((await request.formData()).get("url"));

  const validator = Validator.make(linkSchema, { url });

  await validator.validateAsync();

  if (!validator.valid()) {
    return data({
      message: "Url is not valid",
      errors: validator.getErrors(),
    });
  }

  const user = await getLoggedInUser(request);

  const link = await createLinkByUser(user.id, { url });

  if (!link) {
    return data({
      message: "Somthing went wrong. Link is not created",
      errors: {},
    });
  }

  return data({
    ok: true,
    message: "Your Link becomes small successfully",
  });
};
