import { goals, users } from "../@types/types";
import { sql } from "../postgreSQL/db";

export async function get_all_goals_by_user_id(user: users) {
  const user_id = user.id;

  const goals = await sql`
    SELECT * FROM goals 
    WHERE user_id = ${user_id};
  `;

  return goals;
}

export async function get_goals_by_id(user: Express.User, id: number | string) {
  const user_id = user.id;
  const [goals]: [goals] = await sql`
    SELECT * FROM goals
    WHERE id = ${id} and user_id = ${user_id} ;
  `;

  return goals;
}

export async function insert_goals(user: Express.User, goal: goals) {
  const [new_goals]: [goals] = await sql`
    INSERT INTO goals (user_id, description)
    VALUES (${user.id}, ${goal.description})
    RETURNING *;
  `;

  return new_goals;
}

export async function update_goals(user: Express.User, goal: goals) {
  const user_id = user.id;

  const [updated_goals]: [goals] = await sql`
    UPDATE goals 
    SET
      description = ${goal.description}
    WHERE id = ${goal.id} and user_id = ${user_id}
    RETURNING *;
  `;

  return updated_goals;
}

export async function delete_goals(
  user: Express.User,
  goal_id: number | string,
) {
  const user_id = user.id;

  const deleted_goals =
    await sql`DELETE FROM goals WHERE id = ${goal_id} and user_id = ${user_id} RETURNING *;`;

  return deleted_goals;
}
