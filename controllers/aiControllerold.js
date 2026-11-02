import Product from "../models/productModel.js";


export const askInventoryAssistant = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "Please enter a question.",
      });
    }

    const q = question.toLowerCase().trim();

    const products = await Product.find();

    let answer = "";

    const lowStockProducts = products.filter(
      (product) => product.quantity <= 5
    );

    const totalProducts = products.length;

    const totalUnits = products.reduce(
      (total, product) => total + product.quantity,
      0
    );

    const totalStockValue = products.reduce(
      (total, product) =>
        total + product.quantity * product.price,
      0
    );

    if (
      q.includes("low stock") ||
      q.includes("running low") ||
      q.includes("need restock")
    ) {
      answer =
        lowStockProducts.length > 0
          ? `I found ${lowStockProducts.length} products with low stock:\n\n` +
            lowStockProducts
              .map(
                (product) =>
                  `${product.name}: ${product.quantity} units remaining`
              )
              .join("\n")
          : "There are no low-stock products.";
    } else if (
      q.includes("total products") ||
      q.includes("how many products")
    ) {
      answer = `Your inventory contains ${totalProducts} different products.`;
    } else if (
      q.includes("total stock value") ||
      q.includes("inventory value") ||
      q.includes("stock worth")
    ) {
      answer = `The total inventory value is ₹${totalStockValue.toLocaleString("en-IN")}.`;
    } else if (
      q.includes("total quantity") ||
      q.includes("total units") ||
      q.includes("how many units")
    ) {
      answer = `You currently have ${totalUnits} units across all products.`;
    } else if (
      q.includes("most expensive") ||
      q.includes("highest price")
    ) {
     if (products.length === 0) {
  answer = "There are no products in your inventory yet.";
} else {

  //sort() modifies the original array which we don't want. So we make a shallow copy of products array using spread operator

	//Make a copy of the products array.
	//Sort the copied array from highest price to lowest price.
	//Select the first product.
	//Store that product in the variable product.

  const product = [...products].sort((a, b) => b.price - a.price)[0];

  //Format a number according to Indian numbering conventions.
  //en-IN specifies the Indian English locale.
  

  answer = `${product.name} is the most expensive product, priced at ₹${product.price.toLocaleString("en-IN")}.`;
}
 } else if (
      q.includes("list products") ||
      q.includes("show products") ||
      q.includes("all products")
    ) {
      answer =
        "Here is your product list:\n\n" +
        products
          .map(
            (product) =>
              `${product.name} - ${product.quantity} units`
          )
          .join("\n");
    } else {
      const matchedProduct = products.find((product) =>
        q.includes(product.name.toLowerCase())
      );

      if (matchedProduct) {
        answer = `${matchedProduct.name} has ${matchedProduct.quantity} units in stock. Its price is ₹${matchedProduct.price.toLocaleString("en-IN")}.`;
      } else {
        answer =
          "I couldn't understand that question yet. Try asking about low stock, total products, inventory value, total units, product prices, or a specific product.";
      }
    }

    res.json({ answer });
  } catch (error) {
    console.error("AI Assistant error:", error.message);

    res.status(500).json({
      error: "Unable to process your question. Please try again.",
    });
  }
};
