#!/bin/bash

# ============================================
# Remote PostgreSQL Database Dump Script
# ============================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

REMOTE_USER="neurosus"
REMOTE_HOST="100.68.50.41"
REMOTE_PATH="dental-app"
REMOTE_DUMP_FILE="dump-remote.sql"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}Remote PostgreSQL Database Dump${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

echo -e "${YELLOW}Connecting to ${REMOTE_USER}@${REMOTE_HOST}...${NC}"
echo ""

# Execute remote dump script
ssh ${REMOTE_USER}@${REMOTE_HOST} "cd ${REMOTE_PATH} && bash -s" << 'ENDSSH'
#!/bin/bash

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}Remote Database Dump (on server)${NC}"
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
echo -e "${BLUE}Tables in '${DB_NAME}':${NC}"
TABLE_COUNT=$(docker exec $CONTAINER psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
echo -e "  Total tables: ${TABLE_COUNT}"

echo ""
echo -e "${BLUE}Sample tables:${NC}"
docker exec $CONTAINER psql -U $DB_USER -d $DB_NAME -c "\dt" 2>/dev/null | head -20

echo ""

# Step 4: Dump database
DUMP_FILE="dump-remote.sql"
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

FILE_SIZE=$(stat -c%s "$DUMP_FILE" 2>/dev/null)

if [ $FILE_SIZE -eq 0 ]; then
    echo -e "${RED}✗ Dump file is empty${NC}"
    exit 1
fi

# Convert bytes to human readable
if [ $FILE_SIZE -gt 1048576 ]; then
    SIZE_MB=$(echo "scale=2; $FILE_SIZE / 1048576" | bc)
    echo -e "${GREEN}✓ File size: ${SIZE_MB} MB${NC}"
elif [ $FILE_SIZE -gt 1024 ]; then
    SIZE_KB=$(echo "scale=2; $FILE_SIZE / 1024" | bc)
    echo -e "${GREEN}✓ File size: ${SIZE_KB} KB${NC}"
else
    echo -e "${GREEN}✓ File size: ${FILE_SIZE} bytes${NC}"
fi

# Count database objects
TABLES=$(grep -c "CREATE TABLE" "$DUMP_FILE" || echo "0")
SEQUENCES=$(grep -c "CREATE SEQUENCE" "$DUMP_FILE" || echo "0")
INDEXES=$(grep -c "CREATE INDEX" "$DUMP_FILE" || echo "0")
DATA_COPIES=$(grep -c "^COPY public\." "$DUMP_FILE" || echo "0")

echo -e "  - Tables: ${TABLES}"
echo -e "  - Sequences: ${SEQUENCES}"
echo -e "  - Indexes: ${INDEXES}"
echo -e "  - Data copies: ${DATA_COPIES}"

if [ $TABLES -eq 0 ]; then
    echo -e "${RED}✗ Warning: No tables found in dump${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Dump file verified successfully${NC}"

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}Remote dump completed successfully!${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "File: ${GREEN}${DUMP_FILE}${NC}"
echo -e "Location: ${GREEN}$(pwd)/${DUMP_FILE}${NC}"
echo ""
ENDSSH

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Remote database dump completed successfully${NC}"
    echo ""
    echo -e "${YELLOW}To download the remote dump file, run:${NC}"
    echo -e "  scp ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/${REMOTE_DUMP_FILE} ./"
    echo ""
else
    echo -e "${RED}✗ Remote database dump failed${NC}"
    exit 1
fi
