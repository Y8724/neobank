export default function AccountCard({ account }) {
  return (
    <div className="border p-4 rounded shadow mb-4">
      <h2 className="font-bold">Account ID: {account.id}</h2>
      <p>Type: {account.type}</p>
      <p>Balance: ${account.balance}</p>
      <p>Transactions: {account.transactions.length}</p>
    </div>
  );
}
