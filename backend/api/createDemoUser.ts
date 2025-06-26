// scripts/createDemoUser.ts
import { populateSnapshotsForUser } from "./middleware/monthy_snapshots";
import { sql } from "./postgreSQL/db";
import bcrypt from "bcrypt";

export async function createDemoUser() {
  const username = "demo_user";

  const saltOrRounds = 10;

  const hash = await bcrypt.hash("demo", saltOrRounds);

  const [user] = await sql`
    insert into users (username, hashed_password, email) 
    values (${username}, ${hash}, ${"email@email.com"}) 
    returning id`;

  const user_id = user.id;

  console.log(user_id);

  await sql.begin(async (sql) => {
    await sql`
      insert into financial_profiles (user_id, income, dividends_and_other_income)
      values (${user_id}, 6000, 500)`;

    await sql`
      insert into budget_allocations (user_id, percent_needs, percent_wants, percent_savings)
      values (${user_id}, 50, 30, 20)`;

    await sql`
      insert into expenses (user_id, category_id, description, expense_amount)
      values 
        (${user_id}, 1, 'Rent', 1500),
        (${user_id}, 2, 'Dining Out', 250),
        (${user_id}, 3, 'Investments', 400)
    `;

    await sql`
      insert into goals (user_id, description)
      values 
        (${user_id}, 'Emergency Fund'),
        (${user_id}, 'Vacation'),
        (${user_id}, 'New Laptop')
    `;

    populateSnapshotsForUser(user_id);
  });

  console.log("✅ Demo user, goals, expenses, and snapshots created");
}
