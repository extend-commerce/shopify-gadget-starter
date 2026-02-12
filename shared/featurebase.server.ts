import jwt from 'jsonwebtoken';

export function generateFeaturebaseToken(customer: { name: string; email: string; id: string }) {
  if (!process.env.FEATUREBASE_SECRET) {
    console.error('FEATUREBASE_SECRET not found'); // eslint-disable-line no-console
    return null;
  }

  if (!customer.name || !customer.email || !customer.id) {
    console.error('Invalid customer data provided'); // eslint-disable-line no-console
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
    console.error(error); // eslint-disable-line no-console
    return null;
  }
}
