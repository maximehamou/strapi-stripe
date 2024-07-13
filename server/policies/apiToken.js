'use strict';

module.exports = async (policyContext, config, { strapi }) => {
  const authorizationHeader = policyContext.request.header.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    console.log('Authorization header missing or incorrect');
    return false;
  }

  const bearerToken = authorizationHeader.substring('Bearer '.length);

  if (!bearerToken) {
    console.log('Bearer token missing');
    return false;
  }

  const apiTokenService = strapi.services['admin::api-token'];
  const accessKey = await apiTokenService.hash(bearerToken);
  const storedToken = await apiTokenService.getBy({ accessKey });

  if (!storedToken) {
    console.log('Stored token not found');
    return false;
  }

  if (storedToken.expiresAt && storedToken.expiresAt < new Date()) {
    console.log('Token expired');
    return false;
  }

  if (storedToken.type === 'full-access') {
    console.log('Token has full access');
    return true;
  }

  if (storedToken.type === 'custom' && (policyContext.request.url.includes("getProduct") || policyContext.request.url.includes("retrieveCheckoutSession"))) {
    console.log('Token has a custom access (ok for getProduct)');
    return true;
  }

  console.log('Token type not authorized');
  return false;
};
