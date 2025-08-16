// FILE: src/screens/JobsScreen.tsx

import React from 'react';
import { SafeAreaView, Text, View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import AppHeader from '../components/AppHeader';

const searchIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
const clockIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
const usersIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`;

// FIX: Define a type for our job data
type JobItemType = {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  salary: string;
  applicants: number;
  description: string;
  skills: string[];
  posted: string;
  featured: boolean;
  type: string;
  image: string;
};

const jobsData: JobItemType[] = [
    { id: '1', title: 'Frontend Development Intern', company: 'TechStart Inc.', location: 'San Francisco, CA', duration: '3 months', salary: '$2,000/month', applicants: 15, description: 'Join our dynamic team to build cutting-edge web applications using React and TypeScript.', skills: ['React', 'TypeScript', 'HTML/CSS', 'Git'], posted: '5 days ago', featured: true, type: 'Full-time', image: 'https://placehold.co/100x100/E0E7FF/4338CA?text=TS' },
    { id: '2', title: 'UX Design Intern', company: 'Design Studio Pro', location: 'New York, NY', duration: '4 months', salary: '$1,800/month', applicants: 8, description: 'Work on exciting projects, creating user-centric designs and prototypes for mobile and web.', skills: ['Figma', 'UI/UX', 'Prototyping'], posted: '1 week ago', featured: false, type: 'Part-time', image: 'https://placehold.co/100x100/F3E8FF/8B5CF6?text=DP' }
];

const JobsScreen = () => {
    // FIX: Apply the type to the 'item' parameter
    const renderJobItem = ({ item }: { item: JobItemType }) => (
        <View style={styles.jobCard}>
            {item.featured && <Text style={styles.featuredTag}>⭐ Featured</Text>}
            <View style={styles.jobHeader}>
                <Image source={{ uri: item.image }} style={styles.companyLogo} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.jobTitle}>{item.title}</Text>
                    <Text style={styles.jobCompany}>{item.company}</Text>
                </View>
                <Text style={styles.jobTypeTag}>{item.type}</Text>
            </View>
            <View style={styles.jobInfoRow}>
                <View style={styles.jobInfoItem}><SvgXml xml={locationIcon} width={16} height={16} stroke="#6B7280" /><Text style={styles.jobInfoText}>{item.location}</Text></View>
                <View style={styles.jobInfoItem}><SvgXml xml={clockIcon} width={16} height={16} stroke="#6B7280" /><Text style={styles.jobInfoText}>{item.duration}</Text></View>
            </View>
            <View style={styles.jobInfoRow}>
                 <View style={[styles.jobInfoItem, styles.salaryTag]}><Text style={styles.salaryText}>{item.salary}</Text></View>
                 <View style={[styles.jobInfoItem, styles.applicantsTag]}><SvgXml xml={usersIcon} width={16} height={16} stroke="#4B5563" /><Text style={styles.applicantsText}>{item.applicants} applicants</Text></View>
            </View>
            <Text style={styles.jobDescription}>{item.description}</Text>
            <View style={styles.skillsContainer}>{item.skills.map(skill => <Text key={skill} style={styles.skillTag}>{skill}</Text>)}</View>
            <View style={styles.jobFooter}>
                <Text style={styles.postedDate}>Posted {item.posted}</Text>
                <TouchableOpacity style={styles.applyNowButton}><Text style={styles.applyNowButtonText}>Apply Now</Text></TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader />
            <FlatList
                data={jobsData}
                renderItem={renderJobItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.scrollContent}
                ListHeaderComponent={
                    <>
                        <View style={styles.header}><Text style={styles.headerTitle}>Job Board</Text><Text style={styles.headerSubtitle}>Discover amazing internship opportunities</Text></View>
                        <View style={styles.searchContainer}><SvgXml xml={searchIcon} width={20} height={20} stroke="#9CA3AF" /><Text style={styles.searchText}>Search your dream internship...</Text></View>
                        <View style={styles.filterContainer}>
                            <TouchableOpacity style={styles.filterButton}><Text style={styles.filterButtonText}>Filters</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.filterButton}><SvgXml xml={locationIcon} width={16} height={16} stroke="#374151" /><Text style={styles.filterButtonText}>Location</Text></TouchableOpacity>
                        </View>
                    </>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { padding: 20 },
  header: { marginBottom: 24, paddingTop: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  headerSubtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  searchText: { flex: 1, marginLeft: 8, fontSize: 16, color: '#9CA3AF' },
  filterContainer: { flexDirection: 'row', marginBottom: 16 },
  filterButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginRight: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  filterButtonText: { marginLeft: 6, fontWeight: '500', color: '#374151' },
  jobCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  featuredTag: { position: 'absolute', top: 16, right: 16, backgroundColor: '#FEF3C7', color: '#D97706', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: '500' },
  jobHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  companyLogo: { width: 50, height: 50, borderRadius: 12, marginRight: 12 },
  jobTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  jobCompany: { fontSize: 14, color: '#6B7280' },
  jobTypeTag: { backgroundColor: '#E0E7FF', color: '#4338CA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: '500', marginLeft: 'auto' },
  jobInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  jobInfoItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  jobInfoText: { marginLeft: 6, color: '#4B5563' },
  salaryTag: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  salaryText: { color: '#059669', fontWeight: '500' },
  applicantsTag: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  applicantsText: { color: '#4B5563', fontWeight: '500', marginLeft: 6 },
  jobDescription: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 12 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  skillTag: { backgroundColor: '#E5E7EB', color: '#4B5563', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginRight: 8, marginBottom: 8, fontSize: 12 },
  jobFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 },
  postedDate: { fontSize: 12, color: '#9CA3AF' },
  applyNowButton: { backgroundColor: '#4F46E5', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  applyNowButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
});

export default JobsScreen;