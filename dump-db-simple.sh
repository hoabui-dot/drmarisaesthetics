#!/bin/bash

# ============================================
# Simple PostgreSQL Database Dump Script
# ============================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}PostgreSQL Database Dump${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Step 1: Find the postgres container
echo -e "${YELLOW}Step 1: Finding PostgreSQL container...${NC}"
CONTAINER=$(docker ps --filter "ancestor=postgres:16-alpine" --format "{{.Names}}" | head -1)

if [ -z "$CONTAINER" ]; then
    echo -e "${RED}Error: No PostgreSQL container found${NC}"
    echo "Available containers:"
    docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
    exit 1
fi

echo -e "${GREEN}✓ Found container: ${CONTAINER}${NC}"
echo ""

# Step 2: Get database credentials
echo -e "${YELLOW}Step 2: Getting database credentials...${NC}"
DB_NAME=$(docker exec $CONTAINER printenv POSTGRES_DB)
DB_USER=$(docker exec $CONTAINER printenv POSTGRES_USER)

echo -e "  Database: ${DB_NAME}"
echo -e "  User: ${DB_USER}"
echo ""

# Step 3: Show database info
echo -e "${YELLOW}Step 3: Database information...${NC}"
echo -e "${BLUE}Available databases:${NC}"
docker exec $CONTAINER psql -U $DB_USER -c "\l" 2>/dev/null | grep -E "^\s+\w+\s+\|" || true

echo ""
echo -e "${BLUE}Tables in '${DB_NAME}':${NC}"
docker exec $CONTAINER psql -U $DB_USER -d $DB_NAME -c "\dt" 2>/dev/null | grep -E "^\s+\w+\s+\|" || echo "  (no tables found)"

echo ""
echo -e "${BLUE}Row counts:${NC}"
docker exec $CONTAINER psql -U $DB_USER -d $DB_NAME -c "
    SELECT schemaname, tablename, n_live_tup as rows
    FROM pg_stat_user_tables
    ORDER BY n_live_tup DESC;
" 2>/dev/null || echo "  (unable to get row counts)"

echo ""

# Step 4: Dump database
DUMP_FILE="dump.sql"
echo -e "${YELLOW}Step 4: Dumping database to ${DUMP_FILE}...${NC}"

docker exec $CONTAINER pg_dump -U $DB_USER -d $DB_NAME --clean --if-exists > $DUMP_FILE

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database dumped successfully${NC}"
else
    echo -e "${RED}✗ Failed to dump database${NC}"
    exit 1
fi

echo ""

# Step 5: Verify dump
echo -e "${YELLOW}Step 5: Verifying dump file...${NC}"

if [ ! -f "$DUMP_FILE" ]; then
    echo -e "${RED}✗ Dump file not found${NC}"
    exit 1
fi

FILE_SIZE=$(stat -f%z "$DUMP_FILE" 2>/dev/null || stat -c%s "$DUMP_FILE" 2>/dev/null)

if [ $FILE_SIZE -eq 0 ]; then
    echo -e "${RED}✗ Dump file is empty${NC}"
    exit 1
fi

echo -e "${GREEN}✓ File size: $(numfmt --to=iec-i --suffix=B $FILE_SIZE 2>/dev/null || echo "${FILE_SIZE} bytes")${NC}"

# Count database objects
TABLES=$(grep -c "CREATE TABLE" "$DUMP_FILE" || echo "0")
SEQUENCES=$(grep -c "CREATE SEQUENCE" "$DUMP_FILE" || echo "0")
INDEXES=$(grep -c "CREATE INDEX" "$DUMP_FILE" || echo "0")
CONSTRAINTS=$(grep -c "ALTER TABLE.*ADD CONSTRAINT" "$DUMP_FILE" || echo "0")

echo -e "  - Tables: ${TABLES}"
echo -e "  - Sequences: ${SEQUENCES}"
echo -e "  - Indexes: ${INDEXES}"
echo -e "  - Constraints: ${CONSTRAINTS}"

if [ $TABLES -eq 0 ]; then
    echo -e "${RED}✗ Warning: No tables found in dump${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Dump file verified successfully${NC}"

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}Local dump completed successfully!${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "File: ${GREEN}${DUMP_FILE}${NC}"
echo ""
