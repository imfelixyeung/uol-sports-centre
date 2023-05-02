export const productTypes = [
  'Facility',
  'Activity',
  'Session',
  'Membership',
] as const;
export type ProductType = (typeof productTypes)[number];

/** GET /discount/change/<int:amount> */
export type ChangeDiscountRequest = {
  amount: number;
};
export type ChangeDiscountResponse = void;

/** GET /sales/<string:product_type> */
export type GetSalesRequest = {
  productType: ProductType;
};
export type GetSalesResponse = {
  product_name: string;
  product_type: string;
  units_sold: number;
  total_sales: number;
}[];

/** POST /checkout-session/ */

export type CheckoutSessionItem =
  | {
      type: 'activity' | 'session';
      data: {
        event: number;
        starts: string;
      };
    }
  | {
      type: 'Membership-Yearly' | 'Membership-Monthly';
      data: {
        event: number;
        starts: string;
      };
    };

export interface CheckoutSessionMetadata {
  successUrl: string;
  cancelUrl: string;
}

export type CheckoutSessionRequest = {
  items: CheckoutSessionItem[];
  metadata: CheckoutSessionMetadata;
  user: number;
};
export type CheckoutSessionResponse = {
  Checkout: string;
};

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
export type GetCustomerPortalResponse = {
  Portal: string;
};

/** POST /change-price */
export type ChangePriceRequest = {
  price: number;
  productName: string;
};
export type ChangePriceResponse = void;

/** GET /get-prices/<string:product_type> */
export type GetPricesRequest = {
  productType: ProductType;
};
export type GetPricesResponse = {
  price: string;
  productName: string;
}[];

/** GET /cancel-membership/<int:user_id> */
export type CancelMembershipRequest = {
  userId: number;
};
export type CancelMembershipResponse = void;

/** GET /receipt/<int:booking_id> */
export type GetReceiptRequest = {
  bookingId: number;
};
export type GetReceiptResponse = void;
