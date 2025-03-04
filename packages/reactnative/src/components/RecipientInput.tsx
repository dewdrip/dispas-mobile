import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { isAddress } from 'viem';
import globalStyles from '../styles/globalStyles';
import { COLORS } from '../utils/constants';
import { FONT_SIZE } from '../utils/styles';

type Props = {
  onSelect: (address: `0x${string}`) => void;
};

export default function RecipientInput({ onSelect }: Props) {
  const toast = useToast();

  const [address, setAddress] = useState('');

  const handleSelection = () => {
    if (!isAddress(address)) {
      toast.show('Invalid address', {
        type: 'danger'
      });
      return;
    }

    onSelect(address);
    setAddress('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter address of recipient"
        placeholderTextColor="#bbb"
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        onSubmitEditing={handleSelection}
      />

      <Pressable onPress={handleSelection}>
        <Ionicons name="checkmark-circle-outline" style={styles.confirmIcon} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    ...globalStyles.text,
    marginTop: 5,
    flex: 1,
    height: FONT_SIZE.xl * 2.2,
    fontSize: FONT_SIZE.md
  },
  confirmIcon: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xl * 1.2
  }
});
