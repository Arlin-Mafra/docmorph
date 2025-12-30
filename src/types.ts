
export enum AppRoute {
  WELCOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  FORGOT_PASSWORD = '/forgot-password',
  DASHBOARD = '/dashboard',
  UPLOAD = '/upload',
  CONFIG = '/config',
  PAYMENT = '/payment',
  CONFIRMATION = '/confirmation',
  HISTORY = '/history',
  SETTINGS = '/settings',
  PROFILE = '/profile',
  CHANGE_PASSWORD = '/change-password',
  PAYMENT_HISTORY = '/payment-history'
}

export interface DocumentFile {
  id: string;
  name: string;
  size: string;
  status: 'Pronto' | 'Processando' | 'Erro';
  type: 'pdf' | 'doc' | 'jpg' | 'png';
  date: string;
  time: string;
  action?: string;
}

export interface User {
  name: string;
  email: string;
  isPro: boolean;
  avatar: string;
}
