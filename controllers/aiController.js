import { GoogleGenAI } from "@google/genai";
import Product from "../models/productModel.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const askInventoryAssistant = async (req, res) => {

  try {

    console.log("AI Controller reached");

    const { question } = req.body;

    const products = await Product.find()
                          .select("name sku quantity price");

    const inventoryData = products.map((product) => ({
  name: product.name,
  sku: product.sku,
  quantity: product.quantity,
  price: product.price,
}));

console.time("Gemini Response Time");

    const response = await ai.models.generateContent({
      //model: "gemini-3.8-flash",  taking too much time to answer, soo slow
      model: "gemini-3.5-flash-lite",
      contents: `You are an inventory management assistant. Answer using the inventory data below.

Inventory Data:
${JSON.stringify(inventoryData)}

User Question:
${question}`,
    });

    console.timeEnd("Gemini Response Time");

    res.json({
      answer: response.text,
    });

  } catch (error) {

    console.error("Gemini API error:", error.message);

    res.status(500).json({
      error: "Unable to process your question. Please try again.",
    });

  }
};