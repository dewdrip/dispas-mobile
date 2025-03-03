import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import globalStyles from '../styles/globalStyles';
import { COLORS } from '../utils/constants';
import { FONT_SIZE } from '../utils/styles';

export default function ProfilePlaceholder() {
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Ionicons name="person-outline" style={styles.blockiePlaceholder} />
      </View>

      <Text style={styles.addressPlaceholder}>--</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  profile: {
    width: FONT_SIZE.xl * 3,
    aspectRatio: 1,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center'
  },
  blockiePlaceholder: {
    fontSize: FONT_SIZE.xl * 1.5,
    color: 'white'
  },
  addressPlaceholder: {
    color: '#ccc',
    ...globalStyles.textBold
  }
});
