
import React from 'react';
import { TrainStatus, Incident, StationMetric } from './types';

export const COLORS = {
  primary: '#1E40AF', // Deep Blue
  secondary: '#059669', // Emerald Green
  accent: '#EA580C', // Bright Orange
  danger: '#DC2626',
  warning: '#FBBF24',
};

export const MOCK_TRAINS: TrainStatus[] = [
  { id: 'T101', name: 'Rajdhani Express', platform: '4', status: 'On Time', eta: '10 mins' },
  { id: 'T102', name: 'Shatabdi Express', platform: '2', status: 'Delayed', eta: '25 mins' },
  { id: 'T103', name: 'Duronto Express', platform: '1', status: 'Arrived', eta: 'Now' },
  { id: 'T104', name: 'Garib Rath', platform: '6', status: 'On Time', eta: '15 mins' },
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-001',
    type: 'Medical Emergency',
    severity: 'High',
    location: 'Platform 4',
    timestamp: '2023-10-27 14:30',
    status: 'Dispatched',
    description: 'Passenger collapsed near the waiting area.',
  },
  {
    id: 'INC-002',
    type: 'Security Concern',
    severity: 'Medium',
    location: 'Entrance Gate A',
    timestamp: '2023-10-27 14:45',
    status: 'Reported',
    description: 'Unattended baggage spotted near the ticket counter.',
  },
];

export const STATION_DATA: StationMetric = {
  name: 'New Delhi Central',
  crowdDensity: 78,
  activeIncidents: 2,
  safetyScore: 92,
};
