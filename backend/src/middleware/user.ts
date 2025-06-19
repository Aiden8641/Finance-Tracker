import { Request, Response, NextFunction } from "express";
import { sql } from "../postgreSQL/db";
import { user, userResponse, livingCostsResponse } from "../@types/user";
import { financialRequest } from "../@types/request";

export function sanitizeUser(user: userResponse) {
  const { hashed_password, ...safeUser } = user;

  return safeUser;
}

export async function verifyUserPayload(
  req: financialRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.body.userUpdate) {
      res.json({ message: "Payload to update user missing!" });
      return;
    }

    const userId = req.body.userUpdate.id;

    const sessionUserId = req.user?.id;

    if (userId !== sessionUserId) {
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

export async function updateUser(user: user) {
  const [updatedUser]: [userResponse] = await sql`
    UPDATE users
    SET
      non_liquid_assets = ${user.non_liquid_assets},
      liquid_assets = ${user.liquid_assets},
      savings = ${user.savings},
      checking = ${user.checking},
      debt = ${user.debt},
      monthly_income = ${user.monthly_income},
      other_income = ${user.other_income},
      bonuses = ${user.bonuses}
    WHERE id = ${user.id}
    RETURNING *;
  `;

  const safeUser = sanitizeUser(updatedUser);

  return safeUser;
}

export async function getAvailableIncomeByUserId(userId: string) {
  const [availableIncome]: [{ available_income: string }] = await sql`
    SELECT available_income FROM users 
    WHERE id = ${userId};
  `;

  return availableIncome;
}

export async function updateAvailableIncomeByUserId(userId: string) {
  const [getLivingCosts] = await sql`
    SELECT * from lilvingCosts 
  `;

  const keys: (keyof livingCostsResponse)[] = [
    "rent",
    "bills",
    "insurance",
    "transportation",
    "debt_payments",
    "groceries",
    "buffer_amount",
  ];

  const totalLivingCosts = keys.reduce(
    (sum, key) => sum + parseInt(getLivingCosts[key] as string),
    0,
  );

  const [user]: [userResponse] = await sql`
    SELECT monthly_income, other_income, bonuses from users
    WHERE id = ${userId};
  `;
  //TODO: fix this
  //
  // const totalIncome =
  //   parseInt(user.monthly_income) +
  //   parseInt(user.other_income) +
  //   parseInt(user.bonuses);

  // const [updateAvailableIncome]: [user] = await sql`
  //   UPDATE users
  //   SET
  //     available_income = ${totalIncome - totalLivingCosts}
  //   WHERE id = ${userId}
  //   RETURNING *;
  // `;
  // console.log({
  //   user: updateAvailableIncome,
  // });

  return { user: null };
}
