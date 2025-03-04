import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useNetwork } from '../hooks/scaffold-eth';
import globalStyles from '../styles/globalStyles';
import { COLORS } from '../utils/constants';
import { truncateAddress } from '../utils/scaffold-eth';
import { FONT_SIZE } from '../utils/styles';
import { Blockie } from './scaffold-eth';

export interface PaymentType {
  recipient: `0x${string}`;
  amount: string;
}

type Props = {
  payment: PaymentType;
  nativeCurrencyPrice: number | null;
  isFetchingNativeCurrency: boolean;
  onClose: (recipient: `0x${string}`) => void;
  onChange: (recipient: `0x${string}`, amount: string) => void;
  fetchNativeCurrency: () => void;
};

export default function Payment({
  payment,
  nativeCurrencyPrice,
  isFetchingNativeCurrency,
  onClose,
  onChange,
  fetchNativeCurrency
}: Props) {
  const network = useNetwork();
  const toast = useToast();

  const [showInput, setShowInput] = useState(true);
  const [nativeValue, setNativeValue] = useState('');
  const [dollarValue, setDollarValue] = useState('');
  const [isDollar, setIsDollar] = useState(false);

  const handleInput = (input: string) => {
    if (input.trim() == '') {
      setNativeValue('');
      setDollarValue('');
      return;
    }
    // Ensure only valid floating numbers are parsed
    const numericValue = input.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except `.`
    if (!/^\d*\.?\d*$/.test(numericValue) || numericValue == '') return; // Ensure valid decimal format

    if (!nativeCurrencyPrice) {
      setNativeValue(numericValue);
      return;
    }

    if (isDollar) {
      setDollarValue(numericValue);
      setNativeValue(
        (parseFloat(numericValue) / nativeCurrencyPrice).toString()
      );
    } else {
      setNativeValue(numericValue);
      setDollarValue(
        (parseFloat(numericValue) * nativeCurrencyPrice).toFixed(2)
      );
    }
  };

  const updateAmount = () => {
    if (!nativeValue || Number(nativeValue) === 0) {
      toast.show('Please input an amount', {
        type: 'warning'
      });
      return;
    }
    onChange(payment.recipient, nativeValue);
    setShowInput(false);
  };

  const switchCurrency = () => {
    if (!nativeCurrencyPrice) {
      toast.show('Loading exchange rate', {
        type: 'warning'
      });

      if (!isFetchingNativeCurrency) {
        fetchNativeCurrency();
      }

      return;
    }

    setIsDollar(prev => !prev);
  };

  const displayValue = isDollar ? dollarValue : nativeValue;
  const displayConversion = isDollar ? nativeValue : dollarValue;

  useEffect(() => {
    if (payment.amount !== '') {
      setShowInput(false);
      setNativeValue(payment.amount);

      if (!nativeCurrencyPrice) return;
      setDollarValue(
        (parseFloat(payment.amount) * nativeCurrencyPrice).toFixed(2)
      );
    }
  }, [payment.amount, nativeCurrencyPrice]);

  return (
    <View style={styles.container}>
      <Blockie
        address={payment.recipient}
        size={3 * FONT_SIZE.xl}
        bg={COLORS.lightGray}
      />
      <Text style={styles.address}>{truncateAddress(payment.recipient)}</Text>

      {showInput ? (
        <View>
          <View style={styles.inputContainer}>
            <Pressable onPress={switchCurrency} style={styles.currencySwitch}>
              {isDollar ? (
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
              value={displayValue}
              onChangeText={handleInput}
              onSubmitEditing={updateAmount}
            />
            <Pressable onPress={updateAmount}>
              <Ionicons
                name="checkmark-circle-outline"
                style={styles.confirmIcon}
              />
            </Pressable>
          </View>

          <Text
            style={[
              styles.currencyConversion,
              { opacity: nativeValue && dollarValue ? 1 : 0 }
            ]}
          >
            ~{!isDollar && '$'} {displayConversion}{' '}
            {isDollar && network.currencySymbol}
          </Text>
        </View>
      ) : (
        <Pressable onPress={() => setShowInput(true)}>
          <Text style={styles.amount}>
            {payment.amount} {network.currencySymbol}
          </Text>
        </Pressable>
      )}

      <Pressable onPress={() => onClose(payment.recipient)}>
        <Ionicons name="close-circle-outline" style={styles.closeIcon} />
      </Pressable>
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
    width: 100,
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
    marginTop: 4,
    maxWidth: 100,
    textAlign: 'center'
  },
  closeIcon: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.error
  }
});
