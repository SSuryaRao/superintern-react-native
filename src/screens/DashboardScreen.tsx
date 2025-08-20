import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  SafeAreaView, 
  Text, 
  View, 
  StyleSheet, 
  ScrollView, 
  StatusBar, 
  Animated, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import auth from '@react-native-firebase/auth';
import AppHeader from '../components/AppHeader';
import { 
  getMyProfile, 
  getLeaderboard, 
  getAvailableTasks, 
  getMyAssignedTasks,
  applyForTask 
} from '../api/api';

// Define the Task type for better type safety
interface Task {
  _id: string;
  title: string;
  points: number;
  description: string;
  // Add other task properties as needed
}

const DashboardScreen = () => {
  const user = auth().currentUser;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // State for profile, leaderboard and tasks data and loading status
  const [profile, setProfile] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingTaskId, setApplyingTaskId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Available');

  // Function to fetch all necessary data from the backend
  const fetchData = async () => {
    try {
      const [profileRes, leaderboardRes, availableTasksRes, assignedTasksRes] = await Promise.all([
        getMyProfile(),
        getLeaderboard(),
        getAvailableTasks(),
        getMyAssignedTasks(),
      ]);

      setProfile(profileRes.data);
      setLeaderboard(leaderboardRes.data);
      setAvailableTasks(availableTasksRes.data);
      setAssignedTasks(assignedTasksRes.data);

    } catch (err) {
      console.log("Error fetching data:", err);
      Alert.alert("Error", "Could not fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Staggered fade-in and slide-up animation for the screen
    Animated.stagger(150, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animate progress bar when profile data changes
  useEffect(() => {
    if (profile && 'taskCompletionPercentage' in profile) {
      Animated.timing(progressAnim, {
        toValue: profile.taskCompletionPercentage || 0,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [profile]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  // Handle applying for a task
  const handleApply = async (taskId: string) => {
    setApplyingTaskId(taskId);
    try {
      await applyForTask(taskId);
      Alert.alert("Success", "You have successfully applied for the task!");
      // Refresh data to reflect changes
      fetchData();
    } catch (error: any) {
      console.error("Failed to apply for task:", error);
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      Alert.alert("Application Failed", errorMessage);
    } finally {
      setApplyingTaskId(null);
    }
  };

  // Greeting message based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Interpolate progress width for animation
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#6366F1" style={{ flex: 1, alignSelf: 'center' }} />
      </SafeAreaView>
    );
  }

  const renderTaskItem = (task: Task, isAvailable: boolean) => (
    <View style={styles.taskItem} key={task._id}>
      <View style={styles.taskInfo}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskPoints}>⭐ {task.points ?? 0} pts</Text>
      </View>
      {isAvailable && (
        <TouchableOpacity 
          style={[styles.applyButton, applyingTaskId === task._id && styles.applyButtonDisabled]}
          onPress={() => handleApply(task._id)}
          disabled={!!applyingTaskId}
        >
          {applyingTaskId === task._id ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.applyButtonText}>Apply</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
        <AppHeader />
      <StatusBar barStyle="dark-content" backgroundColor="#F0F5FF" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Animated.View style={{opacity: fadeAnim, transform: [{translateY: slideAnim}]}}>
          <View style={styles.greetingCard}>
            <View>
              <Text style={styles.greetingTitle}>{getGreeting()}!</Text>
              <Text style={styles.greetingName}>{profile?.name || user?.displayName || user?.email?.split('@')[0]}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Progress</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profile?.points ?? 0}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>#{profile?.rank ?? '-'}</Text>
                <Text style={styles.statLabel}>Rank</Text>
              </View>
            </View>
            <View style={styles.progressWrapper}>
              <Text style={styles.progressLabel}>Task Completion</Text>
              <View style={styles.progressBarBackground}>
                <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
              </View>
              <Text style={styles.progressPercent}>
                {Math.round(profile?.taskCompletionPercentage ?? 0)}%
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.tabContainer}>
              <TouchableOpacity onPress={() => setActiveTab('Available')} style={[styles.tab, activeTab === 'Available' && styles.activeTab]}>
                <Text style={[styles.tabText, activeTab === 'Available' && styles.activeTabText]}>Available Tasks</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('Current')} style={[styles.tab, activeTab === 'Current' && styles.activeTab]}>
                <Text style={[styles.tabText, activeTab === 'Current' && styles.activeTabText]}>Current Tasks</Text>
              </TouchableOpacity>
            </View>
            
            {activeTab === 'Available' ? (
              availableTasks.length > 0 ? (
                availableTasks.map(task => renderTaskItem(task, true))
              ) : (
                <Text style={styles.noTasksText}>No available tasks at the moment.</Text>
              )
            ) : (
              assignedTasks.length > 0 ? (
                assignedTasks.map(task => renderTaskItem(task, false))
              ) : (
                <Text style={styles.noTasksText}>You have no assigned tasks.</Text>
              )
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F5FF' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  greetingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#92400E',
  },
  greetingName: {
    fontSize: 16,
    color: '#B45309',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  progressWrapper: {},
  progressLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 6,
  },
  progressPercent: {
    alignSelf: 'flex-end',
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeTabText: {
    color: '#6366F1',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  taskInfo: {
    flex: 1,
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  taskPoints: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  applyButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  applyButtonDisabled: {
    backgroundColor: '#A5B4FC',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noTasksText: {
    textAlign: 'center',
    color: '#6B7280',
    paddingVertical: 20,
  },
});

export default DashboardScreen;
