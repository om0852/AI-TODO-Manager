import { auth } from "@clerk/nextjs/server";

export const getCurrentUser = async() => {
  const user = await auth();
  if (!user) {
    throw new Error("Unauthorized User");
  }
  return user;
};
