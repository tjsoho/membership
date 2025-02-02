export const PROMO_CODES = {
  'TOBYRATES101': 'promo_1QnexaKYNGRKelfX23gRFeXB',
  'EARLYBIRD': 'promo_another_id_here',
  'SPECIAL50': 'promo_different_id_here',
  // Add more codes as needed
} as const;

export type PromoCodeKey = keyof typeof PROMO_CODES; 