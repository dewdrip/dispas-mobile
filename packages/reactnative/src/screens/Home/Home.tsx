import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import { formatEther, parseEther } from 'viem';
import Payment from '../../components/Payment';
import ProfilePlaceholder from '../../components/ProfilePlaceholder';
import RecipientInput from '../../components/RecipientInput';
import { Blockie } from '../../components/scaffold-eth';
import {
  useAccount,
  useBalance,
  useCryptoPrice,
  useNetwork,
  useScaffoldContractWrite,
  useTransfer
} from '../../hooks/scaffold-eth';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { parseBalance } from '../../utils/scaffold-eth';
import { FONT_SIZE } from '../../utils/styles';
import Header from './modules/Header';

export default function Home() {
  const toast = useToast();

  const [totalNativeValue, setTotalNativeValue] = useState('');
  const [totalDollarValue, setTotalDollarValue] = useState('');
  const [isDollar, setIsDollar] = useState(false); // Toggle USD/LYX
  const [isSending, setIsSending] = useState(false);

  const [payments, setPayments] = useState<any[]>([]);

  const account = useAccount();
  const network = useNetwork();
  const { balance } = useBalance({ address: account.address });
  const {
    price: nativeCurrencyPrice,
    loading: isFetchingNativeCurrency,
    fetchPrice: fetchNativeCurrency
  } = useCryptoPrice();

  const formattedBalance = balance ? Number(formatEther(balance)) : 0;

  const errorStyle = { color: 'red' };

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

  // Handle input conversion & enforce numeric values
  const handleInput = (input: string) => {
    if (input.trim() === '') {
      setTotalNativeValue('');
      setTotalDollarValue('');
      return;
    }

    // Ensure only valid floating numbers are parsed
    const numericValue = input.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except `.`
    if (!/^\d*\.?\d*$/.test(numericValue) || numericValue == '') return; // Ensure valid decimal format

    if (!nativeCurrencyPrice) {
      setTotalNativeValue(numericValue);
      return;
    }

    if (isDollar) {
      setTotalDollarValue(numericValue);
      setTotalNativeValue(
        (parseFloat(numericValue) / nativeCurrencyPrice).toString()
      );
    } else {
      setTotalNativeValue(numericValue);
      setTotalDollarValue(
        (parseFloat(numericValue) * nativeCurrencyPrice).toFixed(2)
      );
    }
  };

  const displayTotalValue = isDollar ? totalDollarValue : totalNativeValue;
  const displayConversion = isDollar ? totalNativeValue : totalDollarValue;
  const isBalanceInsufficient = Number(totalNativeValue) > formattedBalance;

  const handleRecipientSelection = (recipient: `0x${string}`): boolean => {
    // Check if the recipient is already in the list
    if (
      payments.some(
        payment => payment.recipient.toLowerCase() === recipient.toLowerCase()
      )
    ) {
      toast.show('Recipient already added', {
        type: 'danger'
      });
      return false;
    }

    // Add recipient with an initial amount of 0
    // @ts-ignore
    setPayments(prevPayments => [...prevPayments, { recipient, amount: '' }]);

    return true;
  };

  const removePayment = (recipient: `0x${string}`) => {
    setPayments(prevPayments =>
      prevPayments.filter(
        payment => payment.recipient.toLowerCase() !== recipient.toLowerCase()
      )
    );
  };

  const addRecipientAmount = (recipient: `0x${string}`, amount: string) => {
    const payment = payments.find(
      payment => payment.recipient.toLowerCase() === recipient.toLowerCase()
    );

    if (!payment) return;
    // add the difference between the old and new amount
    const newTotal =
      (parseEther(totalNativeValue) || 0n) +
      parseEther(amount) -
      parseEther(payment.amount);

    setTotalNativeValue(formatEther(newTotal));
    if (nativeCurrencyPrice) {
      setTotalDollarValue(
        (parseFloat(formatEther(newTotal)) * nativeCurrencyPrice).toFixed(2)
      );
    }
    // update amount
    setPayments(prevPayments =>
      prevPayments.map(payment =>
        payment.recipient.toLowerCase() === recipient.toLowerCase()
          ? { ...payment, amount }
          : payment
      )
    );
  };

  const sumPayments = (): bigint =>
    payments.reduce((sum, p) => sum + (parseEther(p.amount) || -1n), 0n);

  const isSharedEqually = (): boolean =>
    totalNativeValue === '' ||
    payments.length === 0 ||
    parseEther(totalNativeValue) === sumPayments();

  const shareEqually = () => {
    if (
      payments.length === 0 ||
      Number(totalNativeValue) === 0 ||
      isSharedEqually()
    )
      return;

    const total = parseEther(totalNativeValue);
    const share = total / BigInt(payments.length);

    setPayments(prevPayments =>
      prevPayments.map(payment => ({
        ...payment,
        amount: formatEther(share)
      }))
    );

    const newTotal = share * BigInt(payments.length);

    setTotalNativeValue(formatEther(newTotal));

    if (nativeCurrencyPrice) {
      setTotalDollarValue(
        (Number(formatEther(newTotal)) * nativeCurrencyPrice).toFixed(2)
      );
    }

    toast.show('Funds shared equally');

    if (total !== newTotal) {
      toast.show('Total amount has been adjusted for precision', {
        type: 'warning'
      });
    }
  };

  const { transfer } = useTransfer();
  const { write } = useScaffoldContractWrite({
    contractName: 'Dispas',
    functionName: 'distributeFunds'
  });

  const send = async () => {
    if (totalNativeValue === '' || Number(totalNativeValue) === 0) {
      toast.show('Please input a valid total amount!', {
        type: 'danger'
      });
      return;
    }

    // Ensure all payments have valid amounts
    const hasInvalidPayment = payments.some(
      payment => !payment.amount || Number(payment.amount) <= 0
    );
    if (hasInvalidPayment) {
      toast.show('All recipients must have a valid amount greater than zero!', {
        type: 'danger'
      });
      return;
    }

    // Ensure total of payments matches the inputted amount
    if (!isSharedEqually()) {
      toast.show('Total amount does not match sum of payments!', {
        type: 'danger'
      });
      return;
    }

    try {
      setIsSending(true);

      const _payments = payments.map(payment => ({
        ...payment,
        amount: parseEther(payment.amount)
      }));

      if (_payments.length === 1) {
        await transfer({
          to: _payments[0].recipient,
          value: _payments[0].amount
        });
      } else {
        await write({
          args: [_payments],
          value: sumPayments()
        });
      }

      toast.show('Transfer successful! 🚀', {
        type: 'success'
      });

      setTotalNativeValue('');
      setTotalDollarValue('');
      setPayments([]);
    } catch (error) {
      console.error('Failed to send: ', error);
      toast.show('Transfer failed. Check logs to see more details!', {
        type: 'danger'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <Card style={styles.transferContainer}>
        <Text style={styles.balance}>
          Balance:{' '}
          {balance !== null
            ? `${Number(parseBalance(balance)).toLocaleString('en-US')} ${network.currencySymbol}`
            : null}
        </Text>
        <View style={styles.senderContainer}>
          <Blockie address={account.address} size={3 * FONT_SIZE.xl} />

          <View style={styles.inputContainer}>
            {isDollar && !!totalNativeValue && (
              <Text style={styles.inputCurrencySymbol}>$</Text>
            )}
            <TextInput
              placeholder={`0`}
              keyboardType="number-pad"
              style={styles.input}
              placeholderTextColor="#aaa"
              value={displayTotalValue}
              onChangeText={handleInput}
            />
            {!isDollar && !!totalNativeValue && (
              <Text style={styles.inputCurrencySymbol}>
                {network.currencySymbol}
              </Text>
            )}
          </View>

          <Text
            style={[
              styles.currencyConversion,
              isBalanceInsufficient
                ? errorStyle
                : {
                    opacity: totalNativeValue && totalDollarValue ? 1 : 0
                  }
            ]}
          >
            ~{!isDollar && '$'} {displayConversion}{' '}
            {isDollar && network.currencySymbol}
          </Text>

          <View style={styles.actionButtonContainer}>
            <Pressable style={styles.actionButton} onPress={switchCurrency}>
              {isDollar ? (
                <FontAwesome name="dollar" style={styles.dollarIcon} />
              ) : (
                <Image
                  source={require('../../assets/images/eth-icon.png')}
                  style={{
                    width: FONT_SIZE.lg * 1.6,
                    height: FONT_SIZE.lg * 1.6
                  }}
                />
              )}
            </Pressable>

            <Pressable
              style={[styles.actionButton, styles.shareButton]}
              onPress={shareEqually}
              disabled={isSharedEqually()}
            >
              <FontAwesome name="share-alt" style={styles.shareIcon} />
            </Pressable>
          </View>
        </View>

        <View style={styles.receiverContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 20 }}
          >
            {payments.length === 0 ? (
              <ProfilePlaceholder />
            ) : (
              payments.map(payment => (
                <Payment
                  key={payment.recipient}
                  payment={payment}
                  nativeCurrencyPrice={nativeCurrencyPrice}
                  isFetchingNativeCurrency={isFetchingNativeCurrency}
                  onClose={removePayment}
                  onChange={addRecipientAmount}
                  fetchNativeCurrency={fetchNativeCurrency}
                />
              ))
            )}
          </ScrollView>

          <RecipientInput onSelect={handleRecipientSelection} />

          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonText}
            onPress={send}
            disabled={isSending}
          >
            {payments.length > 1 ? 'Distribute' : 'Send'}
          </Button>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  balance: {
    ...globalStyles.text,
    fontSize: FONT_SIZE.sm,
    textAlign: 'right',
    padding: 10
  },
  transferContainer: {
    width: '90%',
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 24,
    backgroundColor: 'white',
    gap: 24,
    alignSelf: 'center'
  },
  senderContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    fontSize: FONT_SIZE.xl,
    ...globalStyles.text,
    maxWidth: '85%'
  },
  inputCurrencySymbol: {
    marginBottom: 7,
    fontSize: FONT_SIZE.lg
  },
  currencyConversion: {
    fontSize: FONT_SIZE.sm,
    fontStyle: 'italic',
    color: '#777',
    ...globalStyles.text,
    marginTop: -10
  },
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 100,
    width: FONT_SIZE.lg * 2,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dollarIcon: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.primary
  },
  shareButton: {
    backgroundColor: '#555'
  },
  shareIcon: {
    fontSize: FONT_SIZE.lg,
    color: 'white'
  },
  receiverContainer: {
    backgroundColor: COLORS.lightGray,
    borderBottomStartRadius: 24,
    borderBottomEndRadius: 24,
    paddingVertical: 25,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  button: {
    width: '90%',
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#555'
  },
  buttonText: {
    fontSize: FONT_SIZE.md,
    color: 'white',
    ...globalStyles.text
  }
});
