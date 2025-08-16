import React from 'react';
import { SafeAreaView, Text, View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SvgXml } from 'react-native-svg';
import AppHeader from '../components/AppHeader'; // Import the new header

// Icons... (keep the existing icon code)
const starIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
const trophyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 15h1.5a2.5 2.5 0 0 1 0 5H4"></path><path d="M19.5 15H18a2.5 2.5 0 0 0 0 5h1.5"></path><path d="M12 6V3"></path><path d="M12 21v-3"></path><path d="M9 12H3"></path><path d="M21 12h-6"></path><circle cx="12" cy="12" r="4"></circle></svg>`;
const sendIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const taskIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>`;


const DashboardScreen = () => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" />
    <AppHeader />
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome back!</Text>
        <Text style={styles.headerSubtitle}>Keep up the great work on your internship journey</Text>
      </View>
      {/* Rest of the screen content... */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, {backgroundColor: '#FFFBEB'}]}>
          <SvgXml xml={starIcon} width={24} height={24} stroke="#F59E0B" />
          <Text style={styles.statValue}>1250</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>
        <View style={[styles.statCard, {backgroundColor: '#EFF6FF'}]}>
           <SvgXml xml={trophyIcon} width={24} height={24} stroke="#3B82F6" />
          <Text style={styles.statValue}>#3</Text>
          <Text style={styles.statLabel}>Leaderboard Rank</Text>
        </View>
        <View style={[styles.statCard, {backgroundColor: '#F0FDF4'}]}>
           <SvgXml xml={sendIcon} width={24} height={24} stroke="#22C55E" />
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Applications</Text>
        </View>
        <View style={[styles.statCard, {backgroundColor: '#FAF5FF'}]}>
           <SvgXml xml={checkIcon} width={24} height={24} stroke="#8B5CF6" />
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
      </View>
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <SvgXml xml={taskIcon} width={20} height={20} stroke="#6B7280" />
          <Text style={styles.progressTitle}>Task Progress</Text>
          <Text style={styles.progressTag}>Advanced Intern</Text>
        </View>
        <Text style={styles.progressInfo}>15 of 20 tasks completed</Text>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
        <Text style={styles.progressPercent}>75%</Text>
      </View>
      <View style={styles.tasksSection}>
        <Text style={styles.sectionTitle}>Available Tasks</Text>
        <View style={styles.taskCard}>
          <Text style={styles.taskTitle}>API Documentation</Text>
          <Text style={styles.taskDescription}>Write comprehensive documentation for the REST API endpoints</Text>
          <View style={styles.taskFooter}>
            <Text style={styles.taskPoints}>⭐ 40 pts</Text>
            <Text style={styles.taskDueDate}>Due 8/20/2025</Text>
            <View style={styles.applyButton}>
              <SvgXml xml={sendIcon} width={16} height={16} stroke="#FFFFFF" />
              <Text style={styles.applyButtonText}>Apply</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  headerSubtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', borderRadius: 16, padding: 16, marginBottom: 16, alignItems: 'flex-start' },
  statValue: { fontSize: 24, fontWeight: 'bold', marginTop: 8, color: '#111827' },
  statLabel: { fontSize: 14, color: '#4B5563', marginTop: 2 },
  progressCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 },
  progressHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  progressTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginLeft: 8 },
  progressTag: { backgroundColor: '#E0E7FF', color: '#4338CA', fontSize: 12, fontWeight: '500', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginLeft: 'auto' },
  progressInfo: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  progressBarBackground: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { width: '75%', height: '100%', backgroundColor: '#8B5CF6', borderRadius: 4 },
  progressPercent: { alignSelf: 'flex-end', marginTop: 4, fontSize: 12, color: '#6B7280', fontWeight: '500' },
  tasksSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  taskCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 },
  taskTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  taskDescription: { fontSize: 14, color: '#6B7280', marginTop: 4, marginBottom: 16 },
  taskFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  taskPoints: { fontSize: 14, fontWeight: '500', color: '#4B5563' },
  taskDueDate: { fontSize: 14, color: '#6B7280' },
  applyButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6366F1', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  applyButtonText: { color: '#FFFFFF', fontWeight: '600', marginLeft: 6 },
});

export default DashboardScreen;