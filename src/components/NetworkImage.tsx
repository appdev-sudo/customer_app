import React, { useState } from 'react';
import { View, Image, ActivityIndicator, ImageProps, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const NetworkImage: React.FC<ImageProps> = (props) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={[styles.container, props.style]}>
      <Image
        {...props}
        style={StyleSheet.absoluteFillObject}
        onLoadEnd={() => setLoading(false)}
        onLoad={() => setLoading(false)}
      />
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={colors.accentAqua} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(12, 48, 75, 0.4)',
  },
});
