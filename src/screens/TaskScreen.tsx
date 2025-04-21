import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
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
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Dialog states
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskAbout, setEditTaskAbout] = useState('');
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [shareMenuVisible, setShareMenuVisible] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = () => {
    if (!title.trim()) return;

    if (editingId) {
      updateTask(editingId, title, about);
      setEditingId(null);
    } else {
      addTask(title, about);
    }

    setTitle('');
    setAbout('');
  };

  const handleTaskPress = (taskId: string) => {
    setSelectedTaskId(selectedTaskId === taskId ? null : taskId);
  };

  const handleShare = (taskId: string) => {
    setShareMenuVisible(true);
  };

  const handleInfo = (taskId: string) => {
    // Implement info functionality
    console.log('Show info for task:', taskId);
  };

  const handleShareOption = (platform: string) => {
    // Implement share to specific platform
    console.log(`Share to ${platform}`);
    setShareMenuVisible(false);
  };

  const closeShareMenu = () => {
    setShareMenuVisible(false);
  };

  // Delete dialog handlers
  const showDeleteDialog = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
    setDeleteDialogVisible(false);
  };

  const handleDeleteCancel = () => {
    setTaskToDelete(null);
    setDeleteDialogVisible(false);
  };

  // Edit dialog handlers
  const showEditDialog = (task: any) => {
    setEditTaskId(task.id);
    setEditTaskTitle(task.title);
    setEditTaskAbout(task.about);
    setEditDialogVisible(true);
    setSelectedTaskId(null);
  };

  const handleEditSave = () => {
    if (editTaskId && editTaskTitle.trim()) {
      updateTask(editTaskId, editTaskTitle, editTaskAbout);
      setEditTaskId(null);
      setEditTaskTitle('');
      setEditTaskAbout('');
    }
    setEditDialogVisible(false);
  };

  const handleEditCancel = () => {
    setEditTaskId(null);
    setEditTaskTitle('');
    setEditTaskAbout('');
    setEditDialogVisible(false);
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
            <View style={styles.taskContainer}>
              <TouchableOpacity onPress={() => handleTaskPress(item.id)}>
                <Card style={styles.card}>
                  <Card.Content>
                    <View style={styles.taskHeader}>
                      <Text style={styles.title}>{item.title}</Text>
                      <IconButton
                        icon="close"
                        iconColor={ACCENT}
                        size={20}
                        onPress={() => showDeleteDialog(item.id)}
                        style={styles.closeButton}
                      />
                    </View>
                    <Text style={styles.about}>{item.about}</Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
              
              {selectedTaskId === item.id && (
                <View style={styles.actionButtonsContainer}>
                  <View style={styles.actionButtonWrapper}>
                    <IconButton
                      icon="share-variant"
                      iconColor="white"
                      size={24}
                      onPress={() => handleShare(item.id)}
                      style={styles.actionButton}
                      containerColor="#333"
                    />
                  </View>
                  <View style={styles.actionButtonWrapper}>
                    <IconButton
                      icon="information-outline"
                      iconColor="white"
                      size={24}
                      onPress={() => handleInfo(item.id)}
                      style={styles.actionButton}
                      containerColor="#333"
                    />
                  </View>
                  <View style={styles.actionButtonWrapper}>
                    <IconButton
                      icon="pencil"
                      iconColor="white"
                      size={24}
                      onPress={() => showEditDialog(item)}
                      style={styles.actionButton}
                      containerColor="#333"
                    />
                  </View>
                </View>
              )}
            </View>
          )}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Modal
        transparent={true}
        visible={deleteDialogVisible}
        animationType="fade"
        onRequestClose={handleDeleteCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.deleteDialog}>
            <View style={styles.deleteDialogContent}>
              <Text style={styles.deleteDialogText}>Delete this task?</Text>
              <View style={styles.deleteDialogButtons}>
                <TouchableOpacity 
                  style={[styles.dialogButton, styles.yesButton]} 
                  onPress={handleDeleteConfirm}
                >
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.dialogButton, styles.noButton]} 
                  onPress={handleDeleteCancel}
                >
                  <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Task Dialog */}
      <Modal
        transparent={true}
        visible={editDialogVisible}
        animationType="slide"
        onRequestClose={handleEditCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.editDialog}>
            <TextInput
              placeholder="Mini input..."
              value={editTaskTitle}
              onChangeText={setEditTaskTitle}
              mode="outlined"
              style={styles.editDialogInput}
              outlineColor={ACCENT}
              activeOutlineColor={ACCENT}
              textColor="white"
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Max input..."
              value={editTaskAbout}
              onChangeText={setEditTaskAbout}
              mode="outlined"
              style={styles.editDialogTextarea}
              outlineColor={ACCENT}
              activeOutlineColor={ACCENT}
              textColor="white"
              placeholderTextColor="#aaa"
              multiline={true}
              numberOfLines={6}
            />
            <View style={styles.editDialogButtons}>
              <TouchableOpacity 
                style={[styles.dialogButton, styles.cancelButton]} 
                onPress={handleEditCancel}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.dialogButton, styles.saveButton]} 
                onPress={handleEditSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Share Menu */}
      <Modal
        transparent={true}
        visible={shareMenuVisible}
        animationType="slide"
        onRequestClose={closeShareMenu}
      >
        <TouchableOpacity 
          style={styles.shareModalOverlay} 
          activeOpacity={1} 
          onPress={closeShareMenu}
        >
          <View style={styles.shareMenuContainer}>
            <View style={styles.shareMenu}>
              <TouchableOpacity 
                style={styles.shareOption} 
                onPress={() => handleShareOption('copy')}
              >
                <IconButton icon="content-copy" size={24} iconColor="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.shareOption} 
                onPress={() => handleShareOption('vk')}
              >
                <IconButton icon="vk" size={24} iconColor="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.shareOption} 
                onPress={() => handleShareOption('telegram')}
              >
                <IconButton icon="telegram" size={24} iconColor="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.shareOption} 
                onPress={() => handleShareOption('whatsapp')}
              >
                <IconButton icon="whatsapp" size={24} iconColor="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.shareOption} 
                onPress={() => handleShareOption('facebook')}
              >
                <IconButton icon="facebook" size={24} iconColor="white" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  taskContainer: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderColor: ACCENT,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    margin: 0,
    padding: 0,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
    paddingRight: 10,
    gap: 8,
  },
  actionButtonWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  actionButton: {
    margin: 0,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  about: {
    color: 'lightgray',
    fontSize: 14,
    marginTop: 4,
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Delete dialog styles
  deleteDialog: {
    width: '80%',
    backgroundColor: '#222',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ACCENT,
  },
  deleteDialogContent: {
    padding: 20,
  },
  deleteDialogText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  deleteDialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  // Edit dialog styles
  editDialog: {
    width: '80%',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: ACCENT,
  },
  editDialogInput: {
    backgroundColor: '#1e1e1e',
    marginBottom: 10,
  },
  editDialogTextarea: {
    backgroundColor: '#1e1e1e',
    marginBottom: 20,
    height: 150,
  },
  editDialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Button styles
  dialogButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  yesButton: {
    backgroundColor: ACCENT,
  },
  noButton: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: ACCENT,
  },
  cancelButton: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: ACCENT,
  },
  saveButton: {
    backgroundColor: ACCENT,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Share menu styles
  shareModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  shareMenuContainer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  shareMenu: {
    backgroundColor: '#222',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  shareOption: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default TaskScreen;