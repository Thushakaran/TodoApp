import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { TextInput, Button, Checkbox, IconButton, Card, Text } from 'react-native-paper';
import { useTaskStore } from '../store/useTaskStore';

export const TaskScreen = () => {
  const [title, setTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const { tasks, addTask, deleteTask, toggleTask, loadTasks, updateTask } = useTaskStore();

  const loadTasksMemoized = useCallback(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadTasksMemoized();
  }, [loadTasksMemoized]);

  const handleAdd = () => {
    if (title.trim()) {
      addTask(title);
      setTitle(''); // Reset input after adding a task
    }
  };

  const handleEdit = (taskId: string, currentTitle: string) => {
    setEditingTaskId(taskId);
    setTitle(currentTitle);
  };

  const handleUpdate = () => {
    if (editingTaskId && title.trim()) {
      updateTask(editingTaskId, title); // Update task
      setTitle('');
      setEditingTaskId(null); // Clear editing state
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setTitle('');
  };

  const handleDelete = (id: string) => {
    deleteTask(id); // Optimistically delete the task
  };

  // Filter tasks based on filter state
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true; // Show all tasks
  });

  return (
    <View style={styles.container}>
      <TextInput
        label={editingTaskId ? 'Edit Task' : 'New Task'}
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      {editingTaskId ? (
        <>
          <Button mode="contained" onPress={handleUpdate} style={styles.button}>
            Update Task
          </Button>
          <Button mode="outlined" onPress={handleCancelEdit} style={styles.button}>
            Cancel
          </Button>
        </>
      ) : (
        <Button mode="contained" onPress={handleAdd} style={styles.button}>
          Add Task
        </Button>
      )}

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <Button onPress={() => setFilter('all')} icon="view-list">
          Show All
        </Button>
        <Button onPress={() => setFilter('completed')} icon="check-circle-outline">
          Show Completed
        </Button>
        <Button onPress={() => setFilter('pending')} icon="clock-outline">
          Show Pending
        </Button>
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content style={styles.taskRow}>
              <Checkbox
                status={item.completed ? 'checked' : 'unchecked'}
                onPress={() => toggleTask(item.id)}
              />
              <Text style={[styles.taskText, item.completed && styles.completed]}>
                {item.title}
              </Text>
              <IconButton
                icon="delete"
                onPress={() => handleDelete(item.id)} // Optimistic delete
              />
              <IconButton
                icon="pencil"
                onPress={() => handleEdit(item.id, item.title)} // Handle edit
              />
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  card: {
    marginBottom: 8,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});

export default TaskScreen;
