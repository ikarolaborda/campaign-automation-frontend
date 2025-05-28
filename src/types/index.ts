export interface Campaign {
  id: string;
  name: string;
  targetAudience: {
    ageRange: {
      min: number;
      max: number;
    };
    countries: string[];
  };
  messageTemplate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignDto {
  name: string;
  targetAudience: {
    ageRange: {
      min: number;
      max: number;
    };
    countries: string[];
  };
  messageTemplate: string;
}

export interface CampaignStats {
  campaignId: string;
  campaignName: string;
  totalMatchingUsers: number;
  messagesSent: number;
  messagesDelivered: number;
  messagesOpened: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  country: string;
  createdAt: string;
}

export interface UploadResponse {
  count: number;
  message: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
} 