import { formatEther, JsonRpcProvider, TransactionReceipt } from 'ethers';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { Address } from 'viem';
import { useAccount, useBalance, useNetwork } from '../../hooks/scaffold-eth';
import { Account } from '../../store/reducers/Accounts';
import globalStyles from '../../styles/globalStyles';
import { parseFloat, truncateAddress } from '../../utils/scaffold-eth';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import { Blockie } from '../scaffold-eth';

type Props = {
  modal: {
    closeModal: (modal?: string, callback?: () => void) => void;
    params: {
      from: Account;
      to: Address;
      value: bigint;
      onTransfer: () => Promise<TransactionReceipt | undefined>;
      onReject: () => void;
    };
  };
};

export default function TransferModal({
  modal: { closeModal, params }
}: Props) {
  const network = useNetwork();

  const account = useAccount();
  const { balance } = useBalance({ address: account.address });

  const [gasCost, setGasCost] = useState<bigint | null>(null);

  const estimateGasCost = async () => {
    try {
      const provider = new JsonRpcProvider(network.provider);
      const feeData = await provider.getFeeData();

      const gasCost = feeData.gasPrice! * BigInt(21000);

      setGasCost(gasCost);
    } catch (error) {
      console.error('Error estimating gas cost: ', error);
      return;
    }
  };

  const formatBalance = () => {
    return balance && Number(formatEther(balance))
      ? Number(formatEther(balance)).toLocaleString('en-US')
      : 0;
  };

  const calcTotal = () => {
    return gasCost ? parseFloat(formatEther(params.value + gasCost), 8) : null;
  };

  const confirm = async () => {
    params.onTransfer();
    closeModal();
  };

  const cancel = () => {
    params.onReject();
    closeModal();
  };

  useEffect(() => {
    const provider = new JsonRpcProvider(network.provider);

    provider.off('block');

    estimateGasCost();

    provider.on('block', () => {
      estimateGasCost();
    });

    return () => {
      provider.off('block');
    };
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            From:
          </Text>

          <View style={styles.accountContainer}>
            <View style={styles.accountInfo}>
              <Blockie
                address={params.from.address}
                size={1.8 * FONT_SIZE['xl']}
              />

              <View style={styles.accountDetails}>
                <Text
                  style={{ fontSize: FONT_SIZE['lg'], ...globalStyles.text }}
                >
                  {params.from.name}
                </Text>
                <Text variant="bodyMedium" style={globalStyles.text}>
                  Balance: {formatBalance()} {network.currencySymbol}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            To:
          </Text>

          <View style={styles.recipientContainer}>
            <Blockie address={params.to} size={1.8 * FONT_SIZE['xl']} />
            <Text style={{ fontSize: FONT_SIZE['lg'], ...globalStyles.text }}>
              {truncateAddress(params.to)}
            </Text>
          </View>
        </View>

        <Text variant="titleMedium" style={styles.amountLabel}>
          AMOUNT
        </Text>
        <Text variant="headlineLarge" style={styles.amount}>
          {Number(formatEther(params.value)).toLocaleString('en-US')}{' '}
          {network.currencySymbol}
        </Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailsRow}>
            <View>
              <Text variant="titleMedium" style={globalStyles.textMedium}>
                Estimated gas fee
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: 'green', ...globalStyles.text }}
              >
                Likely in &lt; 30 second
              </Text>
            </View>
            <Text variant="titleMedium" style={styles.detailsValue}>
              {gasCost ? parseFloat(formatEther(gasCost), 8).toString() : null}{' '}
              {network.currencySymbol}
            </Text>
          </View>

          <>
            <Divider />

            <View style={styles.detailsRow}>
              <Text variant="titleMedium" style={globalStyles.textMedium}>
                Total
              </Text>
              <Text variant="titleMedium" style={styles.detailsValue}>
                {calcTotal()} {network.currencySymbol}
              </Text>
            </View>
          </>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={cancel}
            buttonColor="#FFCDD2"
            style={{ flex: 1, paddingVertical: 4, borderRadius: 30 }}
            labelStyle={{ fontSize: FONT_SIZE['lg'], ...globalStyles.text }}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={confirm}
            style={{ flex: 1, paddingVertical: 4, borderRadius: 30 }}
            labelStyle={{
              fontSize: FONT_SIZE['lg'],
              ...globalStyles.text,
              color: 'white'
            }}
          >
            Confirm
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    width: WINDOW_WIDTH * 0.9,
    gap: 16
  },
  section: {
    gap: 8
  },
  sectionTitle: {
    fontSize: FONT_SIZE['lg'],
    ...globalStyles.text
  },
  accountContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 8
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  accountDetails: {
    width: '75%'
  },
  recipientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 8
  },
  amountLabel: {
    textAlign: 'center',
    marginBottom: -16,
    ...globalStyles.textMedium
  },
  amount: {
    textAlign: 'center',
    ...globalStyles.textSemiBold
  },
  detailsContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10
  },
  detailsRow: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  detailsValue: {
    width: '50%',
    textAlign: 'right',
    ...globalStyles.textMedium
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12
  }
});
