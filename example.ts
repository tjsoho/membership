import { MockStripeProduct, getProductId } from "./mockStripeProduct";

async function main() {
  // Method 1: Using the getProductId helper function
  const productId1 = await getProductId();
  console.log("Product ID from helper:", productId1);

  // Method 2: Creating a product and getting its ID directly
  const product = await MockStripeProduct.create({
    name: "Premium Plan",
    description: "Monthly premium subscription",
    metadata: {
      plan: "premium",
      interval: "monthly",
    },
  });
  console.log("Product ID from direct creation:", product.id);

  // Method 3: Retrieving an existing product by ID
  const retrievedProduct = await MockStripeProduct.retrieve(product.id);
  console.log("Retrieved product ID:", retrievedProduct.id);
}

// Run the example
main().catch(console.error);
