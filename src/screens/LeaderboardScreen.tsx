import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  SafeAreaView, 
  Text, 
  View, 
  StyleSheet, 
  FlatList, 
  Animated, 
  ActivityIndicator,
  RefreshControl,
  Alert 
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import auth from '@react-native-firebase/auth';
import { getLeaderboard } from '../api/api';

// --- SVG Icons ---
const crownIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFD700" stroke="#B45309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path></svg>`;

// --- Type Definition ---
type RankingItemType = {
  _id: string; // Assuming MongoDB ObjectId
  name: string;
  points: number;
  rank: number;
  uid: string; // Firebase UID
};

const LeaderboardScreen = () => {
  const user = auth().currentUser;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  const [leaderboardData, setLeaderboardData] = useState<RankingItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- Data Fetching ---
  const fetchLeaderboard = async () => {
    try {
      const response = await getLeaderboard();
      // **DEBUGGING: Log the raw API response**
      console.log("API Response:", JSON.stringify(response.data, null, 2));

      // Ensure data is an array before setting state
      if (Array.isArray(response.data)) {
        setLeaderboardData(response.data);
      } else {
        console.error("API did not return an array for leaderboard:", response.data);
        setLeaderboardData([]);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      Alert.alert("Error", "Could not load the leaderboard. Please try again.");
      setLeaderboardData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // --- Initial Animations ---
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

  // --- Pull-to-Refresh Handler ---
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLeaderboard();
  }, []);

  // --- Render Individual Ranking Item ---
  const renderRankingItem = ({ item }: { item: RankingItemType }) => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
      <View style={[styles.rankingItem, item.uid === user?.uid && styles.currentUserItem]}>
        <Text style={styles.rankingRank}>{item.rank}</Text>
        <View style={styles.rankingAvatar}>
          <Text style={styles.rankingAvatarText}>
            {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>
        <View style={styles.rankingNameContainer}>
          <Text style={styles.rankingName}>{item.name}</Text>
        </View>
        <Text style={styles.rankingPoints}>{item.points} pts</Text>
      </View>
    </Animated.View>
  );

  // --- Loading State ---
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#6366F1" style={{ flex: 1, alignSelf: 'center' }} />
      </SafeAreaView>
    );
  }

  // --- Data for Podium and List ---
  const top3 = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);
  const currentUserEntry = leaderboardData.find(u => u.uid === user?.uid);

  return (
    <SafeAreaView style={styles.container}>
      {/* Optional AppHeader can be added here */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubtitle}>See who's leading the pack! 🏆</Text>
      </Animated.View>

      {/* --- User's Current Rank Card --- */}
      {currentUserEntry && (
        <Animated.View style={[styles.yourRankCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View>
            <Text style={styles.yourRankLabel}>Your Ranking</Text>
            <Text style={styles.yourRankNumber}>#{currentUserEntry.rank}</Text>
          </View>
          <View style={styles.yourRankPointsContainer}>
            <Text style={styles.yourRankPoints}>{currentUserEntry.points}</Text>
            <Text style={styles.yourRankLabel}>Points</Text>
          </View>
        </Animated.View>
      )}

      {/* --- Top 3 Podium and List --- */}
      {leaderboardData.length > 0 ? (
        <>
          <Animated.View style={[styles.podiumContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {top3.length > 1 && (
              <View style={[styles.podiumItem, { transform: [{ translateY: 20 }] }]}>
                <View style={[styles.podiumAvatar, styles.silverBorder]}>
                  <Text style={styles.podiumAvatarText}>{top3[1].name.split(' ').map(n => n[0]).join('')}</Text>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>{top3[1].name}</Text>
                <View style={[styles.podiumPillar, styles.silverPillar]}>
                  <Text style={styles.podiumRank}>2</Text>
                </View>
              </View>
            )}
            {top3.length > 0 && (
              <View style={styles.podiumItem}>
                <SvgXml xml={crownIcon} width={32} height={32} style={{marginBottom: 4}}/>
                <View style={[styles.podiumAvatar, styles.goldBorder]}>
                  <Text style={styles.podiumAvatarText}>{top3[0].name.split(' ').map(n => n[0]).join('')}</Text>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>{top3[0].name}</Text>
                <View style={[styles.podiumPillar, styles.goldPillar]}>
                  <Text style={styles.podiumRank}>1</Text>
                </View>
              </View>
            )}
            {top3.length > 2 && (
              <View style={[styles.podiumItem, { transform: [{ translateY: 40 }] }]}>
                <View style={[styles.podiumAvatar, styles.bronzeBorder]}>
                  <Text style={styles.podiumAvatarText}>{top3[2].name.split(' ').map(n => n[0]).join('')}</Text>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>{top3[2].name}</Text>
                <View style={[styles.podiumPillar, styles.bronzePillar]}>
                  <Text style={styles.podiumRank}>3</Text>
                </View>
              </View>
            )}
          </Animated.View>
          <FlatList
            data={rest}
            renderItem={renderRankingItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={<Text style={styles.listTitle}>All Rankings</Text>}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        </>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>The leaderboard is empty.</Text>
          <Text style={styles.emptyStateSubText}>Check back later to see the rankings!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F5FF' },
  header: { paddingHorizontal: 20, marginBottom: 16, marginTop: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  headerSubtitle: { fontSize: 16, color: '#6B7280' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  yourRankCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  yourRankLabel: { color: '#E0E7FF', fontSize: 14 },
  yourRankNumber: { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold' },
  yourRankPointsContainer: { alignItems: 'flex-end' },
  yourRankPoints: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 32,
    height: 220,
  },
  podiumItem: { alignItems: 'center', width: 110, paddingHorizontal: 5 },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 3,
  },
  goldBorder: { borderColor: '#FBBF24' },
  silverBorder: { borderColor: '#D1D5DB' },
  bronzeBorder: { borderColor: '#F59E0B' },
  podiumAvatarText: { color: '#4B5563', fontWeight: 'bold', fontSize: 20 },
  podiumName: { fontWeight: '600', color: '#374151', fontSize: 14, textAlign: 'center' },
  podiumPillar: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  goldPillar: { height: 100, backgroundColor: '#FEF3C7' },
  silverPillar: { height: 80, backgroundColor: '#F3F4F6' },
  bronzePillar: { height: 60, backgroundColor: '#FFE4E6' },
  podiumRank: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  currentUserItem: {
    backgroundColor: '#E0E7FF',
    borderColor: '#6366F1',
    borderWidth: 1,
  },
  rankingRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
    width: 40,
    textAlign: 'center',
  },
  rankingAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankingAvatarText: {
    color: '#1F2937',
    fontWeight: 'bold',
  },
  rankingNameContainer: {
    flex: 1,
  },
  rankingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  rankingPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default LeaderboardScreen;
