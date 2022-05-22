import {
  Box,
  Tag,
  Flex,
  Heading,
  HStack,
  Image,
  Progress,
  Spacer,
  Text,
  TagLabel,
  Container,
  Grid,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Web3Storage } from 'web3.storage';
import { BsPeopleFill } from 'react-icons/bs';
import ProjectModel from './ProjectModel';

const AllCampaigns = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  function getAccessToken() {
    return process.env.REACT_APP_WEB3STORAGE_TOKEN;
  }
  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }
  const campaigns = [
    {
      id: 0,
      title: 'Save Dog',
      desc: 'Save dog is on a mission to save dog.',
      link: 'https://www.savedog.com',
      cover:
        'https://dogsbestlife.com/wp-content/uploads/2019/10/adopt-a-shelter-dog.jpeg',
      currRaised: 7900,
      daysLeft: 22,
      minContribution: 100,
      contributor: 200,
      minTarget: 100000,
    },
    {
      id: 1,
      title: 'Save Dog',
      desc: 'Save dog is on a mission to save dog.',
      link: 'https://www.savedog.com',
      cover:
        'https://dogsbestlife.com/wp-content/uploads/2019/10/adopt-a-shelter-dog.jpeg',
      currRaised: 7900,
      daysLeft: 22,
      minContribution: 100,
      contributor: 200,
      minTarget: 100000,
    },
  ];

  return (
    <Box>
      <Heading>Explore</Heading>
      <Container maxW={'8xl'}>
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          }}
        >
          {campaigns.map((camp, index) => (
            <Box
              key={index}
              bgColor="rgba(255, 255, 255, 0.192)"
              backdropFilter="blur(3.5px)"
              boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
              borderRadius="10px"
              border="1px solid rgba(68, 71, 66, 0.36)"
              p={3}
              m={3}
              _hover={{ boxShadow: 'xl', cursor: 'pointer' }}
              onClick={onOpen}
            >
              <Image src={camp.cover} w="full" borderRadius="16px" />
              <Flex w="full" textAlign="center">
                <Text as="h3" fontSize="xl" fontWeight="bold">
                  {camp.title}
                </Text>
                <Spacer />
                <Tag mt={1} size="md" variant="subtle" colorScheme="orange">
                  <TagLabel>{camp.daysLeft} Days Left</TagLabel>
                </Tag>
              </Flex>

              <Flex w="full">
                <Text
                  fontWeight="extrabold"
                  color="purple.500"
                  bgGradient="linear(to-r, green.400, purple.300)"
                  bgClip="text"
                >
                  {camp.currRaised} DAI Raised!
                </Text>
                <Spacer />
                <Text display="flex">{camp.minTarget}◈</Text>
              </Flex>
              <Progress value={60} colorScheme="purple" borderRadius="10px" />
              <HStack pr={4}>
                <Text>Min Contribution</Text>
                <Spacer />
                <Text>{camp.minContribution} ◈</Text>
              </HStack>

              <ProjectModel isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
            </Box>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AllCampaigns;
