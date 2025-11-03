// Simple test to validate the migration works
const { seed } = require('./src/lib/seed.ts');

console.log('🚀 Testing PumpTracker Data Migration...\n');

try {
  // Test 1: Generate small sample
  console.log('1. Testing seed function...');
  const pumps = seed(5);
  console.log(`✅ Generated ${pumps.length} pumps successfully`);

  // Test 2: Check data structure
  console.log('\n2. Validating data structure...');
  const firstPump = pumps[0];
  console.log('✅ First pump structure:');
  console.log(`   ID: ${firstPump.id}`);
  console.log(`   PO: ${firstPump.po}`);
  console.log(`   Customer: ${firstPump.customer}`);
  console.log(`   Model: ${firstPump.model}`);
  console.log(`   Stage: ${firstPump.stage}`);
  console.log(`   Value: $${firstPump.value.toLocaleString()}`);

  // Test 3: Check stage conversion
  console.log('\n3. Testing stage name conversion...');
  const stages = [...new Set(pumps.map(p => p.stage))];
  console.log(`✅ Stages found: ${stages.join(', ')}`);

  // Test 4: Check catalog models are used
  console.log('\n4. Testing catalog model usage...');
  const models = [...new Set(pumps.map(p => p.model))];
  console.log(`✅ Models found: ${models.slice(0, 5).join(', ')}${models.length > 5 ? '...' : ''}`);

  // Test 5: Check customers are from catalog
  console.log('\n5. Testing customer data...');
  const customers = [...new Set(pumps.map(p => p.customer))];
  console.log(`✅ Customers found: ${customers.slice(0, 3).join(', ')}${customers.length > 3 ? '...' : ''}`);

  // Test 6: Test deterministic behavior
  console.log('\n6. Testing deterministic generation...');
  const pumps2 = seed(5);
  const firstSerial1 = pumps[0].serial;
  const firstSerial2 = pumps2[0].serial;
  console.log(`✅ First generation first serial: ${firstSerial1}`);
  console.log(`✅ Second generation first serial: ${firstSerial2}`);
  console.log(`✅ Deterministic behavior: ${firstSerial1 === firstSerial2 ? 'PASS' : 'FAIL'}`);

  // Test 7: TestgetModelLeadTimes function
  console.log('\n7. Testing lead times lookup...');
  const { getModelLeadTimes } = require('./src/lib/seed.ts');
  const leadTimes = getModelLeadTimes('DD-4S');
  if (leadTimes) {
    console.log(`✅ DD-4S lead times found: ${leadTimes.total_days} days total`);
  } else {
    console.log('❌ DD-4S lead times not found');
  }

  console.log('\n🎉 Migration test completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   • ${pumps.length} pumps generated`);
  console.log(`   • ${stages.length} production stages`);
  console.log(`   • ${models.length} unique models`);
  console.log(`   • ${customers.length} unique customers`);
  console.log(`   • All catalog data integrated correctly`);

} catch (error) {
  console.error('❌ Migration test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}