import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Spacer,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { BsPlus } from 'react-icons/bs';
import { React, useState } from 'react';
import { Web3Storage } from 'web3.storage';
import contractABI from '../contractABI.json';
import { ethers } from 'ethers';
import { contractAddr } from '../constant';
const AddCampaign = () => {
  const [url, setURL] = useState('');
  const createCampaign = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sign = provider.getSigner();
    const contract = new ethers.Contract(contractAddr, contractABI.abi, sign);
    const res = await contract.AddCampaign(
      url,
      softCap,
      minContribution,
      deadline
    );
  };
  //All the input data
  const [cover, setCover] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [minContribution, setMinContribution] = useState(0);
  const [deadline, setDeadline] = useState(Date);
  const [softCap, setSoftCap] = useState(0);
  const [link, setLink] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  function getAccessToken() {
    return process.env.REACT_APP_WEB3STORAGE_TOKEN;
  }
  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }

  const saveCover = async f => {
    console.log(f.files);
    const client = makeStorageClient();
    const cid = await client.put(f);
    console.log('stored files with cid:', cid);
    return cid;
  };

  const savePdf = async f => {
    console.log(f.files);
    const client = makeStorageClient();
    const cid = await client.put(f);
    console.log('stored files with cid:', cid);
    return cid;
  };

  const makeJsonData = async (image, whitepaper) => {
    const obj = {
      title: title,
      description: desc,
      image: image,

      min_contribution: minContribution,

      softcap: softCap,

      deadline: deadline,
      website: link,
    };
    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
    const files = [new File([blob], `${title}.json`)];
    return files;
  };

  async function storeJsonData(files) {
    const client = makeStorageClient();
    const cid = await client.put(files);
    console.log('stored files with cid:', cid);
    setURL(cid);
    return cid;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const image = await saveCover(cover);
    const files = await makeJsonData(image);
    storeJsonData(files);
  };

  return (
    <>
      <Button colorScheme="purple" leftIcon={<BsPlus />} onClick={onOpen}>
        Create Campaign
      </Button>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        size="full"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading fontWeight="thin">Create a Campaign</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel htmlFor="desc" accept="image/png, image/jpeg">
                  Cover Image
                </FormLabel>
                <Input
                  type="file"
                  name="coverimage"
                  id="coverimage"
                  accept="image/png, image/jpeg"
                  onChange={e => setCover(e.target.files)}
                />
              </FormControl>

              <Spacer p={2} />

              <FormControl isRequired>
                <FormLabel htmlFor="title">Campaign Title</FormLabel>
                <Input
                  id="title"
                  name="title"
                  placeholder="Your Campaign/Project Name"
                  onChange={e => setTitle(e.target.value)}
                />
              </FormControl>

              <Spacer p={2} />

              <FormControl isRequired>
                <FormLabel htmlFor="desc">Campaign Descriptions</FormLabel>
                <Textarea
                  id="desc"
                  type="text"
                  placeholder="Describe your campaign in details to attract investors."
                  size="lg"
                  onChange={e => setDesc(e.target.value)}
                />
              </FormControl>

              <Spacer p={2} />

              <HStack>
                <FormControl isRequired>
                  <FormLabel htmlFor="min_contribution_limit">
                    Min Contribution
                  </FormLabel>
                  <NumberInput>
                    <NumberInputField
                      id="min_contribution_limit"
                      onChange={e => setMinContribution(e.target.value)}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel htmlFor="deadline">Deadline</FormLabel>
                  <Input
                    type="date"
                    id="deadline"
                    onChange={e => setDeadline(e.target.value)}
                  />
                </FormControl>
              </HStack>
              <Spacer p={2} />
              <HStack>
                <FormControl isRequired>
                  <FormLabel htmlFor="softcap">Soft Cap</FormLabel>
                  <NumberInput>
                    <NumberInputField
                      id="softcap"
                      onChange={e => setSoftCap(e.target.value)}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel htmlFor="website">Official Website</FormLabel>
                  <Input
                    type="url"
                    id="website"
                    onChange={e => setLink(e.target.value)}
                  />
                </FormControl>
              </HStack>
              <Spacer p={2} />

              <Spacer p={4} />
              <Button mt={4} colorScheme="teal" type="submit">
                Submit
              </Button>
              <Text>
                Please ensure you have at least 1000DAI in your wallet for
                deposit. Buy your DAI{' '}
                <Link
                  href={`https://staging-global.transak.com/?apiKey=${process.env.REACT_APP_TRANSAK_KEY}`}
                  isExternal
                >
                  here
                </Link>
              </Text>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddCampaign;
