import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useSelector } from 'react-redux';
import { Address } from 'viem';
import { Blockie } from '../../../components/scaffold-eth';
import globalStyles from '../../../styles/globalStyles';
import { COLORS } from '../../../utils/constants';
import { truncateAddress } from '../../../utils/scaffold-eth';
import { FONT_SIZE } from '../../../utils/styles';

type Props = {
  onSelect?: (address: Address) => void;
};

export default function History({ onSelect }: Props) {
  const recipients: string[] = useSelector((state: any) => state.recipients);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>

        <View style={styles.icons}>
          <Pressable style={styles.addButton}>
            <Ionicons
              name="add-outline"
              color={COLORS.primary}
              size={FONT_SIZE.xl * 1.2}
            />
          </Pressable>

          <Pressable>
            <Ionicons
              name="settings-outline"
              color={'grey'}
              size={FONT_SIZE.xl * 1.5}
            />
          </Pressable>
        </View>
      </View>

      {recipients.length === 0 ? (
        <Text style={styles.noHistory}>No History</Text>
      ) : (
        recipients.map(recipient => (
          <Pressable
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
    paddingTop: 50
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: COLORS.primary,
    padding: 1
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
