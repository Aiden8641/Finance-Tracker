import { budget_allocations, financial_profiles, users } from "../@types/types";
import { sql } from "../postgreSQL/db";
import { get_financial_profiles_by_user_id } from "./financial_profiles";

export async function get_snapshots(user: Express.User) {
  const user_id = user.id;

  const snapshots = await sql`
    SELECT * FROM budget_monthly_snapshots
    WHERE user_id = ${user_id};
  `;

  return snapshots;
}
// utils/populateSnapshots.ts

export async function populateSnapshotsForUser(user_id: number) {
  const snapshots = Array.from({ length: 12 }, (_, i) => {
    const baseIncome = 5000 + i * 100;
    const expenses = baseIncome * (0.7 + Math.random() * 0.1);

    return {
      user_id,
      income: Math.round(baseIncome),
      total_expenses: Math.round(expenses),
      percent_needs: 50,
      percent_wants: 30,
      percent_savings: 20,
    };
  });

  try {
    await sql.begin(
      (sql) =>
        sql`
        insert into budget_monthly_snapshots ${sql(snapshots, "user_id", "income", "total_expenses", "percent_needs", "percent_wants", "percent_savings")}
      `,
    );
    console.log(`✅ Created 12 snapshots for user ${user_id}`);
  } catch (err) {
    console.error("❌ Failed to insert snapshots:", err);
  } finally {
    await sql.end();
  }
}

export async function snapshot() {
  const users: { id: number }[] = await sql`select id from users`;

  for (let i = 0; i < users.length; i++) {
    const user_id = users[i].id;

    const [expenseSum] = await sql`
      select coalesce(sum(expense_amount), 0) as sum from expenses
      where user_id = ${user_id};
    `;

    const [profile] = await sql`
      select * from financial_profiles 
      where user_id = ${user_id};
    `;

    const [alloc] = await sql`
      select * from budget_allocations 
      where user_id = ${user_id};
    `;

    if (!profile || !alloc) continue; // skip if incomplete

    const income =
      Number(profile.income || 0) +
      Number(profile.dividend_and_other_income || 0);
    const expenses = Number(expenseSum.sum || 0);

    await sql`
      insert into budget_monthly_snapshots (
        user_id, income, total_expenses, percent_needs, percent_wants, percent_savings 
      )
      values (
        ${user_id}, ${Math.round(income)}, ${Math.round(expenses)},
        ${alloc.percent_needs}, ${alloc.percent_wants}, ${alloc.percent_savings}
      )
    `;
  }

  console.log("✅ Monthly snapshots recorded");
}
