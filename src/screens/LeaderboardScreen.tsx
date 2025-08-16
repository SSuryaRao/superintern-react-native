import React, { useEffect, useRef } from 'react';
import { SafeAreaView, Text, View, StyleSheet, FlatList, Animated } from 'react-native';
import { SvgXml } from 'react-native-svg';
import AppHeader from '../components/AppHeader';
import auth from '@react-native-firebase/auth';

// --- Icons ---
const crownIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFD700" stroke="#B45309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path></svg>`;
const trophyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 15h1.5a2.5 2.5 0 0 1 0 5H4"></path><path d="M19.5 15H18a2.5 2.5 0 0 0 0 5h1.5"></path><path d="M12 6V3"></path><path d="M12 21v-3"></path><path d="M9 12H3"></path><path d="M21 12h-6"></path><circle cx="12" cy="12" r="4"></circle></svg>`;

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
    const user = auth().currentUser;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
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

  const renderRankingItem = ({ item, index }: { item: RankingItemType, index: number }) => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
        <View style={styles.rankingItem}>
            <Text style={styles.rankingRank}>{item.rank}</Text>
            <View style={styles.rankingAvatar}>
                <Text style={styles.rankingAvatarText}>{item.name.split(' ').map(n => n[0]).join('')}</Text>
            </View>
            <View>
                <Text style={styles.rankingName}>{item.name}</Text>
                <Text style={styles.rankingInfo}>{item.points} pts</Text>
            </View>
        </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubtitle}>Competition is heating up! 🔥</Text>
      </Animated.View>

      <FlatList
        data={leaderboardData.slice(3)} // Show ranks 4 and below in the list
        renderItem={renderRankingItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
            <>
                <Animated.View style={[styles.yourRankCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <View>
                        <Text style={styles.yourRankLabel}>Your Ranking</Text>
                        <Text style={styles.yourRankNumber}>#3</Text>
                    </View>
                    <View style={styles.yourRankPointsContainer}>
                        <Text style={styles.yourRankPoints}>1250</Text>
                        <Text style={styles.yourRankLabel}>Points</Text>
                    </View>
                </Animated.View>
                
                <Animated.View style={[styles.podiumContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    {/* 2nd Place */}
                    <View style={[styles.podiumItem, { transform: [{ translateY: 20 }] }]}>
                        <View style={[styles.podiumAvatar, styles.silverBorder]}><Text style={styles.podiumAvatarText}>MR</Text></View>
                        <Text style={styles.podiumName}>M. Rodriguez</Text>
                        <View style={[styles.podiumPillar, styles.silverPillar]}><Text style={styles.podiumRank}>2</Text></View>
                    </View>
                    {/* 1st Place */}
                    <View style={styles.podiumItem}>
                        <SvgXml xml={crownIcon} width={32} height={32} />
                        <View style={[styles.podiumAvatar, styles.goldBorder]}><Text style={styles.podiumAvatarText}>SC</Text></View>
                        <Text style={styles.podiumName}>Sarah Chen</Text>
                        <View style={[styles.podiumPillar, styles.goldPillar]}><Text style={styles.podiumRank}>1</Text></View>
                    </View>
                    {/* 3rd Place */}
                    <View style={[styles.podiumItem, { transform: [{ translateY: 40 }] }]}>
                        <View style={[styles.podiumAvatar, styles.bronzeBorder]}><Text style={styles.podiumAvatarText}>AJ</Text></View>
                        <Text style={styles.podiumName}>Alex Johnson</Text>
                        <View style={[styles.podiumPillar, styles.bronzePillar]}><Text style={styles.podiumRank}>3</Text></View>
                    </View>
                </Animated.View>

                <Animated.Text style={[styles.listTitle, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>All Rankings</Animated.Text>
            </>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F5FF' },
    header: { paddingHorizontal: 20, marginBottom: 16 },
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
    podiumItem: { alignItems: 'center', width: 110 },
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
    podiumName: { fontWeight: '600', color: '#374151', fontSize: 12, textAlign: 'center' },
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
    rankingRank: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6B7280',
        width: 30,
    },
    rankingAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0E7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rankingAvatarText: {
        color: '#4338CA',
        fontWeight: 'bold',
    },
    rankingName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    rankingInfo: {
        fontSize: 12,
        color: '#6B7280',
    },
});

export default LeaderboardScreen;