import jwt from 'jsonwebtoken';

interface CustomerPayload {
  name: string;
  email: string;
  id: string;
}

export function generateFeaturebaseToken(customer: CustomerPayload): string | null {
  if (!process.env.FEATUREBASE_SECRET) {
    // eslint-disable-next-line no-console
    console.error('FEATUREBASE_SECRET not found');
    return null;
  }

  if (!customer.name || !customer.email || !customer.id) {
    // eslint-disable-next-line no-console
    console.error('Invalid customer data provided');
    return null;
  }

  const customerData = {
    name: customer.name,
    email: customer.email,
    userId: customer.id,
  };

  try {
    return jwt.sign(customerData, process.env.FEATUREBASE_SECRET, {
      algorithm: 'HS256',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  }
}
