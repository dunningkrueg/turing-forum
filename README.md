# Turing Forum (Development in Progress)

> ⚠️ **Warning**: This project is currently in early development and is not ready for production use.

A forum platform built with modern web technologies, focusing on developer discussions and knowledge sharing.

## 🚧 Development Status

This project is currently in active development. Many core features are still being implemented and the codebase is subject to significant changes.

### What's Working
- Basic UI components and layout
- Theme switching (light/dark mode)
- Responsive design
- Category browsing interface
- Post listing interface
- Basic Go backend API structure

### Coming Soon
- Authentication system
- Complete database integration
- Post creation and management
- Comment system
- User roles and permissions
- Search functionality
- Real-time updates
- API endpoints
- WebSocket integration

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14, React
- **Language**: TypeScript
- **Styling**: Tailwind CSS, HeadlessUI
- **State Management**: React Context (more to come)

### Backend
- **Language**: Go 1.21+
- **Framework**: Gin
- **ORM**: GORM
- **Database**: PostgreSQL
- **Authentication**: JWT (planned)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Go 1.21+
- PostgreSQL 14+

### Frontend Setup

1. Clone the repository
```bash
git clone https://github.com/dunningkrueg/turing-forum.git
cd turing-forum
```

2. Install frontend dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start the frontend development server
```bash
npm run dev
```

### Backend Setup

1. Navigate to backend directory
```bash
cd backend
```

2. Install Go dependencies
```bash
go mod download
```

3. Start the backend server
```bash
go run main.go
```

The frontend will be available at `http://localhost:3000` and the API at `http://localhost:8080`.

## 🤝 Contributing

As this project is in early development, we're not accepting contributions yet. Please check back later!

## 📝 Notes

- This is a development build and should not be used in production
- Features and APIs are subject to change
- Security measures are not fully implemented
- Performance optimizations are pending
- Documentation will be expanded as the project matures

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

⚡ More features and improvements coming soon! Stay tuned for updates.
