import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useAccount, useNetwork } from '../hooks/scaffold-eth';
import globalStyles from '../styles/globalStyles';
import { COLORS } from '../utils/constants';
import { truncateAddress } from '../utils/scaffold-eth';
import { FONT_SIZE } from '../utils/styles';
import { Blockie } from './scaffold-eth';

type Props = {};

export default function Payment({}: Props) {
  const account = useAccount();
  const network = useNetwork();
  const toast = useToast();

  const [showInput, setShowInput] = useState(true);
  const [nativeValue, setNativeValue] = useState('');
  const [dollarValue, setDollarValue] = useState('');
  const [isDollar, setIsDollar] = useState(false);

  const switchCurrency = () => {
    // if (!nativeCurrencyPrice) {
    //   toast.show("Loading exchange rate",
    //     {
    //     type: "warning",
    //   });

    //   if (!isFetchingNativeCurrency) {
    //     fetchNativeCurrency();
    //   }

    //   return;
    // }

    setIsDollar(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <Blockie
        address={account.address}
        size={3 * FONT_SIZE.xl}
        bg={COLORS.lightGray}
      />
      <Text style={styles.address}>{truncateAddress(account.address)}</Text>

      {showInput ? (
        <View>
          <View style={styles.inputContainer}>
            <Pressable onPress={switchCurrency} style={styles.currencySwitch}>
              {!isDollar ? (
                <FontAwesome name="dollar" style={styles.dollarIcon} />
              ) : (
                <Image
                  source={require('../assets/images/eth-icon.png')}
                  style={styles.nativeIcon}
                />
              )}
            </Pressable>

            <TextInput
              placeholder="0"
              placeholderTextColor="#bbb"
              style={styles.input}
              value={''}
              onSubmitEditing={() => setShowInput(false)}
            />
            <Pressable onPress={() => setShowInput(false)}>
              <Ionicons
                name="checkmark-circle-outline"
                style={styles.confirmIcon}
              />
            </Pressable>
          </View>

          <Text style={styles.currencyConversion}>
            ~{!isDollar && '$'} 10 {isDollar && network.currencySymbol}
          </Text>
        </View>
      ) : (
        <Pressable onPress={() => setShowInput(true)}>
          <Text style={styles.amount}>1 LYX</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4
  },
  address: {
    fontSize: FONT_SIZE.sm,
    ...globalStyles.text
  },
  amount: {
    fontSize: FONT_SIZE.md,
    ...globalStyles.text,
    color: '#555',
    marginTop: -4,
    maxWidth: 100,
    textAlign: 'center'
  },
  inputContainer: {
    width: 150,
    height: 30,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRadius: 4
  },
  currencySwitch: {
    marginHorizontal: 2
  },
  nativeIcon: {
    width: FONT_SIZE.lg,
    height: FONT_SIZE.lg * 1.5,
    marginLeft: -5
  },
  dollarIcon: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.primary,
    marginLeft: 3
  },
  input: {
    ...globalStyles.text,
    marginTop: 5,
    flex: 1,
    height: FONT_SIZE.xl * 2.2,
    fontSize: FONT_SIZE.md
  },
  confirmIcon: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xl
  },
  currencyConversion: {
    fontSize: FONT_SIZE.sm,
    fontStyle: 'italic',
    color: '#777',
    ...globalStyles.text,
    marginTop: 4
  }
});
