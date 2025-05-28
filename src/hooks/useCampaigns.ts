import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { Campaign, CreateCampaignDto, CampaignStats } from '@/types';
import toast from 'react-hot-toast';

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Campaign[]>('/campaigns');
      setCampaigns(response.data);
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch campaigns';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCampaign = useCallback(async (campaignData: CreateCampaignDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<Campaign>('/campaigns', campaignData);
      setCampaigns(prev => [response.data, ...prev]);
      toast.success('Campaign created successfully!');
      return response.data;
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create campaign';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCampaign = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/campaigns/${id}`);
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
      toast.success('Campaign deleted successfully!');
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete campaign';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCampaignStats = useCallback(async (id: string): Promise<CampaignStats | null> => {
    try {
      const response = await apiClient.get<CampaignStats>(`/campaigns/${id}/stats`);
      return response.data;
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch campaign stats';
      toast.error(errorMessage);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    deleteCampaign,
    getCampaignStats,
  };
}; 