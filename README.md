# Lief Care Clock

A comprehensive care management system built with Next.js, Grommet UI, and location-based time tracking.

## Features

### For Care Workers
- **Location-based Clock In/Out**: Workers can only clock in when within the designated perimeter
- **Optional Notes**: Add notes when clocking in or out
- **Real-time Status**: See current clock-in status and elapsed time
- **Location Verification**: Check if you're within the allowed work area

### For Managers
- **Set Location Perimeter**: Define work areas with latitude, longitude, and radius
- **Active Staff Monitoring**: View all currently clocked-in staff in real-time
- **Time Entry History**: See detailed history of all clock in/out activities
- **Analytics Dashboard**: 
  - Average hours per day
  - Number of active workers
  - Total hours worked (last 7 days)
  - Individual staff performance metrics

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Components**: Grommet v2
- **Authentication**: Auth0 for secure user authentication
- **Database**: PostgreSQL with Prisma ORM
- **Location Services**: Browser Geolocation API
- **Styling**: Grommet theming system
- **Role Management**: Local storage for role persistence

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (optional - mock data is available for testing)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lief-care-clock
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy .env.example to .env and configure your database
cp .env.example .env
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Authentication and Role Selection
1. Visit the homepage and click "Log In / Sign Up"
2. Authenticate using your Auth0 credentials
3. If it's your first login, you'll be prompted to select a role:
   - **Care Worker**: For staff who need to clock in/out
   - **Manager**: For supervisors who manage staff and locations
4. After selecting a role, you'll be redirected to the appropriate dashboard
5. Your role selection is remembered for future logins
6. You can reset your role by clicking the "Reset Role" button on the home page

### For Care Workers
1. After logging in and selecting the Care Worker role, you'll be directed to the Care Worker dashboard
2. Allow location access when prompted
3. Check if you're within the work perimeter
4. Click "Clock In" to start your shift (add optional note)
5. Click "Clock Out" to end your shift (add optional note)
6. Use the logout button in the top-right corner to log out

### For Managers
1. After logging in and selecting the Manager role, you'll be directed to the Manager dashboard
2. Use the tabs to access different features:
   - **Dashboard**: View analytics and metrics
   - **Active Staff**: See who's currently clocked in
   - **Time Entries**: Review all time tracking history
   - **Settings**: Configure location perimeter
3. Use the logout button in the top-right corner to log out

### Setting Up Location Perimeter
1. Go to Manager Dashboard → Settings tab
2. Enter location details:
   - **Name**: Descriptive name for the location
   - **Latitude**: Center point latitude (e.g., 51.5074)
   - **Longitude**: Center point longitude (e.g., -0.1278)
   - **Radius**: Allowed area in kilometers (e.g., 2.0)
3. Click "Update Perimeter"

## API Endpoints

### Perimeter Management
- `GET /api/perimeter` - Get active perimeter
- `POST /api/perimeter` - Create/update perimeter

### Time Tracking
- `GET /api/time-entries` - Get time entries (with filters)
- `POST /api/time-entries` - Clock in
- `PATCH /api/time-entries/[id]` - Clock out

### Analytics
- `GET /api/analytics` - Get dashboard analytics

### User Management
- `GET /api/users` - Get users
- `POST /api/users` - Create user

## Database Schema

### Users
- ID, name, email, role (MANAGER/CARE_WORKER)

### LocationPerimeter
- ID, name, latitude, longitude, radius, isActive

### TimeEntry
- ID, userId, clockInTime, clockInLocation, clockInNote
- clockOutTime, clockOutLocation, clockOutNote, totalHours

## Location Features

### Geolocation Requirements
- Browser must support HTML5 Geolocation API
- User must grant location permissions
- HTTPS required for production (location API restriction)

### Distance Calculation
- Uses Haversine formula for accurate distance calculation
- Accounts for Earth's curvature
- Precision within meters for typical use cases

## Mock Data

For testing without a database, the application includes mock data:
- Sample users (care workers and managers)
- Default location perimeter (London coordinates)
- Sample time entries with realistic data

## Development

### Project Structure
```
src/
├── app/                 # Next.js app router
│   ├── api/            # API routes
│   ├── care-worker/    # Care worker dashboard
│   ├── manager/        # Manager dashboard
│   └── page.tsx        # Homepage
├── components/         # Reusable components
├── lib/               # Utilities and configurations
├── utils/             # Helper functions
└── types/             # TypeScript type definitions
```

### Key Utilities
- `src/utils/location.ts` - Location and distance calculations
- `src/utils/time.ts` - Time formatting and calculations
- `src/lib/mockData.ts` - Mock data service for testing

## Deployment

### Environment Variables
```bash
DATABASE_URL="your-postgresql-connection-string"
AUTH0_SECRET="your-auth0-secret"
AUTH0_BASE_URL="your-app-url"
AUTH0_ISSUER_BASE_URL="https://your-tenant.auth0.com"
AUTH0_CLIENT_ID="your-auth0-client-id"
AUTH0_CLIENT_SECRET="your-auth0-client-secret"
```

### Build and Deploy
```bash
npm run build
npm start
```

## Browser Compatibility

- Modern browsers with Geolocation API support
- Chrome 5+, Firefox 3.5+, Safari 5+, Edge 12+
- Mobile browsers: iOS Safari, Chrome Mobile, Samsung Internet

## Security Considerations

- **Authentication**: Secure user authentication via Auth0
- **Role Management**: User roles stored in browser's localStorage
- **Location Data**: Location data is only stored when clocking in/out
- **Privacy**: No continuous location tracking
- **HTTPS**: Required for geolocation and Auth0 in production
- **API Security**: Input validation on all API endpoints
- **Session Management**: Secure session handling via Auth0

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
