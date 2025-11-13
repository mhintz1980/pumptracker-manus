// Example component demonstrating usage of getStageSegments selector
import React from 'react';
import { useApp } from '../../store';
import type { StageBlock } from '../../lib/schedule';

interface StageSegmentsExampleProps {
  pumpId: string;
}

export const StageSegmentsExample: React.FC<StageSegmentsExampleProps> = ({ pumpId }) => {
  // Use the new getStageSegments selector
  const stageSegments = useApp(state => state.getStageSegments(pumpId));
  const pumps = useApp(state => state.pumps);
  const pump = pumps.find(p => p.id === pumpId);

  if (!pump) {
    return <div>Pump not found</div>;
  }

  if (!pump.scheduledStart) {
    return (
      <div>
        <h3>Stage Segments for {pump.model} (Pump #{pump.serial})</h3>
        <p style={{ color: 'orange' }}>Pump is not scheduled</p>
      </div>
    );
  }

  if (!stageSegments) {
    return (
      <div>
        <h3>Stage Segments for {pump.model} (Pump #{pump.serial})</h3>
        <p style={{ color: 'red' }}>No stage segments available (missing lead times)</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'FABRICATION': '#3b82f6',
      'POWDER COAT': '#8b5cf6',
      'ASSEMBLY': '#10b981',
      'TESTING': '#f59e0b',
      'SHIPPING': '#ef4444'
    };
    return colors[stage] || '#6b7280';
  };

  return (
    <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <h3>Stage Segments for {pump.model} (Pump #{pump.serial})</h3>
      <p><strong>PO:</strong> {pump.po} | <strong>Customer:</strong> {pump.customer}</p>
      <p><strong>Scheduled:</strong> {formatDate(new Date(pump.scheduledStart))} - {pump.scheduledEnd ? formatDate(new Date(pump.scheduledEnd)) : 'TBD'}</p>

      <div style={{ marginTop: '16px' }}>
        <h4>Production Timeline:</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {stageSegments.map((segment: StageBlock, index: number) => (
            <div
              key={`${segment.stage}-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                backgroundColor: getStageColor(segment.stage),
                color: 'white',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <div style={{ flex: 1 }}>
                <strong>{segment.stage}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>{formatDate(segment.start)} - {formatDate(segment.end)}</div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                  {segment.days} business days
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '16px', fontSize: '12px', color: '#6b7280' }}>
        <p><em>This demonstrates the new getStageSegments selector from the Zustand store.</em></p>
        <p><em>• Memoized for performance</em></p>
        <p><em>• Handles missing data gracefully</em></p>
        <p><em>• Integrates with existing lead times system</em></p>
      </div>
    </div>
  );
};

export default StageSegmentsExample;