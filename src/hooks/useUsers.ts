import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { UploadResponse } from '@/types';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadUsers = useCallback(async (file: File): Promise<UploadResponse | null> => {
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<UploadResponse>('/users/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(`Successfully uploaded ${response.data.count} users!`);
      return response.data;
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to upload users';
      setUploadError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    const allowedTypes = ['text/csv', 'application/json', 'text/plain'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      return 'Please upload a CSV or JSON file';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return null;
  }, []);

  return {
    uploading,
    uploadError,
    uploadUsers,
    validateFile,
  };
}; 