import { monthly_bonuses } from "../@types/types";
import { sql } from "../postgreSQL/db";

export async function get_all_monthly_bonuses(user: Express.User) {
  const user_id = user.id;

  const monthly_bonuses: [monthly_bonuses] = await sql`
    SELECT * FROM monthly_bonuses
    WHERE user_id = ${user_id};
  `;

  return monthly_bonuses;
}

export async function get_all_monthly_bonuses_by_id(
  user: Express.User,
  id: string | number,
) {
  const user_id = user.id;

  const [monthly_bonuses]: [monthly_bonuses] = await sql`
    SELECT * FROM monthly_bonuses
    WHERE id = ${id} and user_id = ${user_id};
  `;

  return monthly_bonuses;
}

export async function insert_monthly_bonuses(
  user: Express.User,
  monthly_bonuses: monthly_bonuses,
) {
  const user_id = user.id;

  const [new_monthly_bonuses]: [monthly_bonuses] = await sql`
    INSERT INTO monthly_bonuses (user_id, description, expense_amount)
    VALUES (${user_id}, ${monthly_bonuses.description},${monthly_bonuses.expense_amount} 
    RETURNING *;
  `;

  return new_monthly_bonuses;
}

export async function update_monthly_bonuses(
  user: Express.User,
  monthly_bonuses: monthly_bonuses,
) {
  const user_id = user.id;

  const [updated_monthly_bonuses]: [monthly_bonuses] = await sql`
    UPDATE monthly_bonuses
    SET 
      description = ${monthly_bonuses.description},
      expense_amount = ${monthly_bonuses.expense_amount}
    WHERE id = ${monthly_bonuses.id} and user_id = ${user_id}
    RETURNING *;
  `;

  return updated_monthly_bonuses;
}

export async function delete_monthly_bonuses(
  user: Express.User,
  id: string | number,
) {
  const user_id = user.id;

  const deleted_monthly_bonuses =
    await sql`DELETE FROM monthly_bonuses WHERE id = ${id} and user_id = ${user_id}`;

  return deleted_monthly_bonuses;
}
