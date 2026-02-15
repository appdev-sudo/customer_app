import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useAuth} from '../utils/authContext';
import {colors} from '../theme/colors';
import {fonts, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';

interface ProfileIconProps {
  onPress: () => void;
}

export const ProfileIcon: React.FC<ProfileIconProps> = ({onPress}) => {
  const {user, isAuthenticated} = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  // Get initials from name
  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(user.name);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.circle}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: spacing.sm,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentAqua,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(77, 214, 255, 0.3)',
  },
  initials: {
    fontFamily: fonts.primary,
    fontSize: 14,
    fontWeight: fontWeights.bold as any,
    color: colors.backgroundNavy,
  },
});
