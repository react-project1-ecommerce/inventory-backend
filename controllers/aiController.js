import { GoogleGenAI } from "@google/genai";
import Product from "../models/productModel.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

//add Business Rules for this software for Gemini so that the business rules are separate from the Gemini request logic.


const inventoryAssistantInstructions = `
You are an intelligent inventory management assistant.

Business Rules:
1. In Stock: Quantity greater than 5.
2. Low Stock: Quantity 5 or less.

Always follow these rules when answering questions about stock.
Use the provided inventory data for factual answers.

  For count questions, provide only the final count in one short sentence. Do not include calculations, explanations, or product lists.
`;

export const askInventoryAssistant = async (req, res) => {

  try {

    //console.log("AI Controller reached");

    const { question } = req.body;

    const products = await Product.find()
                          .select("name sku quantity price");

    const inventoryData = products.map((product) => ({
  name: product.name,
  sku: product.sku,
  quantity: product.quantity,
  price: product.price,
}));

//console.time("Gemini Response Time");

    const response = await ai.models.generateContent({

      //model: "gemini-3.8-flash",  taking too much time to answer, soo slow
      model: "gemini-3.5-flash-lite",
      contents: `${inventoryAssistantInstructions}

Inventory Data:

${JSON.stringify(inventoryData)}

User Question:
${question}`,
    });

    //console.timeEnd("Gemini Response Time");

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


//AI Inventory Insights

export const getInventoryInsights = async (req, res) => {
  try {
    const products = await Product.find()
      .select("name sku quantity price");

    if (products.length === 0) {
      return res.json({
        insights: "No products found in your inventory.",
      });
    }

    const inventoryData = products.map((product) => ({
      name: product.name,
      sku: product.sku,
      quantity: product.quantity,
      price: product.price,
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `${inventoryAssistantInstructions}

Analyze the following inventory and provide 3 to 5 useful insights.

Focus on:
- Products with stock quantities of 5 or less.
- Products that may need attention.
- Other useful observations supported by the inventory data.

Do not invent sales trends, demand, reorder levels, or missing information.

Keep the insights concise and actionable.
Use bullet points.

Inventory Data:
${JSON.stringify(inventoryData)}`,
    });

    res.json({ insights: response.text });

  } catch (error) {
    console.error("Inventory insights error:", error.message);

    res.status(500).json({
      error: "Unable to generate inventory insights. Please try again.",
    });
  }
};