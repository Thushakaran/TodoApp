import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  IconButton,
  Card,
  Text,
  Button,
} from 'react-native-paper';
import { useTaskStore } from '../store/useTaskStore';

const ACCENT = '#ff8000';

const TaskScreen = () => {
  const { tasks, addTask, deleteTask, toggleTask, updateTask, loadTasks } = useTaskStore();

  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = () => {
    if (!title.trim()) return;

    if (editingId) {
      updateTask(editingId, title, about);
    } else {
      addTask(title, about);
    }

    setTitle('');
    setAbout('');
    setEditingId(null);
  };

  const handleEdit = (task: any) => {
    setTitle(task.title);
    setAbout(task.about);
    setEditingId(task.id);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Input Section */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Title..."
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.inputBox}
            outlineColor={ACCENT}
            activeOutlineColor={ACCENT}
            textColor="white"
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="About..."
            value={about}
            onChangeText={setAbout}
            mode="outlined"
            style={styles.inputBox}
            outlineColor={ACCENT}
            activeOutlineColor={ACCENT}
            textColor="white"
            placeholderTextColor="#aaa"
          />
        </View>
        <IconButton
          icon="plus"
          mode="contained"
          onPress={handleSubmit}
          containerColor={ACCENT}
          iconColor="white"
          size={32}
          style={styles.addButton}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        <Button onPress={() => setFilter('all')} textColor="white">All</Button>
        <Button onPress={() => setFilter('completed')} textColor="white">Completed</Button>
        <Button onPress={() => setFilter('pending')} textColor="white">Pending</Button>
      </View>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <View style={styles.emptyView}>
          <Text style={styles.noTasks}>No tasks</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <Card style={styles.card}>
                <Card.Content style={styles.taskContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.about}>{item.about}</Text>
                  </View>
                  <View style={styles.taskActions}>
                    <IconButton
                      icon="pencil"
                      iconColor={ACCENT}
                      onPress={() => handleEdit(item)}
                    />
                    <IconButton
                      icon="check"
                      iconColor={item.completed ? 'green' : 'gray'}
                      onPress={() => toggleTask(item.id)}
                    />
                    <IconButton
                      icon="delete"
                      iconColor={ACCENT}
                      onPress={() => deleteTask(item.id)}
                    />
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    gap: 8,
  },
  inputBox: {
    backgroundColor: '#1e1e1e',
    height: 35,
  },
  addButton: {
    borderRadius: 12,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderColor: ACCENT,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 12,
  },
  taskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  about: {
    color: 'lightgray',
    fontSize: 14,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasks: {
    color: 'white',
    fontSize: 18,
    borderBottomColor: ACCENT,
    borderBottomWidth: 2,
    paddingBottom: 4,
  },
});

export default TaskScreen;