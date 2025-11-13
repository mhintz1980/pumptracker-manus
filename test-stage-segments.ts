// Test script to verify getStageSegments selector
import { useApp } from './src/store';

// Mock pump data for testing
const mockPump = {
  id: 'test-pump-id',
  serial: 1234,
  po: 'TEST-PO',
  customer: 'Test Customer',
  model: 'SAFE-4',
  stage: 'FABRICATION' as const,
  priority: 'Normal' as const,
  powder_color: 'Red',
  last_update: '2025-01-09T10:00:00Z',
  value: 52000,
  scheduledStart: '2025-01-10',
  scheduledEnd: '2025-01-20',
};

// Test the getStageSegments selector
function testStageSegments() {
  // Get the store instance
  const store = useApp.getState();

  // Add mock pump to store
  store.replaceDataset([mockPump]);

  // Test the selector
  const segments = store.getStageSegments('test-pump-id');

  console.log('Stage segments for test pump:', segments);

  if (segments) {
    console.log(`Found ${segments.length} stage segments:`);
    segments.forEach((segment, index) => {
      console.log(`  ${index + 1}. ${segment.stage}: ${segment.start.toISOString()} to ${segment.end.toISOString()} (${segment.days} days)`);
    });
  } else {
    console.log('No stage segments found (pump may be unscheduled)');
  }

  // Test edge cases
  console.log('\nTesting edge cases:');

  // Test with invalid pump ID
  const invalidSegments = store.getStageSegments('invalid-id');
  console.log('Invalid pump ID segments:', invalidSegments);

  // Test with unscheduled pump
  const unscheduledPump = { ...mockPump, id: 'unscheduled-pump', scheduledStart: undefined };
  store.replaceDataset([unscheduledPump]);
  const unscheduledSegments = store.getStageSegments('unscheduled-pump');
  console.log('Unscheduled pump segments:', unscheduledSegments);
}

// Run the test
testStageSegments();

export { testStageSegments };