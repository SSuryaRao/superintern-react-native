// FILE: src/screens/LeaderboardScreen.tsx

import React from 'react';
import { SafeAreaView, Text, View, StyleSheet, ScrollView, StatusBar, FlatList } from 'react-native';
import { SvgXml } from 'react-native-svg';
import AppHeader from '../components/AppHeader';

const crownIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path></svg>`;

// FIX: Define a type for our ranking data
type RankingItemType = {
  id: string;
  name: string;
  points: number;
  tasks: number;
  rank: number;
  tag: string;
};

const leaderboardData: RankingItemType[] = [
  { id: '1', name: 'Sarah Chen', points: 1580, tasks: 24, rank: 1, tag: 'Expert Intern' },
  { id: '2', name: 'Marcus Rodriguez', points: 1420, tasks: 22, rank: 2, tag: 'Advanced Intern' },
  { id: '3', name: 'Alex Johnson', points: 1250, tasks: 20, rank: 3, tag: 'Advanced Intern' },
  { id: '4', name: 'Emily White', points: 1190, tasks: 18, rank: 4, tag: 'Advanced Intern' },
  { id: '5', name: 'David Lee', points: 1050, tasks: 15, rank: 5, tag: 'Intermediate Intern' },
];

const LeaderboardScreen = () => {
  // FIX: Apply the type to the 'item' parameter
  const renderRankingItem = ({ item }: { item: RankingItemType }) => (
    <View style={styles.rankingItem}>
      <Text style={styles.rankingRank}>#{item.rank}</Text>
      <View style={styles.rankingUser}>
        <View style={styles.rankingAvatar}>
          <Text style={styles.rankingAvatarText}>{item.name.split(' ').map(n => n[0]).join('')}</Text>
        </View>
        <View>
          <Text style={styles.rankingName}>{item.name}</Text>
          <Text style={styles.rankingInfo}>{item.points} points • {item.tasks} tasks</Text>
        </View>
      </View>
      <Text style={styles.rankingTag}>{item.tag}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Leaderboard</Text>
          <Text style={styles.headerSubtitle}>See how you rank among fellow interns</Text>
        </View>
        <View style={styles.podiumContainer}>
            <View style={[styles.podiumItem, styles.podiumSecond]}>
                <View style={styles.podiumAvatar}><Text style={styles.podiumAvatarText}>MR</Text></View>
                <Text style={styles.podiumName}>Marcus Rodriguez</Text>
                <Text style={styles.podiumPoints}>1420</Text>
            </View>
            <View style={[styles.podiumItem, styles.podiumFirst]}>
                <SvgXml xml={crownIcon} width={24} height={24} stroke="#FBBF24" style={{marginBottom: 4}}/>
                <View style={[styles.podiumAvatar, {borderColor: '#FBBF24'}]}><Text style={styles.podiumAvatarText}>SC</Text></View>
                <Text style={styles.podiumName}>Sarah Chen</Text>
                <Text style={styles.podiumPoints}>1580</Text>
            </View>
            <View style={[styles.podiumItem, styles.podiumThird]}>
                <View style={styles.podiumAvatar}><Text style={styles.podiumAvatarText}>AJ</Text></View>
                <Text style={styles.podiumName}>Alex Johnson</Text>
                <Text style={styles.podiumPoints}>1250</Text>
            </View>
        </View>
        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>All Rankings</Text>
          <FlatList
            data={leaderboardData}
            renderItem={renderRankingItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { padding: 20 },
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  headerSubtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  tasksSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  podiumContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 32, height: 200 },
  podiumItem: { alignItems: 'center', width: 100 },
  podiumSecond: { height: '75%', backgroundColor: '#F1F5F9', justifyContent: 'center', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  podiumFirst: { height: '100%', backgroundColor: '#FEF3C7', justifyContent: 'center', borderRadius: 16, marginHorizontal: -8, zIndex: 1 },
  podiumThird: { height: '60%', backgroundColor: '#FFE4E6', justifyContent: 'center', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  podiumAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 2, borderColor: '#9CA3AF' },
  podiumAvatarText: { color: '#FFFFFF', fontWeight: 'bold' },
  podiumName: { fontWeight: '600', color: '#374151' },
  podiumPoints: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  rankingItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12 },
  rankingRank: { fontSize: 16, fontWeight: 'bold', color: '#6B7280', width: 40 },
  rankingUser: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rankingAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rankingAvatarText: { color: '#4338CA', fontWeight: 'bold' },
  rankingName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  rankingInfo: { fontSize: 12, color: '#6B7280' },
  rankingTag: { backgroundColor: '#F3F4F6', color: '#4B5563', fontSize: 12, fontWeight: '500', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
});

export default LeaderboardScreen;