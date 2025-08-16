import React from 'react';
import { SafeAreaView, Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import AppHeader from '../components/AppHeader';
// --- SVG Icons ---
const plusIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
const searchIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;

// --- Dummy Data ---
const myJobs = [
    { title: 'Frontend Development Intern', status: 'Active', applicants: 15 },
    { title: 'Data Analytics Intern', status: 'Draft', applicants: 0 },
];

const HireScreen = () => (
    <SafeAreaView style={styles.container}>
        <AppHeader />
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Hire an Intern</Text>
                <Text style={styles.headerSubtitle}>Find talented interns for your organization</Text>
            </View>

            <TouchableOpacity style={styles.postJobButton}>
                <SvgXml xml={plusIcon} width={24} height={24} stroke="#FFFFFF" />
                <View style={{ marginLeft: 12 }}>
                    <Text style={styles.postJobButtonTitle}>Post a New Job</Text>
                    <Text style={styles.postJobButtonSubtitle}>Reach thousands of qualified interns</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>My Job Postings</Text>
                <View style={styles.myJobsContainer}>
                    {myJobs.map((job, index) => (
                        <View key={index} style={styles.myJobCard}>
                            <View>
                                <Text style={styles.myJobTitle}>{job.title}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                    <View style={[styles.statusBadge, job.status === 'Active' ? styles.activeBadge : styles.draftBadge]}>
                                        <Text style={[styles.statusBadgeText, job.status === 'Active' ? styles.activeBadgeText : styles.draftBadgeText]}>{job.status}</Text>
                                    </View>
                                    <Text style={styles.applicantsText}>{job.applicants} applicants</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.viewButton}>
                                <Text style={styles.viewButtonText}>View</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Top Performing Interns</Text>
                 <View style={styles.searchContainer}>
                    <SvgXml xml={searchIcon} width={20} height={20} stroke="#9CA3AF" />
                    <Text style={styles.searchText}>Search by skills, university, major...</Text>
                </View>
                <View style={styles.topInternCard}>
                    <Text style={styles.topTalentTag}>⭐ Top Talent</Text>
                    <View style={styles.topInternHeader}>
                        <View style={styles.topInternAvatar}><Text style={styles.topInternAvatarText}>SC</Text></View>
                        <View style={{flex: 1}}>
                            <Text style={styles.topInternName}>Sarah Chen</Text>
                            <Text style={styles.topInternSchool}>Stanford University</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.ratingText}>⭐ 4.9</Text>
                            <Text style={styles.pointsText}>1580 pts</Text>
                        </View>
                    </View>
                    <View style={styles.topInternInfoRow}>
                        <Text style={styles.infoTag}>Computer Science • Junior</Text>
                        <View style={styles.locationTag}>
                            <SvgXml xml={locationIcon} width={14} height={14} stroke="#34D399" />
                            <Text style={styles.locationText}>Palo Alto, CA</Text>
                        </View>
                    </View>
                     <Text style={styles.internshipsTag}>🕒 2 internships</Text>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    scrollContent: { padding: 20 },
    header: { marginBottom: 24, paddingTop: 20 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
    headerSubtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
    postJobButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        backgroundColor: '#6366F1', // Indigo
        marginBottom: 32,
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    postJobButtonTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
    postJobButtonSubtitle: { fontSize: 14, color: '#E0E7FF' },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
    myJobsContainer: { backgroundColor: '#FFFFFF', borderRadius: 16 },
    myJobCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    myJobTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginRight: 8 },
    activeBadge: { backgroundColor: '#D1FAE5' },
    draftBadge: { backgroundColor: '#F3F4F6' },
    statusBadgeText: { fontSize: 12, fontWeight: '500' },
    activeBadgeText: { color: '#065F46' },
    draftBadgeText: { color: '#374151' },
    applicantsText: { fontSize: 14, color: '#6B7280' },
    viewButton: { backgroundColor: '#F3F4F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
    viewButtonText: { color: '#374151', fontWeight: '500' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB' },
    searchText: { flex: 1, marginLeft: 8, fontSize: 16, color: '#9CA3AF' },
    topInternCard: {
        backgroundColor: '#FFFBEB',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    topTalentTag: { position: 'absolute', top: -12, right: 16, backgroundColor: '#FBBF24', color: '#78350F', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, fontSize: 12, fontWeight: 'bold' },
    topInternHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    topInternAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F97316', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    topInternAvatarText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 },
    topInternName: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    topInternSchool: { fontSize: 14, color: '#6B7280' },
    ratingContainer: { alignItems: 'flex-end', marginLeft: 'auto' },
    ratingText: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
    pointsText: { fontSize: 12, color: '#6B7280' },
    topInternInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    infoTag: { backgroundColor: '#DBEAFE', color: '#1E40AF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, fontSize: 12, fontWeight: '500', marginRight: 8 },
    locationTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    locationText: { color: '#065F46', fontWeight: '500', fontSize: 12, marginLeft: 4 },
    internshipsTag: { color: '#6B7280', fontWeight: '500', fontSize: 12, backgroundColor: '#F3F4F6', padding: 6, borderRadius: 8, alignSelf: 'flex-start' },
});

export default HireScreen;