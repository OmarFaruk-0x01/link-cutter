import { data, Link, LoaderFunctionArgs, useLoaderData } from "react-router";
import LinkCard from "~/components/link-card";
import LinkForm from "~/components/link-form";
import { Button } from "~/components/ui/button";
import SiteHeader from "~/components/ui/site-header";
import { getShortDomainHost } from "~/lib/utils";
import { getLoggedInUser } from "./_auth+/auth.server";
import { getLinksByUser } from "./api/links.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getLoggedInUser(request, false);

  const links = user ? await getLinksByUser(user.id) : [];

  const shortHost = getShortDomainHost();

  return data({
    user,
    links,
    shortHost,
  });
};

export default function Home() {
  const loaderData = useLoaderData<typeof loader>();
  const { links, user, shortHost } = loaderData ?? {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
      <SiteHeader />

      {/* Main content container with glass effect */}
      <div className="relative max-w-xl mx-auto mb-12">
        {/* Input section */}
        <LinkForm />

        {/* Links section */}
        <div className="space-y-4">
          {links.map((link) => (
            <LinkCard key={link.id} link={link} shortHost={shortHost} />
          ))}
          {links.length < 3
            ? Array(3 - links.length)
                .fill(0)
                .map((link, index) => (
                  <LinkCard.Shimmer
                    key={index}
                    className="transform transition-all duration-300"
                  />
                ))
            : null}
        </div>
      </div>

      {/* Modern footer with glass effect */}
      <footer className="backdrop-blur-xl bg-white/50 rounded-2xl p-6 flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600 border border-gray-100/50">
        {user ? (
          <>
            <a href="#" className="text-sm text-gray-400 font-medium">
              {user?.name}
            </a>
            <span className="text-gray-300">•</span>
            <a href="#" className="text-sm text-gray-400 font-medium">
              {user?.email}
            </a>
            <span className="text-gray-300">•</span>
            <Link to="/auth/logout">
              <Button variant="link" className="!px-0 !text-xs">
                Logout
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/auth/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/auth/join">
              <Button size="sm" variant="default">
                Signup
              </Button>
            </Link>
          </>
        )}
        {/* <a href="#" className="hover:text-gray-900 transition-colors">
          Pricing
        </a>
        <span className="text-gray-300">•</span>
        <a href="#" className="hover:text-gray-900 transition-colors">
          Enterprise
        </a>
        <span className="text-gray-300">•</span>
        <a href="#" className="hover:text-gray-900 transition-colors">
          FAQ
        </a>
        <span className="text-gray-300">•</span>
        <a href="#" className="hover:text-gray-900 transition-colors">
          Legal
        </a>
        <span className="text-gray-300">•</span>
        <a href="#" className="hover:text-gray-900 transition-colors">
          Privacy
        </a> */}
      </footer>
    </div>
  );
}
