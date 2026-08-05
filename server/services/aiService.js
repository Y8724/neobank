import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateSpendingInsights({ month, deposits, transfers, net, transactions }) {
  const transactionLines = transactions
    .slice(0, 20)
    .map(
      (tx) =>
        `- ${tx.type} of $${tx.amount.toFixed(2)} on ${new Date(tx.createdAt).toLocaleDateString()}`
    )
    .join("\n");

  const prompt = `
Based on this user's real transaction data for ${month}, write a short (3-4 sentence) plain-language summary of their spending activity this month. Be specific with the numbers given, warm but professional in tone, and call out one useful observation or pattern if one stands out. Do not give investment advice.

Monthly totals:
- Deposits: $${deposits.toFixed(2)}
- Transfers: $${transfers.toFixed(2)}
- Net change: $${net.toFixed(2)}

Recent transactions:
${transactionLines || "No transactions recorded this month."}
`.trim();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a concise, trustworthy financial insights assistant inside a banking app.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 180,
  });

  return response.choices[0].message.content.trim();
}
