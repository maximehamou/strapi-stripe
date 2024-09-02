// @ts-nocheck
/* eslint-disable no-undef */
'use strict';

window.onload = () => {
  // for product Checkout
  const ssProduct = document.querySelectorAll('.SS_ProductCheckout');

  if (ssProduct) {
    ssProduct.forEach(product => {
      product.addEventListener('click', function handleClick(event) {
        SS_ProductCheckout(
          event.target.dataset.id,
          event.target.dataset.url,
          event.target.dataset.email,
          event.target.dataset.begins_from,
          event.target.dataset.ends_to,
          event.target.dataset.location,
          event.target.dataset.authenticated
        );
      });
    });
  }
  // for storing product payment order in strapi
  const params = new URLSearchParams(document.location.search);
  const checkoutSessionId = params.get('sessionId');
  if (checkoutSessionId) {
    SS_GetProductPaymentDetails(checkoutSessionId);
  }
};

// product Checkout logic

function SS_ProductCheckout(
  productId,
  baseUrl,
  userEmail,
  begins_from,
  ends_to,
  location,
  authenticated
) {
  localStorage.setItem('strapiStripeUrl', baseUrl);
  const getRedirectUrl =
    baseUrl +
    '/strapi-stripe/getRedirectUrl/' +
    productId +
    '/' +
    userEmail +
    '/' +
    begins_from +
    '/' +
    ends_to +
    '/' +
    location +
    '/' +
    authenticated;

  fetch(getRedirectUrl, {
    method: 'get',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  })
    .then(response => response.json())
    .then(response => {
      if (response.url) {
        window.location.replace(response.url);
      }
    });
}

//  storing product payment order in strapi logic

function SS_GetProductPaymentDetails(checkoutSessionId) {
  const baseUrl = localStorage.getItem('strapiStripeUrl');
  const retrieveCheckoutSessionUrl =
    baseUrl + '/strapi-stripe/retrieveCheckoutSession/' + checkoutSessionId;

  if (
    window.performance
      .getEntriesByType('navigation')
      .map(nav => nav.type)
      .includes('reload') || localStorage.getItem("visited") === document.location.search
  ) {
    console.info('website reloded');
  } else {
    localStorage.setItem("visited", document.location.search)

    fetch(retrieveCheckoutSessionUrl, {
      method: 'get',
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json',
        isfromcheckout: 'true',
      }),
    });
  }
}
