import React from 'react';
import {Alert, Image, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useAuth} from '../utils/authContext';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';

export const ProfileScreen: React.FC = () => {
  const {user, isAuthenticated, logout} = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.root}>
        <Image
          source={require('../assets/images/logo-03.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Please login to view your profile</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name ? user.name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        </View>
        <Text style={styles.name}>{user.name || 'User'}</Text>
        <Text style={styles.phone}>{user.phone}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        {user.age && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{user.age} years</Text>
          </View>
        )}

        {user.sex && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sex</Text>
            <Text style={styles.infoValue}>{user.sex}</Text>
          </View>
        )}

        {/* {user.weight && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Weight</Text>
            <Text style={styles.infoValue}>{user.weight} kg</Text>
          </View>
        )}

        {user.height && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Height</Text>
            <Text style={styles.infoValue}>{user.height} cm</Text>
          </View>
        )} */}
        
        {user.location && user.location.address?.formattedAddress && (
          <View style={styles.section}>
             <Text style={styles.sectionTitle}>Address</Text>
             <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Full Address</Text>
                <Text numberOfLines={3} ellipsizeMode="tail" style={[styles.infoValue, {flex: 1, textAlign: 'right', marginLeft: 10}]}>
                  {user.location.address.formattedAddress}
                </Text>
             </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Street/Area</Text>
                <Text style={styles.infoValue}>{user.location.address.street}</Text>
             </View>
              {user.location.address.landmark ? <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Landmark</Text>
                <Text style={styles.infoValue}>{user.location.address.landmark}</Text>
             </View> : null}
             <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>City/Pincode</Text>
                <Text style={styles.infoValue}>{user.location.address.city}, {user.location.address.pincode}</Text>
             </View>
          </View>
        )}
      </View>

      {/* {user.comorbidities && user.comorbidities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Known Comorbidities</Text>
          {user.comorbidities.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      )}

      {user.medications && user.medications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ongoing Medications</Text>
          {user.medications.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      )} */}

      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundNavy,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl * 2 + 90,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  avatarContainer: {
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accentAqua,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(77, 214, 255, 0.3)',
  },
  avatarText: {
    fontFamily: fonts.primary,
    fontSize: 32,
    fontWeight: fontWeights.bold as any,
    color: colors.backgroundNavy,
  },
  name: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  phone: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular as any,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sectionTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold as any,
    color: colors.accentAqua,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  infoLabel: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    opacity: 0.7,
  },
  infoValue: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bullet: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    color: colors.accentAqua,
    marginRight: spacing.sm,
  },
  listText: {
    flex: 1,
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular as any,
    color: colors.textPrimary,
    opacity: 0.9,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  logoutText: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold as any,
    color: '#FF3B30',
  },
  logo: {
    width: 160,
    height: 48,
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular as any,
    color: colors.textPrimary,
    opacity: 0.8,
  },
});
