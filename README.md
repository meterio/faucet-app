## Description

This is a faucet app for meter network

## Configuration

configurations are all listed in .env file. A sample .env file should look like this:

```
MONGO_USER=faucet
MONGO_PWD=faucet
MONGO_PATH=@127.0.0.1:27017/faucet
FAUCET_ADDR=[faucet address]
FAUCET_KEY=[faucet private key]
FAUCET_URL=http://[full node domain]:8669/

# only account has a MTRG balance larger than this will be able to tap from this faucet
MTRG_BALANCE_THRESHOLD=1

# for each tap, 400 MTRG is issued
TAP_AMOUNT_MTRG=400

# for each tap, 10 MTR is issued
TAP_AMOUNT_MTR=10

# service port
PORT=3001
```

# Build Docker

```
docker build -t [your tag] .
```

# Run Docker

```
docker run --name faucet -p 3001:3001 -v .env:.env.prod [your tag]
```

## Installation

```bash
npm install
```

## Running

```bash
npm run dev
```

## Testing

```bash
npm run test
```
