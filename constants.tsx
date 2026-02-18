
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
    logs: [
      '14:30 - Incident reported by passenger.',
      '14:32 - Central Command notified.',
      '14:35 - Security team dispatched to Platform 4.'
    ]
  },
  {
    id: 'INC-002',
    type: 'Security Concern',
    severity: 'Medium',
    location: 'Entrance Gate A',
    timestamp: '2023-10-27 14:45',
    status: 'Reported',
    description: 'Unattended baggage spotted near the ticket counter.',
    logs: [
      '14:45 - Suspicious object detected by AI camera.',
      '14:46 - Alert sent to nearest guard.'
    ]
  },
  {
    id: 'INC-003',
    type: 'Platform Brawl',
    severity: 'Critical',
    location: 'Platform 2 - South End',
    timestamp: '2023-10-27 15:10',
    status: 'Resolving',
    description: 'Physical altercation between two passenger groups. Crowd gathering.',
    logs: [
      '15:10 - Crowd disturbance detected.',
      '15:12 - Security Unit 2 dispatched.',
      '15:15 - Officers on scene. De-escalation in progress.'
    ]
  },
  {
    id: 'INC-004',
    type: 'Lost Child',
    severity: 'Medium',
    location: 'Main Concourse',
    timestamp: '2023-10-27 15:25',
    status: 'Reported',
    description: 'Child approx 6 years old found crying near Help Desk.',
    logs: [
      '15:25 - Child reported by station staff.',
      '15:28 - Announcement made on PA system.'
    ]
  },
];

export const STATION_DATA: StationMetric = {
  name: 'New Delhi Central',
  crowdDensity: 78,
  activeIncidents: 2,
  safetyScore: 92,
};
