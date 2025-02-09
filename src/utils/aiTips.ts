import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Order } from '../types';

const API_KEY = 'AIzaSyCyoasSyFVFvbh_wCZX6U6QAiq57nJqbOA';

export async function generateOrderTips(order: Order): Promise<string[]> {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const orderDetails = {
      startLocation: `${order.startLat}, ${order.startLng}`,
      endLocation: `${order.endLat}, ${order.endLng}`,
      packageWeight: `${order.packageWeight}kg`,
      deadline: order.deadline,
      routeDetails: order.routeDetails
        ? {
            distance: `${order.routeDetails.distance}km`,
            eta: `${order.routeDetails.eta} minutes`,
            trafficDelay: `${order.routeDetails.trafficDelay} minutes`,
            vehicleType: order.routeDetails.vehicleType,
            co2Emissions: `${order.routeDetails.co2Emissions}kg`,
            urgencyScore: order.routeDetails.urgencyScore,
          }
        : null,
    };

    const prompt = `You are a logistics manager and the order details are ${JSON.stringify(
      orderDetails,
      null,
      2
    )}. Now generate 3 tips about this order. Focus on practical advice regarding delivery timing, route optimization, and package handling. Make the tips specific to the order details provided Start every tip with an equal size.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = await response.text();

    // Split the output into separate tips and clean them up
    const tips = output
      .split(/\d\./)
      .filter((tip) => tip.trim())
      .map((tip) => tip.trim());

    return tips;
  } catch (error) {
    console.error('Error generating tips:', error);
    throw new Error('Failed to generate tips for the order');
  }
}
