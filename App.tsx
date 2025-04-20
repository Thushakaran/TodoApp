// import React, { useState } from 'react';
// import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
// import { create } from 'zustand';

// // Define types for TodoState
// interface TodoState {
//   tasks: string[];
//   input: string;
//   addTask: (task: string) => void;
//   removeTask: (task: string) => void;
// }

// // Zustand store for managing Todo state
// const useTodoStore = create<TodoState>((set) => ({
//   tasks: [],
//   input: '',
//   addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
//   removeTask: (task) => set((state) => ({ tasks: state.tasks.filter((t) => t !== task) }))
// }));

// const App = () => {
//   const [input, setInput] = useState<string>(''); // Local state for input
//   const { tasks, addTask, removeTask } = useTodoStore(); // Zustand store for tasks

//   // Handler to add a task
//   const handleAddTask = () => {
//     if (input.trim()) {
//       addTask(input);
//       setInput(''); // Clear input after adding task
//     }
//   };

//   // Render each task item
//   const renderTask = ({ item }: { item: string }) => (
//     <View style={styles.taskContainer}>
//       <Text style={styles.taskText}>{item}</Text>
//       <TouchableOpacity onPress={() => removeTask(item)}>
//         <Text style={styles.removeTaskText}>Remove</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>To-Do List</Text>
//       <TextInput
//         style={styles.input}
//         value={input}
//         onChangeText={setInput}
//         placeholder="Add a new task"
//       />
//       <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
//         <Text style={styles.addButtonText}>Add Task</Text>
//       </TouchableOpacity>
//       <FlatList
//         data={tasks}
//         renderItem={renderTask}
//         keyExtractor={(item, index) => index.toString()}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingLeft: 8,
//     width: '100%',
//     borderRadius: 5,
//   },
//   addButton: {
//     backgroundColor: '#6200ee',
//     padding: 10,
//     borderRadius: 5,
//     width: '100%',
//     marginBottom: 20,
//   },
//   addButtonText: {
//     color: '#fff',
//     textAlign: 'center',
//   },
//   taskContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     width: '100%',
//   },
//   taskText: {
//     fontSize: 18,
//   },
//   removeTaskText: {
//     color: 'red',
//     fontWeight: 'bold',
//   },
// });

// export default App;


import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { TaskScreen } from './src/screens/TaskScreen';

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

