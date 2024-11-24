import { Outlet, useMatches } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function AuthLayout() {
  const matches = useMatches().at(-1)?.data as {
    title: string;
    subtitle: string;
  };
  const { title, subtitle } = matches ?? {};

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto min-w-96 bg-white z-20">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
}
