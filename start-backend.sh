#!/bin/bash

echo "Setting up DevLog backend..."

cd ~/project/devlog/backend

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install all packages
echo "Installing packages..."
pip install fastapi uvicorn sqlalchemy alembic python-multipart httpx python-dotenv pydantic==1.10.13 email-validator==2.1.0 --quiet
pip install "python-jose[cryptography]" --quiet

# Install correct bcrypt (no passlib)
pip uninstall bcrypt passlib -y --quiet 2>/dev/null
pip install bcrypt==3.2.2 --quiet

# Fix Python 3.9 compatibility issues
echo "Applying compatibility fixes..."

# Fix schemas/user.py
sed -i '' 's/user_id: int | None = None/user_id: Optional[int] = None/' ~/project/devlog/backend/app/schemas/user.py 2>/dev/null
sed -i '' 's/from pydantic import BaseModel, EmailStr/from pydantic import BaseModel, EmailStr\nfrom typing import Optional/' ~/project/devlog/backend/app/schemas/user.py 2>/dev/null

# Fix utils/auth.py return type
sed -i '' 's/def decode_access_token(token: str) -> TokenData | None:/def decode_access_token(token: str):/' ~/project/devlog/backend/app/utils/auth.py 2>/dev/null

# Fix utils/auth.py - replace passlib with bcrypt directly
python3 << 'PYEOF'
import re

path = "/Users/mahekpatel/project/devlog/backend/app/utils/auth.py"

with open(path, "r") as f:
    content = f.read()

# Remove passlib import and pwd_context
content = re.sub(r'from passlib\.context import CryptContext\n', '', content)
content = re.sub(r'pwd_context\s*=\s*CryptContext\(schemes=\["bcrypt"\], deprecated="auto"\)\n', '', content)

# Replace hash_password function
content = re.sub(
    r'def hash_password\(password: str\) -> str:\n\s+return pwd_context\.hash\(password\)',
    'def hash_password(password: str) -> str:\n    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")',
    content
)

# Replace verify_password function
content = re.sub(
    r'def verify_password\(plain: str, hashed: str\) -> bool:\n\s+return pwd_context\.verify\(plain, hashed\)',
    'def verify_password(plain: str, hashed: str) -> bool:\n    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))',
    content
)

# Add bcrypt import if not already there
if 'import bcrypt' not in content:
    content = 'import bcrypt\n' + content

with open(path, "w") as f:
    f.write(content)

print("utils/auth.py fixed successfully")
PYEOF

echo ""
echo "All done! Starting server..."
echo ""
uvicorn app.main:app --reload
