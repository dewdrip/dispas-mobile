import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useDebounceValue } from 'usehooks-ts';
import { isAddress } from 'viem';
import { useENSProvider } from '../hooks/scaffold-eth';
import globalStyles from '../styles/globalStyles';
import { COLORS } from '../utils/constants';
import { FONT_SIZE } from '../utils/styles';

type Props = {
  onSelect: (address: `0x${string}`) => void;
};

export default function RecipientInput({ onSelect }: Props) {
  const toast = useToast();

  const [input, setInput] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  const [debouncedInput] = useDebounceValue(input, 500);

  const { resolve } = useENSProvider();

  const resolveENS = useCallback(async (value: string) => {
    if (!value) {
      setResolvedAddress('');
      return;
    }

    if (isAddress(value)) {
      setResolvedAddress(value as `0x${string}`);
      return;
    }

    if (value.endsWith('.eth')) {
      try {
        setIsResolving(true);
        const resolved = await resolve(value);
        if (resolved) {
          setResolvedAddress(resolved);
        } else {
          setResolvedAddress('');
          toast.show(
            `Could not resolve ${value}. Please ensure your input is accurate with a stable network`
          );
        }
      } catch (error) {
        console.error('ENS resolution error:', error);
        setResolvedAddress('');
      } finally {
        setIsResolving(false);
      }
    } else {
      setResolvedAddress('');
    }
  }, []);

  useEffect(() => {
    resolveENS(debouncedInput);
  }, [debouncedInput]);

  const addRecipient = (address: `0x${string}`) => {
    onSelect(address);
    setInput('');
    setResolvedAddress('');
  };

  const handleSelection = () => {
    if (isAddress(input)) {
      addRecipient(input);
      return;
    }

    if (!resolvedAddress) {
      toast.show('Invalid address or ENS name', {
        type: 'danger'
      });
      return;
    }

    addRecipient(resolvedAddress as `0x${string}`);
  };

  const handleInputChange = (value: string) => {
    if (resolvedAddress) {
      setResolvedAddress('');
    }

    setInput(value);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter address or ENS name"
        placeholderTextColor="#bbb"
        style={styles.input}
        value={resolvedAddress || input}
        onChangeText={handleInputChange}
        onSubmitEditing={handleSelection}
      />

      {!!input && !isResolving && (
        <Pressable onPress={handleSelection}>
          <Ionicons
            name="checkmark-circle-outline"
            style={[
              styles.confirmIcon,
              !resolvedAddress && styles.confirmIconDisabled
            ]}
          />
        </Pressable>
      )}

      {isResolving && (
        <Pressable onPress={() => resolveENS(input)}>
          <Ionicons
            name="reload-outline"
            style={[styles.confirmIcon, styles.loadingIcon]}
          />
        </Pressable>
      )}
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
  },
  confirmIconDisabled: {
    opacity: 0.5
  },
  loadingIcon: {
    opacity: 0.7
  }
});
