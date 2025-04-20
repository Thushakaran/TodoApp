import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import TaskScreen from './src/screens/TaskScreen';

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <TaskScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;

