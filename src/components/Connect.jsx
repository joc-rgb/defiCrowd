import { React, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Box,
  Text,
  Center,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import Blockies from 'react-blockies';

const Connect = ({ accounts, connectWallet, chain, setChain, setAccounts }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const switchChain = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.utils.hexValue(80001) }],
      });
      setChain(ethers.utils.hexValue(8001));
    } catch (err) {
      if (err.code == 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: ethers.utils.hexValue(80001),
                chainName: 'Polygon Test Network',
                nativeCurrency: {
                  symbol: 'MATIC',
                },
                rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
              },
            ],
          });
          setChain(ethers.utils.hexValue(80001));
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        size="md"
        m={4}
        colorScheme="green"
        fontWeight="extrabold"
        borderRadius={20}
      >
        {accounts[0] ? 'Connected✅' : 'Connect Wallet🦊'}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="100%">
          <ModalHeader>
            <Center>
              <Blockies seed="jocelin" size={30} />
            </Center>
            <Text textAlign="center" isTruncated>
              {accounts[0] && accounts ? `${accounts[0]}` : 'Not Connected'}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <Box
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
          >
            <ModalBody w="100%">
              <Box display="flex" flexDir="column">
                {accounts[0] ? (
                  <Button
                    w="100%"
                    onClick={() => setAccounts([])}
                    colorScheme="yellow"
                    mb={3}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    w="100%"
                    onClick={connectWallet}
                    colorScheme="yellow"
                    mb={3}
                  >
                    Connect Wallet🦊
                  </Button>
                )}
                {chain !== ethers.utils.hexValue(80001) && accounts[0] && (
                  <Button w="100%" colorScheme="purple" onClick={switchChain}>
                    Switch to Mumbai
                  </Button>
                )}
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};
export default Connect;
