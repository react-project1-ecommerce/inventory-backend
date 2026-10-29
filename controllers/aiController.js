import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//The backend receives a question from the user.
//OpenAI's gpt-4o-mini model processes it.
//The backend returns the AI's answer.


export const askInventoryAssistant = async (req, res) => {

  try {

    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "Please enter a question.",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: question,
    });

    res.json({
      answer: response.output_text,
    });
    
  } catch (error) {
    console.error("AI Assistant error:", error.message);

    res.status(500).json({
      error: "Unable to get an AI response. Please try again.",
    });
  }
};
