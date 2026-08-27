#!/bin/bash
# Strapi Setup Script

set -e

echo "🚀 Setting up Strapi CMS..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    
    # Generate secure keys
    echo "🔐 Generating secure keys..."
    
    # Generate APP_KEYS (4 keys)
    KEY1=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))")
    KEY2=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))")
    KEY3=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))")
    KEY4=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))")
    
    # Generate other secrets
    API_TOKEN_SALT=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))")
    ADMIN_JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))")
    TRANSFER_TOKEN_SALT=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))")
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))")
    
    # Update .env file
    sed -i.bak "s/APP_KEYS=.*/APP_KEYS=$KEY1,$KEY2,$KEY3,$KEY4/" .env
    sed -i.bak "s/API_TOKEN_SALT=.*/API_TOKEN_SALT=$API_TOKEN_SALT/" .env
    sed -i.bak "s/ADMIN_JWT_SECRET=.*/ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET/" .env
    sed -i.bak "s/TRANSFER_TOKEN_SALT=.*/TRANSFER_TOKEN_SALT=$TRANSFER_TOKEN_SALT/" .env
    sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    
    rm .env.bak
    
    echo "✅ .env file created with secure keys"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Strapi setup complete!"
echo ""
echo "Next steps:"
echo "1. Ensure PostgreSQL is running"
echo "2. Create database: docker-compose exec postgres psql -U postgres -c \"CREATE DATABASE dental_cms_strapi;\""
echo "3. Start Strapi: npm run develop"
echo "4. Open https://guild-biblical-expectations-easily.trycloudflare.com/admin"
echo "5. Create your first admin user"
echo ""
