# Dream Arena - Football Ground Booking App

A fully functional React Native mobile application for booking football grounds with three user contexts: Customer, Team, and Admin.

## Features

### Customer Features
- User registration and authentication
- Browse available football grounds
- Book grounds with date and time selection
- Leave reviews and ratings for grounds
- View ongoing leagues
- Join teams (optional during registration)
- Profile management with player stats

### Team Features
- All customer features
- Join leagues (one league at a time)
- Team-specific dashboard
- Team statistics and player management

### Admin Features
- Complete admin dashboard
- Manage grounds, teams, leagues, and news
- View system statistics
- Create and manage all content
- User and booking management

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT tokens
- **UI**: Custom components with dark green theme

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dream-arena-football
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   npm run server
   ```

4. **Start the Expo development server**
   ```bash
   npx expo start
   ```

5. **Run on device/emulator**
   - Scan the QR code with Expo Go app (Android/iOS)
   - Or press 'a' for Android emulator
   - Or press 'i' for iOS simulator

## Default Login Credentials

### Admin Login
- Email: `admin@dreamarena.com`
- Password: `admin123`

### Customer Registration
- Register as a new customer through the app
- Optionally join existing teams during registration

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Grounds
- `GET /api/grounds` - Get all grounds
- `GET /api/grounds/:id/reviews` - Get ground reviews
- `POST /api/grounds/:id/reviews` - Submit review

### Teams & Leagues
- `GET /api/teams` - Get all teams
- `GET /api/leagues` - Get all leagues
- `POST /api/leagues/:id/join` - Join league

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `POST /api/admin/teams` - Create team
- `POST /api/admin/grounds` - Create ground
- `POST /api/admin/leagues` - Create league
- `POST /api/admin/news` - Create news

## Database Schema

The app uses MongoDB with the following collections:
- Users (customers, teams, admins)
- Teams (team information and players)
- Grounds (football ground details)
- Leagues (tournament information)
- News (announcements and updates)
- Bookings (ground reservations)
- Reviews (ground ratings and comments)

## Color Scheme

- **Primary**: Dark Green (#0d2818, #1a4d3a)
- **Secondary**: Black (#000)
- **Accent**: Yellow (#ffd700)
- **Text**: White (#fff) and Gray (#888)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.