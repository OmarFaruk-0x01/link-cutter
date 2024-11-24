import { LoaderFunctionArgs, redirect } from "react-router";
import { getLinkByShortCode } from "./api/links.server";

export const loader = async ({
  request,
  context,
  params,
}: LoaderFunctionArgs) => {
  const code = params["*"] as string;

  const link = await getLinkByShortCode(code);

  if (!link) {
    return redirect(`/`);
  }

  // Save some clicks and analytics here
  // .....
  return redirect(link.link, { status: 301 });
};
