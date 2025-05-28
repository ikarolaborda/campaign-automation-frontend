'use client';

import { useRouter } from 'next/navigation';
import CampaignForm from '@/components/campaigns/CampaignForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CreateCampaignPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/campaigns');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/campaigns"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Campaigns
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
        <p className="mt-2 text-lg text-gray-600">
          Set up a new marketing campaign with target audience and messaging.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <CampaignForm onSuccess={handleSuccess} />
      </div>

      <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-green-900 mb-2">
          💡 Campaign Tips
        </h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Use clear, descriptive campaign names for easy identification</li>
          <li>• Target specific age ranges and countries for better engagement</li>
          <li>• Include personalization variables like {`{name}`} and {`{country}`} in your message</li>
          <li>• Keep your message template concise and compelling</li>
          <li>• Test your campaigns with small audiences first</li>
        </ul>
      </div>
    </div>
  );
} 