import { financial_profiles } from "../@types/types";
import { sql } from "../postgreSQL/db";

export async function get_financial_profiles_by_user_id(user: Express.User) {
  const user_id = user.id;

  const [financial_profile]: [financial_profiles] = await sql`
    SELECT * FROM financial_profiles
    WHERE user_id = ${user_id};
  `;

  return financial_profile;
}

export async function update_financial_profiles(
  user: Express.User,
  financial_profile: financial_profiles,
) {
  const user_id = user.id;

  const [new_financial_profile]: [financial_profiles] = await sql`
    UPDATE financial_profiles
    SET 
      income = ${financial_profile.income},
      dividends_and_other_income = ${financial_profile.dividend_and_other_income}
    WHERE user_id = ${user_id}
    RETURNING *;
  `;

  return new_financial_profile;
}
