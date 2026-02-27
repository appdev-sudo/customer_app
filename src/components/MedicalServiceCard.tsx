import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';
import type {MedicalServiceItem} from '../types/serviceDetail';

type CardProps = {
  item: MedicalServiceItem;
  onKnowMore: () => void;
};

export const MedicalServiceCard: React.FC<CardProps> = ({item, onKnowMore}) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image
          source={item.image}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        {/* {item.subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        ) : null} */}
        {/* {item.price ? (
          <Text style={styles.price}>{item.price}</Text>
        ) : null} */}
        {item.shortDescription ? (
          <Text style={styles.shortDesc} numberOfLines={2}>
            {item.shortDescription}
          </Text>
        ) : null}
        <Pressable onPress={onKnowMore} style={styles.knowMoreBtn}>
          <Text style={styles.knowMoreText}>Know more</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  imageWrap: {
    width: '100%',
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  body: {
    padding: spacing.sm,
  },
  title: {
    fontFamily: fonts.primary,
    fontSize: 12,
    fontWeight: fontWeights.semibold as any,
    color: colors.accentAqua,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.primary,
    fontSize: 12,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    opacity: 0.8,
    marginBottom: spacing.xs,
  },
  price: {
    fontFamily: fonts.primary,
    fontSize: 16,
    fontWeight: fontWeights.bold as any,
    color: colors.accentAqua,
    marginBottom: spacing.xs,
  },
  shortDesc: {
    fontFamily: fonts.primary,
    fontSize: 10,
    fontWeight: fontWeights.regular as any,
    color: colors.textPrimary,
    opacity: 0.7,
    lineHeight: 14,
    marginBottom: spacing.xs,
  },
  knowMoreBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(77, 214, 255, 0.5)',
    marginTop: spacing.xs,
  },
  knowMoreText: {
    fontFamily: fonts.primary,
    fontSize: 10,
    fontWeight: fontWeights.medium as any,
    color: colors.accentCyan,
  },
});
