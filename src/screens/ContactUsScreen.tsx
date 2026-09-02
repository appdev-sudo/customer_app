import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Linking,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';

export const ContactUsScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleEmail = () => {
    Linking.openURL('mailto:customersupport@vytalyou.com');
  };

  const handlePhone = () => {
    Linking.openURL('tel:+919967526793');
  };

  const handleMap = () => {
    Linking.openURL('https://maps.app.goo.gl/qfzz6Tz8C9XRbERe9');
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Get in Touch</Text>
          <Text style={styles.heroSubtitle}>We're here to help you with your longevity journey.</Text>
        </View>

        {/* Contact Cards */}
        <Pressable style={styles.contactCard} onPress={handleMap}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="map-marker-outline" size={28} color={colors.accentAqua} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Visit Us</Text>
            <Text style={styles.cardText}>Hiranandani Gardens, Powai, Mumbai</Text>
          </View>
        </Pressable>

        <Pressable style={styles.contactCard} onPress={handlePhone}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="phone-outline" size={28} color={colors.accentAqua} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Call Us</Text>
            <Text style={styles.cardText}>+91 9967526793</Text>
          </View>
        </Pressable>

        <Pressable style={styles.contactCard} onPress={handleEmail}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="email-outline" size={28} color={colors.accentAqua} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Email Us</Text>
            <Text style={styles.cardText}>customersupport@vytalyou.com</Text>
          </View>
        </Pressable>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundNavy,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
    width: 40,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl * 2,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    marginTop: spacing.md,
  },
  heroTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(77,214,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h4,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardText: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
});
