#!/bin/bash

# ============================================
# PostgreSQL Database Dump Script
# ============================================
# This script dumps the PostgreSQL database from docker-compose
# Both locally and on remote server
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CONTAINER_NAME="dental-postgres"
DB_NAME="${POSTGRES_DB:-dental_cms_strapi}"
DB_USER="${POSTGRES_USER:-postgres}"
DUMP_FILE="dump.sql"
REMOTE_USER="neurosus"
REMOTE_HOST="100.68.50.41"
REMOTE_PATH="dental-app"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}PostgreSQL Database Dump Script${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# ============================================
# Function: Check if container is running
# ============================================
check_container() {
    local container=$1
    if ! docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        echo -e "${RED}Error: Container '${container}' is not running${NC}"
        echo -e "${YELLOW}Available containers:${NC}"
        docker ps --format "table {{.Names}}\t{{.Status}}"
        return 1
    fi
    echo -e "${GREEN}✓ Container '${container}' is running${NC}"
    return 0
}

# ============================================
# Function: Dump database
# ============================================
dump_database() {
    local container=$1
    local output_file=$2
    
    echo -e "${YELLOW}Dumping database from container '${container}'...${NC}"
    
    # Perform the dump
    docker exec ${container} pg_dump -U ${DB_USER} -d ${DB_NAME} --clean --if-exists > ${output_file}
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database dumped successfully to '${output_file}'${NC}"
        return 0
    else
        echo -e "${RED}✗ Failed to dump database${NC}"
        return 1
    fi
}

# ============================================
# Function: Verify dump file
# ============================================
verify_dump() {
    local dump_file=$1
    
    echo -e "${YELLOW}Verifying dump file '${dump_file}'...${NC}"
    
    if [ ! -f "${dump_file}" ]; then
        echo -e "${RED}✗ Dump file does not exist${NC}"
        return 1
    fi
    
    local file_size=$(stat -f%z "${dump_file}" 2>/dev/null || stat -c%s "${dump_file}" 2>/dev/null)
    
    if [ ${file_size} -eq 0 ]; then
        echo -e "${RED}✗ Dump file is empty${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✓ Dump file exists and is not empty (${file_size} bytes)${NC}"
    
    # Check for key database objects
    echo -e "${YELLOW}Checking dump content...${NC}"
    
    local tables=$(grep -c "CREATE TABLE" "${dump_file}" || echo "0")
    local sequences=$(grep -c "CREATE SEQUENCE" "${dump_file}" || echo "0")
    local indexes=$(grep -c "CREATE INDEX" "${dump_file}" || echo "0")
    
    echo -e "  - Tables: ${tables}"
    echo -e "  - Sequences: ${sequences}"
    echo -e "  - Indexes: ${indexes}"
    
    if [ ${tables} -eq 0 ]; then
        echo -e "${RED}✗ Warning: No tables found in dump${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✓ Dump file appears valid${NC}"
    return 0
}

# ============================================
# Function: Show database info
# ============================================
show_db_info() {
    local container=$1
    
    echo -e "${YELLOW}Database information:${NC}"
    
    # List all databases
    echo -e "${BLUE}Available databases:${NC}"
    docker exec ${container} psql -U ${DB_USER} -c "\l" | grep -E "^\s+\w+\s+\|"
    
    # List tables in target database
    echo -e "${BLUE}Tables in '${DB_NAME}':${NC}"
    docker exec ${container} psql -U ${DB_USER} -d ${DB_NAME} -c "\dt" | grep -E "^\s+\w+\s+\|" || echo "  (no tables found)"
    
    # Get row counts
    echo -e "${BLUE}Approximate row counts:${NC}"
    docker exec ${container} psql -U ${DB_USER} -d ${DB_NAME} -c "
        SELECT schemaname, tablename, n_live_tup as rows
        FROM pg_stat_user_tables
        ORDER BY n_live_tup DESC;
    " 2>/dev/null || echo "  (unable to get row counts)"
}

# ============================================
# MAIN EXECUTION
# ============================================

echo -e "${BLUE}Step 1: Local Database Dump${NC}"
echo -e "${BLUE}============================================${NC}"

# Check if container is running locally
if check_container ${CONTAINER_NAME}; then
    # Show database info
    show_db_info ${CONTAINER_NAME}
    
    echo ""
    
    # Dump database
    if dump_database ${CONTAINER_NAME} ${DUMP_FILE}; then
        # Verify dump
        verify_dump ${DUMP_FILE}
        
        echo ""
        echo -e "${GREEN}✓ Local database dump completed successfully${NC}"
    else
        echo -e "${RED}✗ Local database dump failed${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ Cannot proceed with local dump${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}Step 2: Remote Database Dump${NC}"
echo -e "${BLUE}============================================${NC}"

# Ask user if they want to dump remote database
read -p "Do you want to dump the remote database? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Connecting to remote server...${NC}"
    
    # Create remote dump script
    ssh ${REMOTE_USER}@${REMOTE_HOST} "cd ${REMOTE_PATH} && bash -s" << 'ENDSSH'
#!/bin/bash

set -e

CONTAINER_NAME="dental-postgres"
DB_NAME="${POSTGRES_DB:-dental_cms_strapi}"
DB_USER="${POSTGRES_USER:-postgres}"
DUMP_FILE="dump-remote.sql"

echo "Checking remote container..."
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "Error: Container '${CONTAINER_NAME}' is not running on remote server"
    docker ps --format "table {{.Names}}\t{{.Status}}"
    exit 1
fi

echo "Container is running"

echo "Dumping remote database..."
docker exec ${CONTAINER_NAME} pg_dump -U ${DB_USER} -d ${DB_NAME} --clean --if-exists > ${DUMP_FILE}

if [ $? -eq 0 ]; then
    echo "Remote database dumped successfully"
    
    # Verify
    FILE_SIZE=$(stat -c%s "${DUMP_FILE}")
    TABLES=$(grep -c "CREATE TABLE" "${DUMP_FILE}" || echo "0")
    
    echo "Dump file size: ${FILE_SIZE} bytes"
    echo "Tables found: ${TABLES}"
    
    if [ ${FILE_SIZE} -eq 0 ] || [ ${TABLES} -eq 0 ]; then
        echo "Warning: Dump file appears invalid"
        exit 1
    fi
    
    echo "Remote dump verified successfully"
else
    echo "Failed to dump remote database"
    exit 1
fi
ENDSSH
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Remote database dump completed successfully${NC}"
    else
        echo -e "${RED}✗ Remote database dump failed${NC}"
    fi
fi

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}Database Dump Complete!${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "Local dump file: ${GREEN}${DUMP_FILE}${NC}"
echo -e "Remote dump file: ${GREEN}${REMOTE_PATH}/dump-remote.sql${NC}"
echo ""
