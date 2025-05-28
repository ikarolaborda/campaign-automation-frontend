'use client';

import { useState, useEffect } from 'react';
import { Campaign, CampaignStats } from '@/types';
import { useCampaigns } from '@/hooks/useCampaigns';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import CampaignDetails from './CampaignDetails';
import { 
  CalendarIcon, 
  UsersIcon, 
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  PauseIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

interface CampaignListProps {
  onRefresh?: () => void;
}

export default function CampaignList({ onRefresh }: CampaignListProps) {
  const { campaigns, loading, deleteCampaign, updateCampaign, getCampaignStats } = useCampaigns();
  const [campaignStats, setCampaignStats] = useState<Record<string, CampaignStats>>({});
  const [loadingStats, setLoadingStats] = useState<Record<string, boolean>>({});
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load stats for all campaigns
    campaigns.forEach(async (campaign) => {
      if (!campaignStats[campaign.id] && !loadingStats[campaign.id]) {
        setLoadingStats(prev => ({ ...prev, [campaign.id]: true }));
        try {
          const stats = await getCampaignStats(campaign.id);
          if (stats) {
            setCampaignStats(prev => ({ ...prev, [campaign.id]: stats }));
          }
        } catch (error) {
          console.warn(`Failed to get stats for campaign ${campaign.id}:`, error);
        }
        setLoadingStats(prev => ({ ...prev, [campaign.id]: false }));
      }
    });
  }, [campaigns, campaignStats, loadingStats, getCampaignStats]);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteCampaign(id);
        onRefresh?.();
      } catch {
        // Error is handled by the hook
      }
    }
  };

  const handleToggleStatus = async (campaign: Campaign) => {
    setUpdatingStatus(prev => ({ ...prev, [campaign.id]: true }));
    try {
      await updateCampaign(campaign.id, {
        ...campaign,
        isActive: !campaign.isActive
      });
      onRefresh?.();
    } catch (error) {
      console.error('Failed to update campaign status:', error);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [campaign.id]: false }));
    }
  };

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleCampaignUpdate = (updatedCampaign: Campaign) => {
    // Update the selected campaign for the modal
    setSelectedCampaign(updatedCampaign);
    // Trigger refresh to update the main list
    onRefresh?.();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new campaign.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Campaign Actions Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">All Campaigns</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRefresh?.()}
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            const stats = campaignStats[campaign.id];
            const isLoadingStats = loadingStats[campaign.id];
            const isUpdating = updatingStatus[campaign.id];

            return (
              <div
                key={campaign.id}
                className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4 min-h-[3rem]">
                  <div className="flex-1 min-w-0 pr-3">
                    <h3 className="text-lg font-medium text-gray-900 truncate leading-tight">
                      {campaign.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      {campaign.isActive ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1 flex-shrink-0" />
                      ) : (
                        <XCircleIcon className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${campaign.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                        {campaign.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex space-x-1">
                    <Button
                      variant={campaign.isActive ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleStatus(campaign)}
                      loading={isUpdating}
                      disabled={isUpdating}
                      className="!p-2"
                      title={campaign.isActive ? 'Pause Campaign' : 'Activate Campaign'}
                    >
                      {campaign.isActive ? (
                        <PauseIcon className="h-4 w-4" />
                      ) : (
                        <PlayIcon className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(campaign.id, campaign.name)}
                      className="!p-2"
                      title="Delete Campaign"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Target Audience</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <UsersIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Age: {campaign.targetAudience?.ageRange?.min || 0}-{campaign.targetAudience?.ageRange?.max || 0}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(campaign.targetAudience?.countries || []).map((country) => (
                        <span
                          key={country}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Audience Statistics</h4>
                  {isLoadingStats ? (
                    <div className="flex justify-center py-2">
                      <LoadingSpinner size="sm" />
                    </div>
                  ) : stats ? (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Matching Users</p>
                        <p className="font-medium text-gray-900">{(stats.totalMatchingUsers || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Messages Sent</p>
                        <p className="font-medium text-gray-900">{(stats.messagesSent || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Delivered</p>
                        <p className="font-medium text-gray-900">{(stats.messagesDelivered || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Opened</p>
                        <p className="font-medium text-gray-900">{(stats.messagesOpened || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Unable to load statistics</p>
                  )}
                </div>

                {/* Message Preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Message Template</h4>
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded break-words">
                    {(campaign.messageTemplate || '').length > 100
                      ? `${(campaign.messageTemplate || '').substring(0, 100)}...`
                      : (campaign.messageTemplate || 'No message template')
                    }
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center text-xs text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{formatDate(campaign.createdAt)}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(campaign)}
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Campaign Details"
          size="xl"
        >
          <CampaignDetails 
            campaign={selectedCampaign} 
            onClose={handleCloseModal}
            onUpdate={handleCampaignUpdate}
          />
        </Modal>
      )}
    </>
  );
} 