import React, { useEffect, useRef } from 'react';
import { SafeAreaView, Text, View, StyleSheet, ScrollView, StatusBar, Animated, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import AppHeader from '../components/AppHeader';
import auth from '@react-native-firebase/auth';

// --- Icons ---
const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
const starIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
const trophyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 15h1.5a2.5 2.5 0 0 1 0 5H4"></path><path d="M19.5 15H18a2.5 2.5 0 0 0 0 5h1.5"></path><path d="M12 6V3"></path><path d="M12 21v-3"></path><path d="M9 12H3"></path><path d="M21 12h-6"></path><circle cx="12" cy="12" r="4"></circle></svg>`;
const sendIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;

const DashboardScreen = () => {
    const user = auth().currentUser;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const progress = 75; // Example progress percentage

    useEffect(() => {
        // Animate progress bar
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 1000,
            useNativeDriver: false, // width animation not supported by native driver
        }).start();

        // Staggered fade-in and slide-up animation for the whole screen
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

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <AppHeader />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    <View style={styles.greetingCard}>
                        <View>
                            <Text style={styles.greetingTitle}>{getGreeting()}!</Text>
                            <Text style={styles.greetingName}>{user?.displayName || user?.email?.split('@')[0]}</Text>
                        </View>
                        <SvgXml xml={sunIcon} width={40} height={40} />
                    </View>
                </Animated.View>

                <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <Text style={styles.cardTitle}>Your Progress</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <SvgXml xml={starIcon} width={28} height={28} />
                            <Text style={styles.statValue}>1250</Text>
                            <Text style={styles.statLabel}>Points</Text>
                        </View>
                        <View style={styles.statItem}>
                            <SvgXml xml={trophyIcon} width={28} height={28} />
                            <Text style={styles.statValue}>#3</Text>
                            <Text style={styles.statLabel}>Rank</Text>
                        </View>
                    </View>
                    <View style={styles.progressWrapper}>
                        <Text style={styles.progressLabel}>Task Completion</Text>
                        <View style={styles.progressBarBackground}>
                            <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
                        </View>
                        <Text style={styles.progressPercent}>{progress}%</Text>
                    </View>
                </Animated.View>

                <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <Text style={styles.cardTitle}>Available Tasks</Text>
                    <View style={styles.taskItem}>
                        <View>
                            <Text style={styles.taskTitle}>API Documentation</Text>
                            <Text style={styles.taskPoints}>⭐ 40 pts</Text>
                        </View>
                        <TouchableOpacity style={styles.applyButton}>
                            <SvgXml xml={sendIcon} width={16} height={16} />
                        </TouchableOpacity>
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
        marginTop: 8,
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
    taskItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        padding: 12,
        borderRadius: 25, // Makes it a circle
    },
});

export default DashboardScreen;