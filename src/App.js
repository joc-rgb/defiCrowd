import { React, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AnimatedRoutes from './components/AnimatedRoutes';
import { AccountContext } from './Helper/Context';
import { Logo } from './Logo';
import Nav from './components/Nav';

function App() {
  const web3storage = process.env.REACT_APP_WEB3STORAGE_TOKEN;
  console.log(web3storage);
  const [accounts, setAccounts] = useState('');

  return (
    <AccountContext.Provider value={{ accounts, setAccounts }}>
      <Box w="100%" h="100%" overflow="hidden" p="10px">
        <Router>
          <Nav />
          <AnimatedRoutes />
        </Router>
      </Box>
    </AccountContext.Provider>
  );
}

export default App;
