export interface Message {
    id?: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp?: any;
    isEmergency?: boolean;
  }
  
  export interface EmergencyType {
    id: string;
    name: string;
    icon: string;
    color: string;
  }
  
  export interface LocationData {
    latitude: number;
    longitude: number;
    accuracy?: number;
    address?: string;
  }
  
  export interface UserData {
    firstName?: string;
    lastName?: string;
    policeStation?: string;
    address?: string;
    phone?: string;
  }