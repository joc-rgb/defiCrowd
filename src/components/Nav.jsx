import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  useToast,
  Heading,
  Spacer,
  Text,
  HStack,
  Image,
  Link,
} from '@chakra-ui/react';
import Connect from './Connect';
import { NavLink as RouterLink } from 'react-router-dom';
import { AccountContext } from '../Helper/Context';
import AddCampaign from './AddCampaign';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
const Nav = () => {
  const menus = [
    { page: 'Explore', src: '/explore' },
    { page: 'Account', src: '/account' },
  ];
  const { accounts, setAccounts } = useContext(AccountContext);
  const [chain, setChain] = useState('');
  const toast = useToast();
  async function connectWallet() {
    if (window.ethereum) {
      try {
        const response = await window.ethereum
          .request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }],
          })
          .then(() =>
            window.ethereum.request({ method: 'eth_requestAccounts' })
          );
        setAccounts(response);
        console.log(response);
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });
        setChain(chainId);
        toast({
          title: 'Wallet connected.🦊',
          description: 'Wallet connected successfully!',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      toast({
        title: 'No Wallet Detected',
        description: 'Please install Metamask!',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }
  return (
    <Box
      bgColor="rgba(255, 255, 255, .13)"
      backdropFilter="blur(95px)"
      display="flex"
      alignItems="center"
      zIndex="100"
      w="100%"
    >
      <HStack>
        <Image
          h="50px"
          src="https://cdn-icons-png.flaticon.com/512/4646/4646147.png"
        />
        <Spacer />
        <ColorModeSwitcher />
      </HStack>
      <Spacer />
      {menus.map((menuItem, index) => (
        <Link
          to={menuItem.src}
          key={index}
          variant="none"
          border="none"
          as={RouterLink}
          size="lg"
          _hover={{ textDecorationLine: 'none' }}
          fontWeight="bold"
          _focus={{ boxShadow: 'none' }}
          _activeLink={{
            bgGradient: 'linear(to-l, green.300, purple.300)',
            bgClip: 'text',
          }}
        >
          <Heading pl={12} fontSize="lg">
            {menuItem.page}
          </Heading>
        </Link>
      ))}
      <Spacer />
      <Connect
        accounts={accounts}
        setAccounts={setAccounts}
        connectWallet={connectWallet}
        chain={chain}
        setChain={setChain}
      />
      <AddCampaign />
    </Box>
  );
};

export default Nav;
