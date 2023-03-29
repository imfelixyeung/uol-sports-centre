export const productTypes = [
  'facility',
  'activity',
  'session',
  'membership',
] as const;
export type ProductType = (typeof productTypes)[number];

/** GET /discount/change/<int:amount> */
export type UpdateDiscountRequest = {
  amount: number;
};
export type UpdateDiscountResponse = void;

/** GET /sales/<string:product_type> */
export type GetSalesRequest = {
  productType: ProductType;
};
export type GetSalesResponse = void;

/** POST /checkout-session/ */

export type CheckoutSessionRequest = void;
export type CheckoutSessionResponse = void;

/** POST /make-purchasable */

export type MakePurchasableRequest = void;
export type MakePurchasableResponse = void;

/** GET /purchased-products/<int:user_id> */
export type GetPurchasedProductsRequest = {
  userId: number;
};

/** GET /customer-portal/<int:user_id> */
export type GetCustomerPortalRequest = {
  userId: number;
};
export type GetCustomerPortalResponse = string;

/** POST /change-price */
export type ChangePriceRequest = void;
export type ChangePriceResponse = void;

/** GET /get-prices/<string:product_type> */
export type GetPricesRequest = {
  productType: ProductType;
};
export type GetPricesResponse = void;

/** GET /cancel-membership/<int:user_id> */
export type CancelMembershipRequest = {
  userId: number;
};
export type CancelMembershipResponse = void;

/** GET /refund/<int:booking_id> */
export type RefundRequest = {
  bookingId: number;
};
export type RefundResponse = void;

/** GET /receipt/<int:booking_id> */
export type GetReceiptRequest = {
  bookingId: number;
};
export type GetReceiptResponse = void;

/** POST /initialise-payments */
export type InitialisePaymentsRequest = void;
export type InitialisePaymentsResponse = void;
