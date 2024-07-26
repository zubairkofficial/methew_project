import React, { useState } from 'react';

const Dashboard = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://example.com/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      setResponse(data.reply || 'No response from server');
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      setResponse('Failed to send message');
    }
  };
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-12">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message"
            className="border border-gray-300 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-lg shadow hover:bg-blue-600 transition duration-200"
          >
            Send
          </button>
        </form>
        {response && (
          <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
            {response}
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
