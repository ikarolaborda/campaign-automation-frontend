import Link from 'next/link';
import CampaignList from '@/components/campaigns/CampaignList';
import Button from '@/components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function CampaignsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage and monitor your marketing campaigns and their performance.
          </p>
        </div>
        <Link href="/campaigns/create">
          <Button size="lg">
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Campaign
          </Button>
        </Link>
      </div>

      <CampaignList />
    </div>
  );
} 