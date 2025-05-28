'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useCampaigns } from '@/hooks/useCampaigns';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import {
  MegaphoneIcon,
  UsersIcon,
  ChartBarIcon,
  PlusIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalReach: number;
  averageDeliveryRate: number;
}

export default function Dashboard() {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const { campaigns, loading, getCampaignStats } = useCampaigns();
  const [stats, setStats] = useState<DashboardStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalReach: 0,
    averageDeliveryRate: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const calculateStats = async () => {
      if (campaigns.length === 0) {
        setStats({
          totalCampaigns: 0,
          activeCampaigns: 0,
          totalReach: 0,
          averageDeliveryRate: 0,
        });
        return;
      }

      setLoadingStats(true);
      let totalReach = 0;
      let totalDeliveryRate = 0;
      let campaignsWithStats = 0;

      for (const campaign of campaigns) {
        try {
          const campaignStats = await getCampaignStats(campaign.id);
          if (campaignStats) {
            totalReach += campaignStats.totalMatchingUsers || 0;
            const deliveryRate = campaignStats.messagesSent > 0 
              ? ((campaignStats.messagesDelivered || 0) / campaignStats.messagesSent) * 100 
              : 0;
            totalDeliveryRate += deliveryRate;
            campaignsWithStats++;
          }
        } catch (error) {
          console.warn(`Failed to get stats for campaign ${campaign.id}:`, error);
        }
      }

      setStats({
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => c.isActive).length,
        totalReach,
        averageDeliveryRate: campaignsWithStats > 0 ? totalDeliveryRate / campaignsWithStats : 0,
      });
      setLoadingStats(false);
    };

    calculateStats();
  }, [campaigns, getCampaignStats]);

  const statCards = [
    {
      name: t('stats.totalCampaigns'),
      value: stats.totalCampaigns?.toString() || '0',
      icon: MegaphoneIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: t('stats.activeCampaigns'),
      value: stats.activeCampaigns?.toString() || '0',
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: t('stats.totalReach'),
      value: (stats.totalReach || 0).toLocaleString(),
      icon: UsersIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: t('stats.avgDeliveryRate'),
      value: `${(stats.averageDeliveryRate || 0).toFixed(1)}%`,
      icon: ChartBarIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const quickActions = [
    {
      name: t('actions.uploadUsers.title'),
      description: t('actions.uploadUsers.description'),
      href: `/${locale}/upload`,
      icon: CloudArrowUpIcon,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: t('actions.createCampaign.title'),
      description: t('actions.createCampaign.description'),
      href: `/${locale}/campaigns/create`,
      icon: PlusIcon,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      name: t('actions.viewCampaigns.title'),
      description: t('actions.viewCampaigns.description'),
      href: `/${locale}/campaigns`,
      icon: MegaphoneIcon,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-indigo-100 text-lg">
          {t('subtitle')}
        </p>
      </div>

      {/* Statistics Cards */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('overview')}</h2>
        {loading || loadingStats ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <div
                key={stat.name}
                className="bg-white overflow-hidden shadow rounded-lg border border-gray-200"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`p-3 rounded-md ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('quickActions')}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div>
                <span className={`rounded-lg inline-flex p-3 ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {action.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Campaigns */}
      {campaigns && campaigns.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">{t('recentCampaigns')}</h2>
            <Link href={`/${locale}/campaigns`}>
              <Button variant="outline" size="sm">
                {t('viewAll')}
              </Button>
            </Link>
          </div>
          <div className="bg-white shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                {campaigns.slice(0, 3).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {campaign.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {campaign.targetAudience?.countries?.join(', ') || 'No countries'} • 
                        Age {campaign.targetAudience?.ageRange?.min || 0}-{campaign.targetAudience?.ageRange?.max || 0}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campaign.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {campaign.isActive ? t('active') : t('inactive')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 