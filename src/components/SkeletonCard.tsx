import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="tutor-card" style={{ minHeight: '440px' }}>
      <div className="skeleton" style={{ height: '200px', borderRadius: '0' }} />
      <div className="p-5 flex flex-col gap-3">
        <div className="skeleton" style={{ height: '20px', width: '60%', borderRadius: '8px' }} />
        <div className="skeleton" style={{ height: '14px', width: '40%', borderRadius: '8px' }} />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '12px', borderRadius: '6px' }} />
          ))}
        </div>
        <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--glass-border)' }} className="flex items-center justify-between">
          <div className="skeleton" style={{ height: '28px', width: '60px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '36px', width: '110px', borderRadius: '12px' }} />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
