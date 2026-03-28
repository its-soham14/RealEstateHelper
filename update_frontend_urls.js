const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    "frontend/src/pages/BuyerDashboard.jsx",
    "frontend/src/pages/SellerDashboard.jsx",
    "frontend/src/pages/AdminDashboard.jsx",
    "frontend/src/pages/Login.jsx",
    "frontend/src/pages/Signup.jsx",
    "frontend/src/pages/Profile.jsx",
    "frontend/src/pages/PropertyDetails.jsx",
    "frontend/src/components/PropertyCard.jsx"
];

const importStatement = "import API_BASE_URL from '../config/api';\n";
const basePattern = /['"]http:\/\/localhost:8081(.*?)['"]/g;

for (const fileRelPath of filesToUpdate) {
    const fullPath = path.join(__dirname, fileRelPath);
    if (!fs.existsSync(fullPath)) {
        console.log(`File not found: ${fileRelPath}`);
        continue;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    if (content.includes("http://localhost:8081")) {
        if (!content.includes("import API_BASE_URL")) {
            // Find the last import and insert after it
            const lines = content.split('\n');
            let lastImportIdx = -1;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith("import ")) {
                    lastImportIdx = i;
                }
            }
            if (lastImportIdx !== -1) {
                lines.splice(lastImportIdx + 1, 0, importStatement.trim());
                content = lines.join('\n');
            } else {
                content = importStatement + content;
            }
        }

        // Replace occurrences with template literal syntax `${API_BASE_URL}...`
        content = content.replace(basePattern, '`${API_BASE_URL}$1`');

        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fileRelPath}`);
    } else {
        console.log(`No localhost URL found in ${fileRelPath}`);
    }
}
