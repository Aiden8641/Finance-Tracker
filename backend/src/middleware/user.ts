import { Request, Response, NextFunction } from "express";
import { sql } from "../postgreSQL/db";
import { users, usersResponse } from "../@types/types";

export function sanitizeUser(user: usersResponse) {
  const { hashed_password, ...safeUser } = user;

  return safeUser;
}

export async function verifyUserPayload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.body) {
      res.json({ message: "Payload to update user missing!" });
      return;
    }

    const body = req.body as users;
    const user_id = body.id;

    const sessionUserId = req.user?.id;

    if (user_id !== sessionUserId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

// Unescessary as passport deserializes user, pretty much the same as below.
// Uncomment if this is needed later
// export async function getUserById(id: string) {
//   const [user] = await sql`SELECT * FROM users WHERE id = ${id}`;
//
//   return user;
// }

export async function updateUser(user: users) {
  const [updated_user]: [usersResponse] = await sql`
    UPDATE users
    SET
      email = ${user.email},
      username = ${user.username}
    WHERE id = ${user.id}
    RETURNING *;
  `;

  const safeUser = sanitizeUser(updated_user);

  return safeUser;
}
