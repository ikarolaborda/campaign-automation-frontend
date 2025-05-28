'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateCampaignDto } from '@/types';
import { useCampaigns } from '@/hooks/useCampaigns';
import Button from '@/components/ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CampaignFormProps {
  onSuccess?: () => void;
}

const COUNTRIES = [
  'US', 'CA', 'UK', 'DE', 'FR', 'ES', 'IT', 'AU', 'JP', 'BR', 'IN', 'MX', 'NL', 'SE', 'NO'
];

export default function CampaignForm({ onSuccess }: CampaignFormProps) {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const { createCampaign, loading } = useCampaigns();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateCampaignDto>({
    defaultValues: {
      name: '',
      targetAudience: {
        ageRange: {
          min: 18,
          max: 65,
        },
        countries: [],
      },
      messageTemplate: '',
    },
  });

  const minAge = watch('targetAudience.ageRange.min');
  const maxAge = watch('targetAudience.ageRange.max');

  const addCountry = (country: string) => {
    if (!selectedCountries.includes(country)) {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const removeCountry = (country: string) => {
    setSelectedCountries(selectedCountries.filter(c => c !== country));
  };

  const onSubmit = async (data: CreateCampaignDto) => {
    try {
      const campaignData = {
        ...data,
        targetAudience: {
          ...data.targetAudience,
          countries: selectedCountries,
        },
      };

      await createCampaign(campaignData);
      reset();
      setSelectedCountries([]);
      onSuccess?.();
    } catch {
      // Error is handled by the hook
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Campaign Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Name
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { 
              required: 'Campaign name is required',
              minLength: { value: 3, message: 'Campaign name must be at least 3 characters' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter campaign name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Age Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Age Range
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="minAge" className="block text-xs text-gray-500 mb-1">
                Minimum Age
              </label>
              <input
                type="number"
                id="minAge"
                {...register('targetAudience.ageRange.min', {
                  required: 'Minimum age is required',
                  min: { value: 13, message: 'Minimum age must be at least 13' },
                  max: { value: 100, message: 'Minimum age must be less than 100' },
                  valueAsNumber: true,
                  validate: (value) => {
                    const numValue = Number(value);
                    const numMaxAge = Number(maxAge);
                    
                    if (isNaN(numValue)) {
                      return 'Minimum age must be a valid number';
                    }
                    
                    if (numValue < 13) {
                      return 'Minimum age must be at least 13';
                    }
                    
                    if (numValue > 100) {
                      return 'Minimum age must not be greater than 100';
                    }
                    
                    if (!isNaN(numMaxAge) && numValue >= numMaxAge) {
                      return 'Minimum age must be less than maximum age';
                    }
                    
                    return true;
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                min="13"
                max="100"
              />
              {errors.targetAudience?.ageRange?.min && (
                <p className="mt-1 text-sm text-red-600">{errors.targetAudience.ageRange.min.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="maxAge" className="block text-xs text-gray-500 mb-1">
                Maximum Age
              </label>
              <input
                type="number"
                id="maxAge"
                {...register('targetAudience.ageRange.max', {
                  required: 'Maximum age is required',
                  min: { value: 13, message: 'Maximum age must be at least 13' },
                  max: { value: 100, message: 'Maximum age must be less than 100' },
                  valueAsNumber: true,
                  validate: (value) => {
                    const numValue = Number(value);
                    const numMinAge = Number(minAge);
                    
                    if (isNaN(numValue)) {
                      return 'Maximum age must be a valid number';
                    }
                    
                    if (numValue < 13) {
                      return 'Maximum age must be at least 13';
                    }
                    
                    if (numValue > 100) {
                      return 'Maximum age must not be greater than 100';
                    }
                    
                    if (!isNaN(numMinAge) && numValue <= numMinAge) {
                      return 'Maximum age must be greater than minimum age';
                    }
                    
                    return true;
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                min="13"
                max="100"
              />
              {errors.targetAudience?.ageRange?.max && (
                <p className="mt-1 text-sm text-red-600">{errors.targetAudience.ageRange.max.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Countries */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Countries
          </label>
          
          {/* Selected Countries */}
          {selectedCountries.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {selectedCountries.map((country) => (
                  <span
                    key={country}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                  >
                    {country}
                    <button
                      type="button"
                      onClick={() => removeCountry(country)}
                      className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-600"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Country Selection */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {COUNTRIES.filter(country => !selectedCountries.includes(country)).map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => addCountry(country)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {country}
              </button>
            ))}
          </div>

          {selectedCountries.length === 0 && (
            <p className="mt-1 text-sm text-red-600">Please select at least one country</p>
          )}
        </div>

        {/* Message Template */}
        <div>
          <label htmlFor="messageTemplate" className="block text-sm font-medium text-gray-700 mb-2">
            Message Template
          </label>
          <textarea
            id="messageTemplate"
            rows={4}
            {...register('messageTemplate', {
              required: 'Message template is required',
              minLength: { value: 10, message: 'Message template must be at least 10 characters' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Hi {name}! We have a special offer for customers in {country}..."
          />
          {errors.messageTemplate && (
            <p className="mt-1 text-sm text-red-600">{errors.messageTemplate.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Use {`{name}`} and {`{country}`} as placeholders for personalization
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            loading={loading}
            disabled={loading || selectedCountries.length === 0}
            size="lg"
          >
            Create Campaign
          </Button>
        </div>
      </form>
    </div>
  );
} 