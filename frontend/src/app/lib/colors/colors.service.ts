import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JColorsService {

  // Variants
  variants: { [key: string]: string } = {
    primary: 'bg-primary dark:bg-dark-primary text-white dark:text-white hover:bg-dark-primary dark:hover:bg-dark-primary/60 dark:hover:text-white',
    primary_secondary: 'bg-none text-dark-border dark:text-border border-dark-border dark:border-border hover:bg-dark-border/10 dark:hover:bg-border/10 shadow-md',  
    secondary: 'bg-background dark:bg-dark-background text-black dark:text-white hover:bg-accent dark:hover:bg-dark-accent/50',
    success: 'bg-green-500 hover:bg-green-600 text-white border border-green-500 dark:border-green-600 shadow-md',
    success_secondary: 'bg-none text-green-500 border-green-500 dark:border-green-600 hover:bg-green-500/10 dark:hover:bg-green-600/10 shadow-md',
    info: 'bg-blue-500 hover:bg-blue-600 text-white border border-blue-500 dark:border-blue-600 shadow-md',
    info_secondary: 'bg-none text-blue-500 border-blue-500 dark:border-blue-600 hover:bg-blue-500/10 dark:hover:bg-blue-600/10 shadow-md',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white border border-yellow-600 dark:border-yellow-700 shadow-md',
    warning_secondary: 'bg-none text-yellow-600 border-yellow-600 dark:border-yellow-700 hover:bg-yellow-600/10 dark:hover:bg-yellow-700/10 shadow-md',
    question: 'bg-purple-500 hover:bg-purple-600 text-white border border-purple-500 dark:border-purple-600 shadow-md',
    question_secondary: 'bg-none text-purple-500 border-purple-500 dark:border-purple-600 hover:bg-purple-500/10 dark:hover:bg-purple-600/10 shadow-md',
    error: 'bg-red-500 hover:bg-red-600 text-white border border-red-500 dark:border-red-600 shadow-md',
    error_secondary: 'bg-none text-red-500 border-red-500 dark:border-red-600 hover:bg-red-500/10 dark:hover:bg-red-600/10 shadow-md',
    loading: 'bg-gray-500 hover:bg-gray-600 text-white border border-gray-500 dark:border-gray-600 shadow-md',
    loading_secondary: 'bg-none text-gray-500 border-gray-500 dark:border-gray-600 hover:bg-gray-500/10 dark:hover:bg-gray-600/10 shadow-md',
   
    orange: 'bg-orange-500 hover:bg-orange-600 text-white border border-orange-500 dark:border-orange-600 shadow-md',
    orange_secondary: 'bg-none text-orange-500 border-orange-500 dark:border-orange-600 hover:bg-orange-500/10 dark:hover:bg-orange-600/10 shadow-md',
    cyan: 'bg-cyan-500 hover:bg-cyan-600 text-white border border-cyan-500 dark:border-cyan-600 shadow-md',
    cyan_secondary: 'bg-none text-cyan-500 border-cyan-500 dark:border-cyan-600 hover:bg-cyan-500/10 dark:hover:bg-cyan-600/10 shadow-md',
    purple: 'bg-purple-500 hover:bg-purple-600 text-white border border-purple-500 dark:border-purple-600 shadow-md',
    purple_secondary: 'bg-none text-purple-500 border-purple-500 dark:border-purple-600 hover:bg-purple-500/10 dark:hover:bg-purple-600/10 shadow-md',
    teal: 'bg-teal-500 hover:bg-teal-600 text-white border border-teal-500 dark:border-teal-600 shadow-md',
    teal_secondary: 'bg-none text-teal-500 border-teal-500 dark:border-teal-600 hover:bg-teal-500/10 dark:hover:bg-teal-600/10 shadow-md',
    pink: 'bg-pink-500 hover:bg-pink-600 text-white border border-pink-500 dark:border-pink-600 shadow-md',
    pink_secondary: 'bg-none text-pink-500 border-pink-500 dark:border-pink-600 hover:bg-pink-500/10 dark:hover:bg-pink-600/10 shadow-md',
    green: 'bg-green-500 hover:bg-green-600 text-white border border-green-500 dark:border-green-600 shadow-md',
    green_secondary: 'bg-none text-green-500 border-green-500 dark:border-green-600 hover:bg-green-500/10 dark:hover:bg-green-600/10 shadow-md',

    default: ' text-black dark:text-white shadow-md',
  };

  // Alerts
  getAlertClass(type: string, monocromatic: boolean) {
    if (!monocromatic) {
      switch (type) {
        case 'success': return 'border-green-500 bg-green-50 dark:bg-[#15241f]';
        case 'error': return 'border-red-500 bg-red-50 dark:bg-[#21181c]';
        case 'warning': return 'border-yellow-500 bg-yellow-50 dark:bg-[#1f1c1a]';
        case 'info': return 'border-blue-500 bg-blue-50 dark:bg-[#1a1a24]';
        case 'question': return 'border-purple-500 bg-purple-50 dark:bg-[#241732]';
        case 'loading': return 'border-gray-500 bg-gray-50 dark:bg-[#15181e]';
        default: return 'border-gray-500';
      }
    } else {
      return 'bg-white dark:bg-dark-popover border-border dark:border-dark-border';
    }
  }

  // Icons
  getIconClass(type: string, monocromatic: boolean) {
    if (!monocromatic) {
      switch (type) {
        case 'success': return 'text-green-500';
        case 'error': return 'text-red-500';
        case 'warning': return 'text-yellow-500';
        case 'info': return 'text-blue-500';
        case 'question': return 'text-purple-500';
        case 'loading': return 'text-gray-500';
        default: return 'text-primary';
      }
    } else {
      return 'text-primary';
    }
  }

  // Buttons
  getButtonClass(type: string, monocromatic: boolean): { [key: string]: boolean } {
    if (!monocromatic) {
      switch (type) {
        case 'success': return { 'success': true };
        case 'error': return { 'error': true };
        case 'warning': return { 'warning': true };
        case 'info': return { 'info': true };
        case 'question': return { 'question': true };
        case 'loading': return { 'loading': true };
        default: return { 'primary': true };
      }
    } else {
      return { 'primary': true };
    }
  }

  getButtonSecondaryClass(type: string, monocromatic: boolean): { [key: string]: boolean } {
    if (!monocromatic) {
      switch (type) {
        case 'success': return { 'success_secondary': true };
        case 'error': return { 'error_secondary': true };
        case 'warning': return { 'warning_secondary': true };
        case 'info': return { 'info_secondary': true };
        case 'question': return { 'question_secondary': true };
        case 'loading': return { 'loading_secondary': true };
        default: return { 'secondary': true };
      }
    } else {
      return { 'secondary': true };
    }
  }
}
