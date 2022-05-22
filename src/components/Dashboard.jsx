import { Flex } from '@chakra-ui/react';
import { React, useContext } from 'react';
import MyCampaigns from './MyCampaign';

const Dashboard = () => {
  return (
    <Flex p="4">
      <MyCampaigns />
    </Flex>
  );
};

export default Dashboard;
