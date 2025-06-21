import { Request, Response, NextFunction } from "express";
import { sql } from "../postgreSQL/db";
import { users, usersResponse } from "../@types/types";

export function sanitizeUser(user: usersResponse) {
  const { hashed_password, ...safeUser } = user;

  return safeUser;
}

export async function get_user_by_username(username: string) {
  const [user]: [users] = await sql`
    SELECT * FROM users
    WHERE username = ${username};
  `;

  return user;
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
