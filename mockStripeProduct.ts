interface StripeProduct {
  id: string;
  object: "product";
  active: boolean;
  created: number;
  default_price: string | null;
  description: string | null;
  images: string[];
  livemode: boolean;
  metadata: Record<string, string>;
  name: string;
  package_dimensions: null | {
    height: number;
    length: number;
    weight: number;
    width: number;
  };
  shippable: boolean | null;
  statement_descriptor: string | null;
  tax_code: string | null;
  unit_label: string | null;
  updated: number;
  url: string | null;
}

class MockStripeProduct implements StripeProduct {
  id: string;
  object: "product" = "product";
  active: boolean;
  created: number;
  default_price: string | null;
  description: string | null;
  images: string[];
  livemode: boolean;
  metadata: Record<string, string>;
  name: string;
  package_dimensions: null;
  shippable: boolean | null;
  statement_descriptor: string | null;
  tax_code: string | null;
  unit_label: string | null;
  updated: number;
  url: string | null;

  constructor(data: Partial<StripeProduct>) {
    this.id = data.id || `prod_${Math.random().toString(36).substr(2, 9)}`;
    this.active = data.active ?? true;
    this.created = data.created || Math.floor(Date.now() / 1000);
    this.default_price = data.default_price || null;
    this.description = data.description || null;
    this.images = data.images || [];
    this.livemode = data.livemode ?? false;
    this.metadata = data.metadata || {};
    this.name = data.name || "Default Product Name";
    this.package_dimensions = null;
    this.shippable = data.shippable ?? null;
    this.statement_descriptor = data.statement_descriptor || null;
    this.tax_code = data.tax_code || null;
    this.unit_label = data.unit_label || null;
    this.updated = data.updated || Math.floor(Date.now() / 1000);
    this.url = data.url || null;
  }

  // Mock methods that simulate Stripe API behavior
  static async create(
    data: Partial<StripeProduct>
  ): Promise<MockStripeProduct> {
    return new MockStripeProduct(data);
  }

  static async retrieve(id: string): Promise<MockStripeProduct> {
    return new MockStripeProduct({ id });
  }

  async update(data: Partial<StripeProduct>): Promise<MockStripeProduct> {
    Object.assign(this, data);
    this.updated = Math.floor(Date.now() / 1000);
    return this;
  }

  async delete(): Promise<{ deleted: boolean; id: string }> {
    return {
      deleted: true,
      id: this.id,
    };
  }
}

// Example usage:
const createMockProduct = async () => {
  const product = await MockStripeProduct.create({
    name: "Premium Membership",
    description: "Access to premium features",
    metadata: {
      category: "membership",
      tier: "premium",
    },
  });
  return product;
};

// Example of getting a product ID
const getProductId = async () => {
  const product = await createMockProduct();
  console.log("Product ID:", product.id); // This will show a randomly generated ID like 'prod_abc123xyz'
  return product.id;
};

export { MockStripeProduct, createMockProduct, getProductId };
export type { StripeProduct };
