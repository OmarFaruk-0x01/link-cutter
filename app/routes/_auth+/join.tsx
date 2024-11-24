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
import { registerSchema, registerService, requireGuest } from "./auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireGuest(request);

  const title = "Welcome back";
  const subtitle = "Log in to your account to continue.";

  return data({ title, subtitle });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = String(formData.get("name"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const validator = Validator.make(registerSchema, { name, email, password });

  await validator.validateAsync();

  if (!validator.valid()) {
    return data({
      status: 422,
      message: "Some fields has some validation issue",
      errors: validator.getErrors(),
    });
  }

  try {
    await registerService({ name, email, password });
    return redirect("/auth/login", 302);
  } catch (error) {
    return data({
      status: 400,
      message: (error as Error).message,
      errors: {
        email: (error as Error).message,
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
          <Label htmlFor="email">Name</Label>
          <Input id="name" name="name" placeholder="Jhon Doe" required />
          {validator.hasError("name") ? (
            <p className="text-sm text-red-500">{validator.error("name")}</p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="m@example.com" required />
          {validator.hasError("email") ? (
            <p className="text-sm text-red-500">{validator.error("email")}</p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="+++++++++++"
            required
          />
          {validator.hasError("password") ? (
            <p className="text-sm text-red-500">
              {validator.error("password")}
            </p>
          ) : null}
        </div>
        <Button type="submit" className="w-full">
          Signup
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link to="/auth/login" className="underline">
          Sign in
        </Link>
      </div>
    </Form>
  );
}
