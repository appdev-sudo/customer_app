import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';

export const RefundsAndCancellationsScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Refunds & Cancellations</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Refunds and Cancellations Policy</Text>{'\n\n'}
          All refund requests are subject to review and approval by VytalYou. Approval of refunds is at the sole discretion of VytalYou. If approved, the refund amount will not exceed the amount originally received from the customer.
        </Text>
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
  paragraph: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  bold: {
    fontWeight: fontWeights.bold as any,
    color: colors.accentAqua,
    fontSize: fontSizes.body + 2,
  },
});
