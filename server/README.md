# Mr.Market Server

This is a NestJS project designed for real-time market data processing with WebSocket and REST API support for running strategies and making direct trades on exchanges.


### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/) (for local database setup)

### Installation

Follow these steps to get your development environment running:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Hu-Fi/Mr.Market.git
   cd server
   ```

2. **Install Dependencies**

```bash
npm install
```

3. **Set Up Environment Variables**

Copy the .env.example file to a new file named .env.

```bash
cp .env.example .env
```

4. **Fill in the necessary details in .env:**

```makefile

POSTGRES_HOST=localhost
POSTGRES_USER=<YourUsername>
POSTGRES_PASSWORD=<YourPassword>
POSTGRES_DATABASE=<YourDatabase>
POSTGRES_PORT=5432
POSTGRES_SSL=false
BINANCE_API_KEY=<YourBinanceApiKey>
BINANCE_SECRET=<YourBinanceSecret>
MEXC_API_KEY=<YourMexcApiKey>
MEXC_SECRET=<YourMexcSecret>
BITFINEX_API_KEY=<YourBitfinexApiKey>
BITFINEX_SECRET=<YourBitfinexSecret>
```
5. **Running the Application**

Start the application in development mode:

```bash
Copy code
npm run start:dev
```

The server will be running on http://localhost:3000.


6. **Testing**

To run the automated tests for this system:

```bash
Copy code
npm test
```

7. **Built With**

NestJS - The web framework used
TypeORM - Object-Relational Mapping (ORM) library
ccxt - Library for cryptocurrency trading supporting many exchanges
PostgreSQL - Open Source Relational Database

