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
  totalUsers: number;
  matchedUsers: number;
  matchPercentage: number;
  messagesSent: number;
  estimatedReach: number;
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
  message: string;
  usersProcessed: number;
  usersCreated: number;
  errors?: string[];
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
} 