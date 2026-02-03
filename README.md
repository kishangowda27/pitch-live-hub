# PitchLive Hub - Cricket Social Platform

A modern cricket social platform built with React, TypeScript, and Vite. Features live match tracking, fan polls, real-time chat, and comprehensive match statistics.

## 🏏 Features

- **Live Match Tracking**: Real-time cricket match updates and scores
- **Fan Polls**: Create and vote on cricket-related polls
- **Live Chat**: Real-time chat during matches with reactions
- **Match Statistics**: Comprehensive match data and analytics
- **Responsive Design**: Optimized for all devices
- **Dark Theme**: Sleek dark UI design
- **InsForge Backend**: Powered by InsForge BaaS platform

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS 3.4, Framer Motion
- **Backend**: InsForge (PostgreSQL, Real-time, Storage)
- **API**: CricAPI for live cricket data
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: TanStack Query

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pitch-live-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your InsForge anon key:
   ```
   VITE_INSFORGE_ANON_KEY=your-insforge-anon-key-here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## 🌐 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `VITE_INSFORGE_ANON_KEY`
   - Deploy!

### Environment Variables

For production deployment, set these environment variables:

- `VITE_INSFORGE_ANON_KEY`: Your InsForge anonymous key

## 🗄️ Database Setup

The project uses InsForge as the backend. Database schema files are included:

- `database-schema.sql`: Main database schema
- `database-chat-schema.sql`: Chat system schema

## 📱 Pages

- **Home**: Hero section with live matches and stats
- **Matches**: All cricket matches with filtering
- **Polls**: Fan polls and voting system
- **Leaderboard**: Top fans and rankings
- **Players**: Player profiles and statistics
- **Series**: Tournament and series information

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run test`: Run tests

### Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API services
├── data/          # Static data and types
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries
├── types/         # TypeScript type definitions
└── styles/        # Global styles
```

## 🎨 Design System

- **Colors**: Cricket-themed color palette
- **Typography**: Inter + Oswald fonts
- **Components**: Consistent design system
- **Responsive**: Mobile-first approach
- **Animations**: Smooth Framer Motion animations

## 📊 Features in Detail

### Live Matches
- Real-time score updates
- Match status tracking
- Team information and flags
- Venue and timing details

### Fan Polls
- Create custom polls
- Vote on match predictions
- Real-time vote counting
- Category-based filtering

### Chat System
- Live match chat
- Emoji reactions
- User presence
- Message persistence

## 🔗 API Integration

- **CricAPI**: Live cricket data
- **InsForge**: Database and real-time features
- **Real-time Updates**: WebSocket connections

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions, please open an issue on GitHub.

---

Built with ❤️ for cricket fans worldwide 🏏