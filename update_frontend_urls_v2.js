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

for (const fileRelPath of filesToUpdate) {
    const fullPath = path.join(__dirname, fileRelPath);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, 'utf8');

    if (content.includes("http://localhost:8081")) {
        // Replace remaining occurrences that are already inside template literals
        content = content.replace(/http:\/\/localhost:8081/g, '${API_BASE_URL}');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated remaining in ${fileRelPath}`);
    }
}
