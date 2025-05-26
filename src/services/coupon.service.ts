import api from "@/lib/api-client";

export const redeemCoupon = async (code: string) => {
  return api.post("/coupon/redeem", { code });
};
