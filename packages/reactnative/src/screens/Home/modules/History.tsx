import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Text } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { Address } from 'viem';
import { ConsentModalParams } from '../../../components/modals/ConsentModal';
import { Blockie } from '../../../components/scaffold-eth';
import { clearRecipients } from '../../../store/reducers/Recipients';
import globalStyles from '../../../styles/globalStyles';
import { COLORS } from '../../../utils/constants';
import { truncateAddress } from '../../../utils/scaffold-eth';
import { FONT_SIZE, WINDOW_HEIGHT } from '../../../utils/styles';

type Props = {
  onSelect?: (address: Address) => void;
};

export default function History({ onSelect }: Props) {
  const recipients: string[] = useSelector((state: any) => state.recipients);

  const dispatch = useDispatch();

  const { openModal } = useModal();

  const clearHistory = () => {
    dispatch(clearRecipients());
  };

  const approveHistoryClearance = () => {
    const params: ConsentModalParams = {
      title: 'Clear History?',
      subTitle:
        'This will erase all records of your past recipients on Dispas.',
      iconColor: COLORS.error,
      titleStyle: { color: COLORS.error },
      subTitleStyle: { color: COLORS.error },
      onAccept: clearHistory
    };
    openModal('ConsentModal', params);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>

        <View style={styles.icons}>
          <Pressable onPress={approveHistoryClearance}>
            <Ionicons
              name="trash-outline"
              color={COLORS.error}
              size={FONT_SIZE.xl * 1.2}
            />
          </Pressable>
        </View>
      </View>

      {recipients.length === 0 ? (
        <Text style={styles.noHistory}>No History</Text>
      ) : (
        recipients.map(recipient => (
          <Pressable
            key={recipient}
            onPress={() => (onSelect ? onSelect(recipient as Address) : null)}
            style={styles.addressContainer}
          >
            <Blockie address={recipient} size={1.7 * FONT_SIZE['xl']} />
            <Text variant="titleMedium" style={styles.address}>
              {truncateAddress(recipient)}
            </Text>
          </Pressable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    maxHeight: WINDOW_HEIGHT * 0.5
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10
  },
  title: {
    fontSize: FONT_SIZE.xl * 1.2,
    ...globalStyles.textMedium
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 10
  },
  address: {
    marginLeft: 10,
    ...globalStyles.text,
    fontSize: FONT_SIZE.lg
  },
  noHistory: {
    ...globalStyles.textMedium,
    fontSize: FONT_SIZE.xl,
    textAlign: 'center',
    color: '#ccc',
    paddingVertical: 20
  }
});
