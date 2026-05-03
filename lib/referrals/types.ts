export type ReferralStatus = 'pending' | 'signed_up' | 'converted' | 'rewarded';

export interface Referral {
  id: string;
  referrer_id: string;
  referee_id: string | null;
  referral_code: string;
  status: ReferralStatus;
  reward_given: boolean;
  created_at: string;
  signed_up_at: string | null;
  converted_at: string | null;
  rewarded_at: string | null;
}

export interface ReferralStats {
  code: string;
  totalReferred: number;
  signedUp: number;
  converted: number;
  rewarded: number;
  pendingRewards: number;
}

export interface ReferralCodeResult {
  code: string;
  isNew: boolean;
}
