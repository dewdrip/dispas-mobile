import React, { useState } from 'react';
import { Pressable, StyleSheet, TextStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { formatEther } from 'viem';
import { useBalance, useNetwork } from '../../hooks/scaffold-eth';
import globalStyles from '../../styles/globalStyles';
import { parseBalance } from '../../utils/scaffold-eth';

type Props = {
  address: string;
  style?: TextStyle;
};

export function Balance({ address, style }: Props) {
  const network = useNetwork();
  const { balance, isLoading } = useBalance({ address });

  const [showFullBalance, setShowFullBalance] = useState(false);

  if (isLoading) return;

  return (
    <Pressable
      style={styles.container}
      onPress={() => setShowFullBalance(prev => !prev)}
    >
      <Text style={[globalStyles.text, style]}>
        {balance !== null
          ? showFullBalance
            ? `${Number(formatEther(balance))} ${network.currencySymbol}`
            : `${Number(parseBalance(balance)).toLocaleString('en-US')} ${network.currencySymbol}`
          : null}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  }
});
