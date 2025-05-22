export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-white text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Checkout Successful!
      </h1>
      <p className="text-gray-700 text-lg max-w-md mb-6">
        Thank you for your purchase. Your ticket has been successfully reserved.
        You can view your transaction details in the “My Transactions” page.
      </p>
      <div className="flex gap-4">
        <a
          href="/transactions"
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          View My Transactions
        </a>
        <a
          href="/events"
          className="px-5 py-2 border border-gray-300 text-gray-800 rounded-md hover:bg-gray-100 transition"
        >
          Back to Events
        </a>
      </div>
    </div>
  );
}
