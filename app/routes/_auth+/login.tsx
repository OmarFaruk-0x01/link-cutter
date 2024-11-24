import {
  ActionFunction,
  data,
  Form,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
} from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Validator from "~/lib/validator";
import {
  createLoginSession,
  loginSchema,
  loginService,
  requireGuest,
} from "./auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireGuest(request);

  const title = "Welcome back";
  const subtitle = "Log in to your account to continue.";

  return data({ title, subtitle });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const validator = Validator.make(loginSchema, { email, password });

  await validator.validateAsync();

  if (!validator.valid()) {
    return data({
      status: 422,
      message: "Some fields has some validation issue",
      errors: validator.getErrors(),
    });
  }

  try {
    const user = await loginService({ email, password });
    const session = await createLoginSession(user, request);

    return redirect("/", {
      headers: {
        "set-cookie": session,
      },
    });
  } catch (err) {
    return data({
      status: 400,
      errors: {
        email: (err as Error).message,
        password: (err as Error).message,
      },
    });
  }
};

export default function LoginPage() {
  const data = useActionData();
  const validator = Validator.hydrateError(data?.errors);

  return (
    <Form method="post">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="m@example.com" required />
          {validator.hasError("email") ? (
            <p className="text-sm text-red-500">{validator.error("email")}</p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link to="#" className="ml-auto inline-block text-sm underline">
              Forgot your password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required />
          {validator.hasError("password") ? (
            <p className="text-sm text-red-500">{validator.error("email")}</p>
          ) : null}
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/auth/join" className="underline">
          Sign up
        </Link>
      </div>
    </Form>
  );
}
