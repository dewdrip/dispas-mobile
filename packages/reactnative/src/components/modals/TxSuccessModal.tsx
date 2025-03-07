import React from 'react';
import { Dimensions, Image, Linking, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import { useNetwork } from '../../hooks/scaffold-eth';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import Button from '../buttons/CustomButton';

type Props = {
  modal: {
    closeModal: () => void;
    params: {
      hash: string | undefined;
    };
  };
};

export default function TxSuccessModal({
  modal: {
    closeModal,
    params: { hash }
  }
}: Props) {
  const toast = useToast();
  const network = useNetwork();

  const viewTxDetails = async () => {
    if (!network.blockExplorer || !hash) return;

    try {
      await Linking.openURL(`${network.blockExplorer}/tx/${hash}`);
    } catch (error) {
      toast.show('Cannot open url', {
        type: 'danger'
      });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/success_transfer.png')}
          style={styles.image}
        />
        <Text variant="headlineSmall" style={styles.successText}>
          Success!
        </Text>
        <Text variant="bodyLarge" style={styles.message}>
          Your crypto was sent successfully. You can view transaction below.
        </Text>
        <Button text="View Details" onPress={viewTxDetails} />
        <Button type="outline" text="Close" onPress={closeModal} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 40,
    margin: 20
  },
  content: {
    padding: 20,
    alignItems: 'center',
    gap: 16
  },
  image: {
    width: Dimensions.get('window').height * 0.25,
    height: Dimensions.get('window').height * 0.25
  },
  successText: {
    color: COLORS.primary,
    ...globalStyles.textMedium
  },
  message: {
    textAlign: 'center',
    ...globalStyles.text
  }
});
