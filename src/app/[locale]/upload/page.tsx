import FileUpload from '@/components/upload/FileUpload';

export default function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload User Data</h1>
        <p className="mt-2 text-lg text-gray-600">
          Import user data from CSV or JSON files to build your audience database.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <FileUpload />
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">
          📋 Upload Guidelines
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Supported formats: CSV and JSON files</li>
          <li>• Maximum file size: 10MB</li>
          <li>• Required fields: name, email, age, country</li>
          <li>• Duplicate emails will be skipped automatically</li>
          <li>• Invalid data rows will be reported after upload</li>
        </ul>
      </div>
    </div>
  );
} 