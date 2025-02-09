import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send, Bot } from 'lucide-react';
import type { Order } from '../types';

interface ChatbotProps {
  orders: Order[];
}

const Chatbot: React.FC<ChatbotProps> = ({ orders }) => {
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // To control the chatbot's visibility

  useEffect(() => {
    if (!isOpen) {
      setMessages([]); // Clear messages when the chatbot is closed
    }
  }, [isOpen]);

  const analyzeData = (query: string) => {
    // Prepare data insights for the AI
    const totalOrders = orders.length;
    const completedOrders = orders.filter(
      (order) => order.status === 'completed'
    ).length;
    const inProgressOrders = orders.filter(
      (order) => order.status === 'in-progress'
    ).length;
    const pendingOrders = orders.filter(
      (order) => order.status === 'pending'
    ).length;
    const cancelledOrders = orders.filter(
      (order) => order.status === 'cancelled'
    ).length;

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.payment.amount,
      0
    );
    const totalRemainingAmount = orders.reduce(
      (sum, order) => sum + order.payment.remainingAmount,
      0
    );

    const lateDeliveries = orders.filter(
      (order) =>
        new Date(order.deadline) < new Date() && order.status !== 'completed'
    ).length;

    const averagePackageWeight =
      orders.length > 0
        ? orders.reduce((sum, order) => sum + order.packageWeight, 0) /
          orders.length
        : 0;

    return `Based on our logistics data:
        - We have a total of ${totalOrders} orders.
        - ${completedOrders} orders are completed, ${inProgressOrders} are in progress, ${pendingOrders} are pending, and ${cancelledOrders} are cancelled.
        - Total revenue is ₹${totalRevenue.toFixed(2)}.
        - Total remaining amount to be collected is ₹${totalRemainingAmount.toFixed(
          2
        )}.
        - There are ${lateDeliveries} late deliveries.
        - The average package weight is ${averagePackageWeight.toFixed(2)} kg.

        User Query: ${query}

        Please analyze this data and provide insights related to the user's question. Keep the response concise and focused on the data. Focus on orders based analysis only.
        `;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setInput('');
    setIsLoading(true);

    try {
      // Note: In a real application, you would need to provide your Gemini API key
      const genAI = new GoogleGenerativeAI(
        'AIzaSyCyoasSyFVFvbh_wCZX6U6QAiq57nJqbOA'
      );
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = analyzeData(userMessage);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [...prev, { text, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: 'Sorry, I encountered an error. Please try again later.',
          isUser: false,
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md"
      >
        {isOpen ? 'Close Chatbot' : 'Open Chatbot'}
      </button>

      {isOpen && (
        <div className="w-96 bg-white rounded-lg shadow-lg mt-2">
          <div className="p-4 border-b flex items-center gap-2">
            <Bot className="text-blue-500" />
            <h3 className="font-semibold">Logistics Assistant</h3>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-gray-500 text-sm">
                Try asking questions like:
                <ul className="mt-2 space-y-1">
                  <li>• How many orders are completed?</li>
                  <li>• What is the total revenue generated?</li>
                  <li>• How many orders are currently in progress?</li>
                  <li>• What is the average package weight?</li>
                </ul>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  Analyzing data...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your logistics data..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
