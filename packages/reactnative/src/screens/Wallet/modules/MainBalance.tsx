import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { useModal } from 'react-native-modalfy';
import { IconButton, Text } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { CopyableText } from '../../../components/scaffold-eth';
import {
  useAccount,
  useBalance,
  useCryptoPrice,
  useNetwork
} from '../../../hooks/scaffold-eth';
import globalStyles from '../../../styles/globalStyles';
import { COLORS } from '../../../utils/constants';
import { parseBalance, truncateAddress } from '../../../utils/scaffold-eth';
import { FONT_SIZE } from '../../../utils/styles';

function MainBalance() {
  const network = useNetwork();
  const account = useAccount();
  const { balance, isRefetching, refetch } = useBalance({
    address: account.address
  });
  const { price, fetchPrice } = useCryptoPrice({
    priceID: network.coingeckoPriceId,
    enabled: false
  });

  const navigation = useNavigation();

  const { openModal } = useModal();

  const logo = useMemo(() => {
    if (network.name === 'Arbitrum') {
      return (
        <Image
          source={require('../../../assets/images/arbitrum_logo.png')}
          style={{
            width: FONT_SIZE.xl * 4,
            height: FONT_SIZE.xl * 4,
            marginVertical: 8
          }}
        />
      );
    } else {
      return (
        <Image
          source={require('../../../assets/images/lukso_logo.png')}
          style={{
            width: FONT_SIZE.xl * 3,
            height: FONT_SIZE.xl * 3,
            marginVertical: 8
          }}
        />
      );
    }
  }, [network]);

  const handleNav = () => {
    // @ts-ignore
    navigation.navigate('NetworkTokenTransfer');
  };

  useEffect(() => {
    if (!!balance && parseBalance(balance).length > 0) return;
    fetchPrice();
  }, [balance, network]);

  const refresh = () => {
    refetch();
    fetchPrice();
  };

  return (
    <ScrollView
      style={{ flexGrow: 0 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
    >
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.nameText}>
          {account.name}
        </Text>

        <CopyableText
          displayText={truncateAddress(account.address)}
          value={account.address}
          containerStyle={styles.addressContainer}
          textStyle={styles.addressText}
          iconStyle={{ color: COLORS.primary }}
        />

        {logo}

        <View style={styles.balanceContainer}>
          <Text variant="headlineLarge" style={styles.balanceText}>
            {balance !== null
              ? `${Number(parseBalance(balance)).toLocaleString('en-US')} ${network.currencySymbol}`
              : null}
          </Text>

          <Text
            style={{
              color: 'grey',
              fontSize: FONT_SIZE['lg'],
              ...globalStyles.text
            }}
          >
            {price &&
              balance !== null &&
              parseBalance(balance).length > 0 &&
              `$${(Number(parseBalance(balance)) * price).toLocaleString('en-US')}`}
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <View style={styles.actionButton}>
            <IconButton
              icon={() => (
                <Ionicons
                  name="paper-plane-outline"
                  size={24}
                  color={COLORS.primary}
                />
              )}
              mode="contained"
              containerColor={COLORS.primaryLight}
              size={48}
              onPress={handleNav}
            />
            <Text variant="titleMedium" style={styles.actionText}>
              Send
            </Text>
          </View>

          <View style={styles.actionButton}>
            <IconButton
              icon={() => (
                <Ionicons
                  name="download-outline"
                  size={24}
                  color={COLORS.primary}
                />
              )}
              mode="contained"
              containerColor={COLORS.primaryLight}
              size={48}
              onPress={() => openModal('ReceiveModal')}
            />
            <Text variant="titleMedium" style={styles.actionText}>
              Receive
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 20,
    gap: 8
  },
  nameText: {
    textAlign: 'center',
    ...globalStyles.textMedium
  },
  addressContainer: {
    paddingHorizontal: 15,
    paddingVertical: 4,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 24
  },
  addressText: {
    fontSize: FONT_SIZE['md'],
    ...globalStyles.textMedium,
    marginBottom: -2,
    color: COLORS.primary
  },
  balanceContainer: {
    alignItems: 'center'
  },
  balanceText: {
    textAlign: 'center',
    ...globalStyles.textMedium
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
    marginVertical: 8
  },
  actionButton: {
    alignItems: 'center'
  },
  actionText: {
    marginTop: 8,
    ...globalStyles.textMedium
  }
});

export default MainBalance;
