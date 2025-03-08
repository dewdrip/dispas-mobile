import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Logo from '../../../components/Logo';
import { useNetwork } from '../../../hooks/scaffold-eth';
import globalStyles from '../../../styles/globalStyles';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {};

export default function Header({}: Props) {
  const navigation = useNavigation();
  const network = useNetwork();

  return (
    <View style={styles.container}>
      <Logo size={FONT_SIZE.xl * 2.5} />
      <View style={styles.icons}>
        <Text style={styles.network}>{network.name}</Text>
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
  network: {
    ...globalStyles.text,
    fontSize: FONT_SIZE.md,
    color: '#555'
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  }
});
