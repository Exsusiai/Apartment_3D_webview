const fs = require('fs');
const path = require('path');

// Path to apartments directory
const apartmentsDir = path.join(__dirname, '..', 'public', 'apartments');
const outputPath = path.join(__dirname, '..', 'public', 'apartments-list.json');

// Function to check if a directory contains a valid apartment
function isValidApartment(dirPath) {
  try {
    // Check if config.json exists
    const configPath = path.join(dirPath, 'config.json');
    if (!fs.existsSync(configPath)) {
      return false;
    }
    
    // Try to parse config.json to ensure it's valid
    const configContent = fs.readFileSync(configPath, 'utf8');
    JSON.parse(configContent);
    
    return true;
  } catch (error) {
    console.warn(`Invalid apartment in ${dirPath}:`, error.message);
    return false;
  }
}

// Function to check if apartment has 3D model
function hasModel(dirPath) {
  const objPath = path.join(dirPath, 'textured_output.obj');
  return fs.existsSync(objPath);
}

// Function to check if apartment has shotcut image
function hasShotcut(dirPath) {
  const shotcutPath = path.join(dirPath, 'shotcut.png');
  return fs.existsSync(shotcutPath);
}

// Main function to generate apartments list
function generateApartmentsList() {
  console.log('Generating apartments list...');
  
  try {
    // Read all directories in apartments folder
    const entries = fs.readdirSync(apartmentsDir, { withFileTypes: true });
    
    // Filter and process valid apartment directories
    const apartments = entries
      .filter(entry => entry.isDirectory())
      .map(entry => {
        const dirPath = path.join(apartmentsDir, entry.name);
        
        // Skip if not a valid apartment
        if (!isValidApartment(dirPath)) {
          return null;
        }
        
        return {
          id: entry.name,
          hasModel: hasModel(dirPath),
          hasShotcut: hasShotcut(dirPath)
        };
      })
      .filter(Boolean) // Remove null entries
      .sort((a, b) => a.id.localeCompare(b.id)); // Sort by folder name
    
    // Write the list to JSON file
    const output = {
      apartments: apartments,
      generatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    
    console.log(`Successfully generated apartments list with ${apartments.length} apartments`);
    console.log('Apartments found:', apartments.map(a => a.id).join(', '));
    
  } catch (error) {
    console.error('Error generating apartments list:', error);
    process.exit(1);
  }
}

// Run the script
generateApartmentsList(); 