
export type UserRole = 'Admin' | 'StationManager' | 'Security' | 'EmergencyResponder' | 'Passenger';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface Incident {
  id: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  location: string;
  timestamp: string;
  status: 'Reported' | 'Dispatched' | 'Resolving' | 'Closed';
  description: string;
}

export interface TrainStatus {
  id: string;
  name: string;
  platform: string;
  status: 'On Time' | 'Delayed' | 'Arrived';
  eta: string;
}

export interface StationMetric {
  name: string;
  crowdDensity: number;
  activeIncidents: number;
  safetyScore: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
