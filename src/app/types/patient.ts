export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

export type Patient = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string; 
  status: Status;
  address: Address;
  createdAt: string; 
  updatedAt: string;
  isDeleted: boolean;
};

export const STATUS_OPTIONS = ['Inquiry', 'Onboarding', 'Active', 'Churned'] as const;
export type Status = (typeof STATUS_OPTIONS)[number];

