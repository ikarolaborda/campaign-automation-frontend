# Campaign Hub Frontend

A modern, responsive React frontend built with Next.js 15 and Tailwind CSS for managing marketing campaigns.
Part of the Campaign Hub project, [Campaign Automation API](https://github.com/ikarolaborda/campaign-automation-api).

## 🚀 Features

- **Dashboard**: Overview statistics and quick actions
- **User Upload**: Drag & drop CSV/JSON file upload with validation
- **Campaign Management**: Create, view, and delete campaigns
- **Responsive Design**: Beautiful UI that works on all device sizes
- **Real-time Updates**: Live campaign statistics and audience matching
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with validation
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Notifications**: React Hot Toast

## 📦 Installation

0. **Clone the repository (Inside the backend root)**:
   ```bash
   git clone https://github.com/ikarolaborda/campaign-automation-frontend frontend
   ```

1. **Install dependencies (This step and the other ones below are optional, as the backend building flow handles them)**:
   ```bash
   npm install
   ```

2. **Set environment variables**:
   ```bash
   # The API URL is set in next.config.js
   # For local development, it defaults to http://localhost:3001/api
   ```

## 🔧 Development

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the application**:
   - Frontend: http://localhost:3000
   - Make sure the backend is running on http://localhost:3001

## 🐳 Docker

1. **Build the Docker image**:
   ```bash
   docker build -t campaign-frontend .
   ```

2. **Run with Docker Compose** (from the project root):
   ```bash
   docker compose up --build
   ```

## 🎯 Usage

### Dashboard
- View campaign statistics and overview
- Quick access to all major features
- Recent campaigns display

### Upload Users
- Support for CSV and JSON files
- Drag & drop interface
- File validation and error reporting
- Expected format:
  ```csv
  name,email,age,country
  John Doe,john@example.com,30,US
  ```

### Create Campaign
- Form-based campaign creation
- Target audience selection (age range, countries)
- Message template with placeholders
- Real-time validation

### View Campaigns
- Grid layout with campaign cards
- Live audience statistics
- Campaign management actions
- Responsive design

## 🔧 Configuration

The frontend connects to the backend API using the `NEXT_PUBLIC_API_URL` environment variable. This is configured in:

- **Development**: Set in `package.json` dev script
- **Docker**: Set in `docker-compose.yml`
- **Production**: Set in deployment environment

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js 15 app router pages
│   │   ├── campaigns/          # Campaign-related pages
│   │   ├── upload/             # User upload page
│   │   └── layout.tsx          # Root layout
│   ├── components/             # Reusable components
│   │   ├── campaigns/          # Campaign components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── layout/             # Layout components
│   │   ├── ui/                 # UI components
│   │   └── upload/             # Upload components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and configs
│   └── types/                  # TypeScript definitions
├── public/                     # Static assets
├── Dockerfile                  # Docker configuration
├── next.config.js             # Next.js configuration
└── tailwind.config.js         # Tailwind CSS configuration
```

## 🎨 Component Architecture

### Custom Hooks
- `useCampaigns`: Campaign CRUD operations
- `useUsers`: User upload functionality

### UI Components
- `Button`: Reusable button with variants
- `LoadingSpinner`: Loading states
- `Header`: Navigation and branding

### Feature Components
- `Dashboard`: Main overview page
- `CampaignForm`: Campaign creation
- `CampaignList`: Campaign display
- `FileUpload`: User data upload

## 🔍 API Integration

The frontend communicates with the backend through:

- **Campaigns API**: CRUD operations
- **Users API**: File uploads
- **Statistics API**: Real-time metrics

All API calls include error handling and user feedback via toast notifications.

## 🚀 Build & Deploy

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Docker deployment**:
   ```bash
   docker build -t campaign-frontend .
   docker run -p 3000:3000 campaign-frontend
   ```

## 🔧 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update component styles in individual files
- Global styles in `src/app/globals.css`

### API Endpoints
- Update `src/lib/api.ts` for different backend URLs
- Modify API client configuration as needed

### Features
- Add new pages in `src/app/`
- Create new components in `src/components/`
- Extend type definitions in `src/types/`

## 📱 Mobile Support

The application is fully responsive and includes:
- Mobile-first design approach
- Touch-friendly interactions
- Responsive navigation
- Optimized layouts for all screen sizes

## 🔒 Security

- Environment variables for sensitive data
- Input validation on all forms
- Secure API communication
- CSRF protection via Next.js built-ins

---

For more information about the backend API, see the main project README.

## Disclaimer

I am backend developer who can handle frontend development, but I am not a designer. The design is functional but may not be visually appealing, some components may be flaky, and there may be bugs. Full Stack development with 100/100 is nothing but a scam!
