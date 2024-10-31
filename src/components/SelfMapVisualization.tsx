import React, { useMemo } from 'react';
import { clsx } from 'clsx';
import type { IdentityData, ProcessedIdentityData } from '../types/identity';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';
import SelfMapChart from './SelfMapChart';

interface SelfMapVisualizationProps {
  data: IdentityData;
  className?: string;
}

export const SelfMapVisualization: React.FC<SelfMapVisualizationProps> = ({ 
  data,
  className 
}) => {
  const { processedData, error } = useMemo(() => {
    if (!data) {
      return { error: "No data provided", processedData: null };
    }

    try {
      const processed: ProcessedIdentityData[] = Object.entries(data)
        .filter(([_, value]) => 
          typeof value === 'object' && 
          value !== null && 
          'Strength' in value &&
          typeof value.Strength === 'number'
        )
        .map(([key, value]) => ({
          name: key,
          strength: value.Strength,
          details: value
        }));

      if (processed.length === 0) {
        return { error: "No valid data points found", processedData: null };
      }

      return { processedData: processed, error: null };
    } catch (err) {
      return { 
        error: err instanceof Error ? err.message : "An error occurred processing the data",
        processedData: null 
      };
    }
  }, [data]);

  if (error) return <ErrorDisplay message={error} />;
  if (!processedData) return <LoadingSpinner />;

  const containerHeight = Math.min(window.innerHeight * 0.8, 700);
  const margin = {
    top: containerHeight * 0.086,
    right: window.innerWidth * 0.178,
    bottom: containerHeight * 0.086,
    left: window.innerWidth * 0.067
  };

  return (
    <div className={clsx(
      "w-full bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl",
      className
    )}>
      <div className="w-full" style={{ height: containerHeight }}>
        <SelfMapChart
          data={processedData}
          width={window.innerWidth}
          height={containerHeight}
          margin={margin}
        />
      </div>
    </div>
  );
};

export default SelfMapVisualization;