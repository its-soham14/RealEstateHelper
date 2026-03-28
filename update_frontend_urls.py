import os
import re

files_to_update = [
    "frontend/src/pages/BuyerDashboard.jsx",
    "frontend/src/pages/SellerDashboard.jsx",
    "frontend/src/pages/AdminDashboard.jsx",
    "frontend/src/pages/Login.jsx",
    "frontend/src/pages/Signup.jsx",
    "frontend/src/pages/Profile.jsx",
    "frontend/src/pages/PropertyDetails.jsx",
    "frontend/src/components/PropertyCard.jsx"
]

import_statement = "import API_BASE_URL from '../config/api';\n"
base_pattern = re.compile(r"['\"]http://localhost:8081(.*?)['\"]")

for file_path in files_to_update:
    full_path = os.path.join(os.getcwd(), file_path)
    if not os.path.exists(full_path):
        print(f"File not found: {file_path}")
        continue
        
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if "http://localhost:8081" in content:
        # Check if import is already there
        if "import API_BASE_URL" not in content:
            # Find the first import line and insert after it, or basically at the top after React imports
            # We can insert it at the very top. But some linters prefer after react.
            # Let's just insert at the top:
            lines = content.splitlines()
            # Find last import
            last_import_idx = 0
            for i, line in enumerate(lines):
                if line.startswith("import "):
                    last_import_idx = i
            lines.insert(last_import_idx + 1, import_statement.strip())
            content = "\\n".join(lines) + "\\n"
            
        # Replace occurrences
        # e.g., 'http://localhost:8081/api/properties' -> `${API_BASE_URL}/api/properties`
        content = base_pattern.sub(r"`${API_BASE_URL}\g<1>`", content)
        
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")
    else:
        print(f"No localhost URL found in {file_path}")
