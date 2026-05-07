const fs = require('fs');

try {
  const newVideos = JSON.parse(fs.readFileSync('./generated_videos.json', 'utf8'));
  let appContent = fs.readFileSync('./src/App.jsx', 'utf8');
  
  // Find where existing videos end
  const marker = "];\n\nconst CATEGORIES = [";
  const parts = appContent.split(marker);
  
  if (parts.length === 2) {
    // Format new videos properly
    const formattedVideos = newVideos.map(v => {
      return JSON.stringify(v, null, 2)
        .replace(/\"([a-zA-Z0-9_]+)\":/g, '$1:')
        .replace(/\"/g, "'");
    }).join(',\n\n');
    
    // Combine everything
    const newContent = parts[0] + ',\n\n' + formattedVideos + '\n];\n\nconst CATEGORIES = [' + parts[1];
    
    fs.writeFileSync('./src/App.jsx', newContent);
    console.log(`✅ Successfully added ${newVideos.length} videos to ALL_VIDEOS array`);
    console.log(`✅ Total videos now: ${newVideos.length + 215}`); // original had 215
  } else {
    console.log('❌ Could not find ALL_VIDEOS array closing position');
  }
  
} catch (err) {
  console.error('Error:', err);
}