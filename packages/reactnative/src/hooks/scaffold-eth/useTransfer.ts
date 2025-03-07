import {
  formatEther,
  JsonRpcProvider,
  TransactionReceipt,
  Wallet
} from 'ethers';
import { useState } from 'react';
import { useModal } from 'react-native-modalfy';
import { useDispatch } from 'react-redux';
import { Address } from 'viem';
import { useAccount, useNetwork, useSecureStorage, useTransactions } from '.';
import { addRecipient } from '../../store/reducers/Recipients';
import { Wallet as AccountType } from '../../types/wallet';
import { parseFloat } from '../../utils/scaffold-eth';

interface SendTxConfig {
  to: Address;
  value: bigint;
}

export function useTransfer() {
  const { openModal } = useModal();
  const network = useNetwork();
  const connectedAccount = useAccount();
  const { getItem } = useSecureStorage();
  const { addTx } = useTransactions();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const promptTransfer = ({
    to,
    value
  }: SendTxConfig): Promise<TransactionReceipt | null | undefined> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (isLoading) return;
        setIsLoading(true);
        const sendTransaction = async () => {
          try {
            // get connected account wallet data from secure storage
            const accounts = (await getItem('accounts')) as AccountType[];
            const activeAccount = Array.from(accounts).find(
              account =>
                account.address.toLowerCase() ===
                connectedAccount.address.toLowerCase()
            );

            const provider = new JsonRpcProvider(network.provider);
            const wallet = new Wallet(activeAccount!.privateKey, provider);

            const tx = await wallet.sendTransaction({
              from: connectedAccount.address,
              to,
              value
            });

            const txReceipt = await tx.wait(1);

            dispatch(addRecipient(to));

            // Add transaction to Redux store
            const gasFee = txReceipt?.gasUsed
              ? txReceipt.gasUsed * txReceipt.gasPrice
              : 0n;

            addTx({
              type: 'transfer',
              title: `${network.currencySymbol} Transfer`,
              hash: tx.hash,
              value: parseFloat(formatEther(tx.value), 8).toString(),
              timestamp: Date.now(),
              from: tx.from as Address,
              to: tx.to as Address,
              nonce: tx.nonce,
              gasFee: parseFloat(formatEther(gasFee), 8).toString(),
              total: parseFloat(formatEther(tx.value + gasFee), 8).toString()
            });

            resolve(txReceipt);
          } catch (error) {
            reject(`Failed to transfer tokens: ${error}`);
          }
        };

        openModal('TransferModal', {
          from: connectedAccount,
          to,
          value,
          onTransfer: sendTransaction,
          onReject: () => reject('Transaction Rejected')
        });
      } catch (error) {
        reject(error);
      } finally {
        setIsLoading(false);
      }
    });
  };

  return {
    isLoading,
    transfer: promptTransfer
  };
}
