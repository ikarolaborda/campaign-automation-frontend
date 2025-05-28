'use client';

import { useState, useEffect } from 'react';
import { Campaign, CampaignStats } from '@/types';
import { useCampaigns } from '@/hooks/useCampaigns';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { 
  CalendarIcon, 
  UsersIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  GlobeAltIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';

interface CampaignDetailsProps {
  campaign: Campaign;
  onClose?: () => void;
  onUpdate?: (updatedCampaign: Campaign) => void;
}

export default function CampaignDetails({ campaign, onClose, onUpdate }: CampaignDetailsProps) {
  const { getCampaignStats, updateCampaign } = useCampaigns();
  const [currentCampaign, setCurrentCampaign] = useState(campaign);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    setCurrentCampaign(campaign);
  }, [campaign]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoadingStats(true);
        const campaignStats = await getCampaignStats(currentCampaign.id);
        setStats(campaignStats);
      } catch (error) {
        console.warn('Failed to load campaign stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [currentCampaign.id, getCampaignStats]);

  const handleToggleStatus = async () => {
    try {
      setUpdatingStatus(true);
      const updatedCampaign = await updateCampaign(currentCampaign.id, {
        ...currentCampaign,
        isActive: !currentCampaign.isActive
      });
      setCurrentCampaign(updatedCampaign);
      onUpdate?.(updatedCampaign);
    } catch (error) {
      console.error('Failed to update campaign status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Campaign Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentCampaign.name}</h2>
            <div className="flex items-center">
              {currentCampaign.isActive ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
              )}
              <span className={`text-sm font-medium ${currentCampaign.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                {currentCampaign.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <Button
            variant={currentCampaign.isActive ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleToggleStatus}
            loading={updatingStatus}
            disabled={updatingStatus}
          >
            {currentCampaign.isActive ? (
              <>
                <PauseIcon className="h-4 w-4 mr-1" />
                Pause Campaign
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4 mr-1" />
                Activate Campaign
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Campaign Stats */}
      <div>
        <div className="flex items-center mb-4">
          <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Campaign Statistics</h3>
        </div>
        
        {loadingStats ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 mb-1">Matching Users</p>
              <p className="text-2xl font-bold text-blue-900">{(stats.totalMatchingUsers || 0).toLocaleString()}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 mb-1">Messages Sent</p>
              <p className="text-2xl font-bold text-green-900">{(stats.messagesSent || 0).toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 mb-1">Messages Delivered</p>
              <p className="text-2xl font-bold text-purple-900">{(stats.messagesDelivered || 0).toLocaleString()}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-orange-600 mb-1">Messages Opened</p>
              <p className="text-2xl font-bold text-orange-900">{(stats.messagesOpened || 0).toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Unable to load campaign statistics</p>
          </div>
        )}
      </div>

      {/* Target Audience */}
      <div>
        <div className="flex items-center mb-4">
          <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Target Audience</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Age Range</p>
            <p className="text-lg text-gray-900">
              {currentCampaign.targetAudience?.ageRange?.min || 0} - {currentCampaign.targetAudience?.ageRange?.max || 0} years old
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Target Countries</p>
            <div className="flex flex-wrap gap-2">
              {(currentCampaign.targetAudience?.countries || []).map((country) => (
                <span
                  key={country}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  <GlobeAltIcon className="h-4 w-4 mr-1" />
                  {country}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Message Template */}
      <div>
        <div className="flex items-center mb-4">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Message Template</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
            {currentCampaign.messageTemplate || 'No message template defined'}
          </pre>
        </div>
        
        <div className="mt-2">
          <p className="text-xs text-gray-500">
            Available placeholders: <code className="bg-gray-100 px-1 rounded">{`{name}`}</code>, <code className="bg-gray-100 px-1 rounded">{`{country}`}</code>
          </p>
        </div>
      </div>

      {/* Campaign Metadata */}
      <div>
        <div className="flex items-center mb-4">
          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Campaign Information</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Campaign ID:</span>
            <span className="text-sm font-mono text-gray-900">{currentCampaign.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Created:</span>
            <span className="text-sm text-gray-900">{formatDate(currentCampaign.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Last Updated:</span>
            <span className="text-sm text-gray-900">{formatDate(currentCampaign.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary">
          Edit Campaign
        </Button>
      </div>
    </div>
  );
} 