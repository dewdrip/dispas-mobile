import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import globalStyles from '../../../styles/globalStyles';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {};

export default function Header({}: Props) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dispas</Text>

      <View style={styles.icons}>
        <Pressable onPress={() => navigation.navigate('Wallet')}>
          <Ionicons
            name="wallet-outline"
            color={'grey'}
            size={FONT_SIZE.xl * 1.5}
          />
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Settings')}>
          <Ionicons
            name="settings-outline"
            color={'grey'}
            size={FONT_SIZE.xl * 1.5}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 10
  },
  title: {
    fontSize: FONT_SIZE.xl * 1.2,
    ...globalStyles.textMedium
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  }
});
