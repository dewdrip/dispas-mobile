import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import globalStyles from '../../styles/globalStyles';
import Button from '../buttons/CustomButton';

type Props = {
  modal: {
    closeModal: () => void;
    params: {
      onRetry: () => void;
    };
  };
};

export default function TxFailModal({
  modal: {
    closeModal,
    params: { onRetry }
  }
}: Props) {
  const handleRetry = () => {
    closeModal();
    onRetry();
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/fail_icon.png')}
          style={styles.image}
        />
        <Text variant="headlineSmall" style={styles.errorText}>
          Oops...Failed!
        </Text>
        <Text variant="bodyLarge" style={styles.message}>
          Please check your internet connection and try again.
        </Text>
        <Button text="Try Again" onPress={handleRetry} />
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
  errorText: {
    color: '#F75554',
    ...globalStyles.textMedium
  },
  message: {
    textAlign: 'center',
    ...globalStyles.text
  }
});
