import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * This is the root component of the application.
 * Its only job is to render the main navigator.
 * All navigation logic, including the auth check, is now handled inside AppNavigator.
 */
const App = () => {
  return <AppNavigator />;
};

export default App;
