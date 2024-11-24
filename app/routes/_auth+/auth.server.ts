import { eq } from "drizzle-orm";
import z from "zod";
import { database } from "~/database/context";
import { users } from "~/database/schema";
import bcrypt from "bcryptjs";
import { commitSession, getSession } from "./session.server";
import { redirect } from "react-router";

export type LoginData = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const loginService = async (
  loginData: LoginData,
): Promise<typeof users.$inferSelect> => {
  const db = database();
  const user = await db.query.users.findFirst({
    where: eq(users.email, loginData.email),
  });

  if (!user || !(user && verifyHash(loginData.password, user.password))) {
    throw Error("Invalid email or password");
  }

  return user;
};

export const createLoginSession = async (
  user: typeof users.$inferSelect,
  request: Request,
) => {
  const session = await getSession(request.headers.get("Cookie"));

  session.set("userId", String(user.id));

  return await commitSession(session);
};

export const getLoggedInUser = async (
  request: Request,
  shouldRedirect: boolean = true,
): Promise<Omit<typeof users.$inferSelect, "password"> | null> => {
  const session = await getSession(request.headers.get("Cookie"));

  if (shouldRedirect) await requireAuth(request);

  const userId = session.get("userId");

  if (!userId) {
    if (shouldRedirect) {
      throw redirect("/auth/login", {
        headers: {
          "set-cookie": await commitSession(session),
        },
      });
    }
    return null;
  }

  const db = database();

  const user = await db.query.users.findFirst({
    columns: {
      password: false,
    },
    where: eq(users.id, Number(userId)),
  });

  if (!user) {
    if (shouldRedirect) {
      throw redirect("/auth/login", {
        headers: {
          "set-cookie": await commitSession(session),
        },
      });
    }
    return null;
  }

  return user;
};

export const requireAuth = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) return;

  throw redirect("/auth/login");
};

export const requireGuest = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("userId")) return;

  throw redirect("/");
};

export type RegisterData = z.infer<typeof registerSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(5, "Minimum 5 charecter needed")
    .max(255, "Maximum 255 charecter"),
  email: z.string().email(),
  password: z.string(),
});

export const registerService = async (registerData: RegisterData) => {
  const db = database();

  const user = await db.query.users.findFirst({
    where: eq(users.email, registerData.email),
  });

  if (user) {
    throw new Error("Email is already used by other account");
  }

  registerData.password = createHash(registerData.password);

  await db.insert(users).values(registerData);

  return true;
};

export const createHash = (value: string) => {
  return bcrypt.hashSync(value, 10);
};

export const verifyHash = (value: string, hash: string) => {
  return bcrypt.compareSync(value, hash);
};
