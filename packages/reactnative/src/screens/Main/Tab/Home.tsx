import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import { Card, Text } from 'react-native-paper';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import { Blockie } from '../../../components/scaffold-eth';
import {
  useAccount,
  useBalance,
  useNetwork
} from '../../../hooks/scaffold-eth';
import globalStyles from '../../../styles/globalStyles';
import { COLORS } from '../../../utils/constants';
import { parseBalance } from '../../../utils/scaffold-eth';
import { FONT_SIZE, WINDOW_WIDTH } from '../../../utils/styles';

export default function Home() {
  const account = useAccount();
  const network = useNetwork();
  const { balance } = useBalance({
    address: account.address
  });

  const [totalNativeValue, setTotalNativeValue] = useState('');
  const [totalDollarValue, setTotalDollarValue] = useState('');
  const [isDollar, setIsDollar] = useState(false); // Toggle USD/LYX
  const [isSending, setIsSending] = useState(false);
  return (
    <View style={styles.container}>
      <Card style={styles.transferContainer}>
        <Text style={{ textAlign: 'right', padding: 10 }}>
          Balance:{' '}
          {balance !== null
            ? `${Number(parseBalance(balance)).toLocaleString('en-US')} ${network.currencySymbol}`
            : null}
        </Text>
          <View style={styles.senderContainer}>
            <Blockie address={account.address} size={3 * FONT_SIZE.xl} />

            <View style={styles.inputContainer}>
              {isDollar && totalNativeValue && (
                <Text style={styles.inputCurrencySymbol}>$</Text>
              )}
              <TextInput
                placeholder={`0`}
                keyboardType="number-pad"
                style={styles.input}
                placeholderTextColor="#aaa"
              />
              {!isDollar && totalNativeValue && (
                <Text style={styles.inputCurrencySymbol}>
                  {network.currencySymbol}
                </Text>
              )}
            </View>

            <Text style={styles.currencyConversion}>
              ~{!isDollar && '$'} 10 {isDollar && network.currencySymbol}
            </Text>

            <View style={styles.actionButtonContainer}>
              <Pressable style={styles.actionButton}>
                {!isDollar ? (
                  <FontAwesome name="dollar" style={styles.dollarIcon} />
                ) : (
                  <Image
                    source={require('../../../assets/images/eth-icon.png')}
                    style={{
                      width: FONT_SIZE.lg * 1.6,
                      height: FONT_SIZE.lg * 1.6
                    }}
                  />
                )}
              </Pressable>

              <Pressable style={[styles.actionButton, styles.shareButton]}>
                <FontAwesome name="share-alt" style={styles.shareIcon} />
              </Pressable>
            </View>
          </View>

          <View style={styles.receiverContainer}>
                
          </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  transferContainer: {
    width: '90%',
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 24,
    backgroundColor: 'white',
    gap: 24
  },
  senderContainer: {
    alignItems: 'center',
    paddingVertical: 10
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
    marginBottom: 5,
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
    backgroundColor: '#666'
  },
  shareIcon: {
    fontSize: FONT_SIZE.lg,
    color: 'white'
  },
  receiverContainer: {
    backgroundColor: '#ccc',
    height: 100,
    borderBottomStartRadius: 24,
    borderBottomEndRadius: 24
  }
});
