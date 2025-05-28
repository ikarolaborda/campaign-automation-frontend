'use client';

import { useCallback, useState } from 'react';
import { CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { useUsers } from '@/hooks/useUsers';
import Button from '@/components/ui/Button';

interface FileUploadProps {
  onUploadSuccess?: () => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploading, uploadUsers, validateFile } = useUsers();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const error = validateFile(file);
      if (!error) {
        setSelectedFile(file);
      }
    }
  }, [validateFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = validateFile(file);
      if (!error) {
        setSelectedFile(file);
      }
    }
  }, [validateFile]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    const result = await uploadUsers(selectedFile);
    if (result) {
      setSelectedFile(null);
      onUploadSuccess?.();
    }
  }, [selectedFile, uploadUsers, onUploadSuccess]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv,.json"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        <div className="text-center">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                Click to upload
              </span>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">CSV or JSON files up to 10MB</p>
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <DocumentIcon className="h-8 w-8 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              onClick={handleUpload}
              loading={uploading}
              disabled={uploading}
              size="sm"
            >
              Upload
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p className="font-medium mb-2">Expected file format:</p>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="font-mono">CSV: name,email,age,country</p>
          <p className="font-mono">JSON: [{`{"name":"John","email":"john@example.com","age":30,"country":"US"}`}]</p>
        </div>
      </div>
    </div>
  );
} 