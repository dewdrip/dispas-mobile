import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import { useAccount, useBalance, useNetwork } from '../../hooks/scaffold-eth';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import {
  parseBalance,
  parseFloat,
  truncateAddress
} from '../../utils/scaffold-eth';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import { Blockie } from '../scaffold-eth';

type Props = {
  modal: {
    closeModal: () => void;
    params: {
      contract: ethers.Contract;
      contractAddress: string;
      functionName: string;
      args: any[];
      value: bigint;
      gasLimit: bigint | number;
      onConfirm: () => void;
      onReject: () => void;
    };
  };
};

interface GasCost {
  min: bigint | null;
  max: bigint | null;
}

export default function SignTransactionModal({
  modal: { closeModal, params }
}: Props) {
  const account = useAccount();
  const network = useNetwork();
  const { balance } = useBalance({
    address: account.address
  });

  const [estimatedGasCost, setEstimatedGasCost] = useState<GasCost>({
    min: null,
    max: null
  });

  const estimateGasCost = async () => {
    const provider = new ethers.JsonRpcProvider(network.provider);

    const gasEstimate = await params.contract
      .getFunction(params.functionName)
      .estimateGas(...params.args, {
        value: params.value,
        gasLimit: params.gasLimit
      });
    const feeData = await provider.getFeeData();

    const gasCost: GasCost = {
      min: null,
      max: null
    };

    if (feeData.gasPrice) {
      gasCost.min = gasEstimate * feeData.gasPrice;
    }

    if (feeData.maxFeePerGas) {
      gasCost.max = gasEstimate * feeData.maxFeePerGas;
    }

    setEstimatedGasCost(gasCost);
  };

  const calcTotal = () => {
    const minAmount =
      estimatedGasCost.min &&
      parseFloat(
        ethers.formatEther(params.value + estimatedGasCost.min),
        8
      ).toString();
    const maxAmount =
      estimatedGasCost.max &&
      parseFloat(
        ethers.formatEther(params.value + estimatedGasCost.max),
        8
      ).toString();
    return {
      min: minAmount,
      max: maxAmount
    };
  };

  useEffect(() => {
    const provider = new ethers.JsonRpcProvider(network.provider);

    provider.off('block');

    estimateGasCost();

    provider.on('block', (blockNumber: number) => estimateGasCost());

    return () => {
      provider.off('block');
    };
  }, []);

  function confirm() {
    closeModal();
    params.onConfirm();
  }

  function reject() {
    closeModal();
    params.onReject();
  }

  function parseGasCost(value: bigint) {
    return parseFloat(ethers.formatEther(value), 8);
  }

  const toast = useToast();

  const showContractInExplorer = async () => {
    if (!network.blockExplorer) return;

    try {
      await Linking.openURL(
        `${network.blockExplorer}/address/${params.contractAddress}`
      );
    } catch (error) {
      toast.show('Cannot open url', {
        type: 'danger'
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 16 }}>
        <Text
          variant="bodyMedium"
          style={{ textAlign: 'right', ...globalStyles.text }}
        >
          {network.name} network
        </Text>
        <Text variant="titleMedium" style={globalStyles.text}>
          From:
        </Text>

        <View style={styles.accountContainer}>
          <Blockie address={account.address} size={1.8 * FONT_SIZE.xl} />
          <View style={{ marginLeft: 12 }}>
            <Text style={{ fontSize: FONT_SIZE['lg'], ...globalStyles.text }}>
              {account.name}
            </Text>
            <Text variant="bodyMedium" style={globalStyles.text}>
              Balance:{' '}
              {balance !== null
                ? `${Number(parseBalance(balance)).toLocaleString('en-US')} ${network.currencySymbol}`
                : null}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text variant="titleMedium" style={globalStyles.text}>
          To:
        </Text>
        <View style={styles.accountContainer}>
          <Blockie address={params.contractAddress} size={1.8 * FONT_SIZE.xl} />
          <Text style={styles.recipient}>
            {truncateAddress(params.contractAddress)}
          </Text>
        </View>
      </View>

      <Text style={styles.contractInfo}>
        You're calling{' '}
        <Text style={styles.contractFunction}>`{params.functionName}`</Text> in{' '}
        <Text style={styles.contractAddress} onPress={showContractInExplorer}>
          {truncateAddress(params.contractAddress)}
        </Text>{' '}
        contract
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          marginBottom: 16,
          gap: 4
        }}
      >
        <Text
          variant="headlineMedium"
          style={{
            textAlign: 'center',
            ...globalStyles.text,
            maxWidth: '90%',
            flexShrink: 1,
            flexGrow: 0
          }}
          numberOfLines={1}
        >
          {ethers.formatEther(params.value)}
        </Text>

        <Text variant="headlineMedium" style={{ ...globalStyles.text }}>
          {network.currencySymbol}
        </Text>
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: COLORS.gray,
          borderRadius: 10,
          marginBottom: 16
        }}
      >
        {/* Gas Fee Section */}
        <View style={{ padding: 12 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View>
              <Text variant="titleMedium" style={globalStyles.textMedium}>
                Estimated Gas Fee
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: 'green', ...globalStyles.text }}
              >
                Likely in {'<'} 30 seconds
              </Text>
            </View>
            <View>
              <Text
                variant="titleMedium"
                style={{ textAlign: 'right', ...globalStyles.textMedium }}
              >
                {estimatedGasCost.min
                  ? parseGasCost(estimatedGasCost.min)
                  : null}{' '}
                {network.currencySymbol}
              </Text>
              <Text
                variant="bodySmall"
                style={{
                  color: 'gray',
                  textAlign: 'right',
                  ...globalStyles.text
                }}
              >
                Max:{' '}
                {estimatedGasCost.max
                  ? parseGasCost(estimatedGasCost.max)
                  : null}{' '}
                {network.currencySymbol}
              </Text>
            </View>
          </View>
        </View>

        <Divider />

        {/* Total Section */}
        <View style={{ padding: 12 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View>
              <Text variant="titleMedium" style={globalStyles.textMedium}>
                Total
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: 'green', ...globalStyles.text }}
              >
                Amount + Gas Fee
              </Text>
            </View>
            <View>
              <Text
                variant="titleMedium"
                style={{ textAlign: 'right', ...globalStyles.textMedium }}
              >
                {calcTotal().min || ''} {network.currencySymbol}
              </Text>
              <Text
                variant="bodySmall"
                style={{
                  color: 'gray',
                  textAlign: 'right',
                  ...globalStyles.text
                }}
              >
                Max: {calcTotal().max || ''} {network.currencySymbol}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button
          mode="contained"
          onPress={reject}
          buttonColor="#FFCDD2"
          style={{ flex: 1, paddingVertical: 4, borderRadius: 30 }}
          labelStyle={{ fontSize: FONT_SIZE['lg'], ...globalStyles.text }}
        >
          Reject
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
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    width: WINDOW_WIDTH * 0.9
  },
  accountContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  recipient: {
    fontSize: FONT_SIZE['lg'],
    ...globalStyles.text,
    marginLeft: 12
  },
  contractInfo: {
    ...globalStyles.text,
    fontSize: FONT_SIZE.lg,
    color: '#444',
    marginBottom: 10
  },
  contractFunction: {
    ...globalStyles.textSemiBold,
    color: 'orange'
  },
  contractAddress: {
    ...globalStyles.text,
    color: '#0f99f0'
  },
  functionName: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 2,
    paddingVertical: 1,
    marginBottom: 10
  }
});
