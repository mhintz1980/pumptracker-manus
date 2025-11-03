// Quick test to see what our seed function generates
console.log('🔍 Testing seed function...\n');

// Since we can't easily import TypeScript in Node, let's check the catalog data directly
const fs = require('fs');
const path = require('path');

try {
  const catalogPath = path.join(__dirname, 'src/data/pumptracker-data.json');
  const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

  console.log('📋 Catalog Data Summary:');
  console.log(`• Models: ${catalogData.models.length}`);
  console.log(`• Customers: ${catalogData.customers.length}`);
  console.log(`• Production Stages: ${catalogData.productionStages.length}`);

  console.log('\n🏭 Available Models:');
  catalogData.models.forEach((model, i) => {
    console.log(`${i + 1}. ${model.model} - $${model.price?.toLocaleString() || 'NULL'} - ${model.description}`);
    console.log(`   Engine: ${model.bom.engine || 'NULL'}`);
    console.log(`   Lead Time: ${model.lead_times.total_days} days`);
  });

  console.log('\n👥 Customers:');
  catalogData.customers.forEach((customer, i) => {
    console.log(`${i + 1}. ${customer}`);
  });

  console.log('\n🔧 Production Stages:');
  catalogData.productionStages.forEach((stage, i) => {
    console.log(`${i + 1}. "${stage}" → "${stage.toUpperCase().replace(' ', '_')}"`);
  });

  console.log('\n✅ Catalog data is accessible and properly formatted!');

} catch (error) {
  console.error('❌ Error reading catalog data:', error.message);
}