import React from 'react';
import { AddIcon, DeleteIcon, Search2Icon, } from '@chakra-ui/icons';
import { TableContainer, Thead, Tr, Th, Tbody, Td, Box, Text, Table, Divider, VStack, Flex, Input, Button, HStack, InputGroup, InputLeftElement, IconButton, Tag, useDisclosure, Spacer, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
    Popover,
    PopoverTrigger,
    PopoverContent, PopoverBody, PopoverArrow
} from '@chakra-ui/react';

import { IoEyeSharp } from "react-icons/io5";
import ModalRegister from './Modal';
import { url } from '../constants/constant';



export default function table() {
    const [data, setData] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [typeOpen, setTypeOpen] = useState({
        type: '',
        id: '',

    })
    const [Search, setSearch] = useState('')
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentlyDeletingItemId, setcurrentlyDeletingItemId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData();
    }, [data])


    function handleDelete(id) {
        try {
            setcurrentlyDeletingItemId(id)
            setIsDeleting(true); // Mostrar o spinner
            setTimeout(() => {

                setIsDeleting(false);
            }, 2000)

            const response = setTimeout(async () => {

                await fetch(url + "/" + id, {
                    method: "DELETE",
                });
            }, 2000)



            if (response.ok) {
                console.log("Item excluído com sucesso!");
            } else {
                console.error("Erro ao excluir o item.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    }

    return (
        <VStack >
            <Box w={'100%'} >
                <Flex justify={'space-between'} align={'center'} mb={4}>
                    <Text fontWeight={'bold'} fontSize={'x-large'} color={'#b8c5cb'}>Tabela de motos</Text>
                    <HStack spacing={4}>
                        <InputGroup >
                            <InputLeftElement pointerEvents='none' background={'transparent'}>
                                <Search2Icon color={'#e6eaeb'} />
                            </InputLeftElement>
                            <Input py={2} px={8} type='text' color={'#e6eaeb'} placeholder='Buscar por código, nome e cor' onChange={(prev) => setSearch(prev.target.value)} borderColor={'#e6eaeb'} />
                        </InputGroup>
                        <Button as={'button'} colorScheme='blue' leftIcon={< AddIcon />} py={2} px={8} fontSize={'0.8rem'} textTransform={'uppercase'}
                            onClick={() => {

                                setTypeOpen(prev => ({ ...prev, type: 'create', id: '' }))
                                onOpen()
                            }}
                        >novo registro</Button>
                    </HStack>
                </Flex>
                <Divider />
                <TableContainer >
                    <Table variant='unstyled' colorScheme='teal' h={'100%'}>
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th></Th>
                                <Th ></Th>
                            </Tr>
                        </Thead>
                        <Tbody >
                            {
                                data.filter(f => { return Search.toLowerCase() === "" ? f : f.modelo.toLowerCase().includes(Search) || f.codigo.toLowerCase().includes(Search) || f.cor.toLowerCase().includes(Search) }).map((item, index) => (
                                    <>
                                        <Tr key={index} color={'#fff'} bg={'#312d4b'} boxShadow={'lg'} >
                                            <Td maxW={'50px'} color={'#5e42a5'} textAlign={'center'}>{item.codigo}</Td>
                                            <Td maxW={'100%'}>
                                                <div>
                                                    <HStack>
                                                        <p>{item.modelo}</p>
                                                        <Tag rounded={50} px={3} fontSize={12} color={item.status === 'Em estoque' ? '#52b909' : item.status === 'Sem estoque' ? '#df4650' : item.status === 'Em trânsito' ? "#bf891a" : ''} background={item.status === 'Em estoque' ? '#354546' : item.status === 'Sem estoque' ? '#55304c' : item.status === 'Em trânsito' ? "#544146" : ""}>{item.status}</Tag>
                                                    </HStack>
                                                    <p>Valor: R$ {item.valor}</p>
                                                    <p>Cor: {item.cor}</p>

                                                </div>
                                            </Td>
                                            <Td maxW={'50px'} >
                                                <HStack align={'center'} justify={'center'}>
                                                    {
                                                        isDeleting && item.id === currentlyDeletingItemId ? (
                                                            <Spinner color='red.500' key={index} size='md'
                                                                speed='0.75s' />
                                                        ) :
                                                            (
                                                                <IconButton _hover={{ opacity: 1 }} opacity={0.5} color={'red.500'} variant={'unstyled'} icon={<DeleteIcon fontSize={20} key={index} />}
                                                                    onClick={() => handleDelete(item.id)} />
                                                            )
                                                    }


                                                    <IconButton _hover={{ opacity: 1 }} opacity={0.5} variant={'unstyled'} icon={<IoEyeSharp size={20}
                                                        onClick={() => {

                                                            setTypeOpen(prev => ({ ...prev, type: 'edit', id: item.id }))
                                                            onOpen()
                                                        }}
                                                    />} />
                                                </HStack>
                                            </Td>
                                        </Tr>
                                        <Spacer h={4} />
                                    </>
                                ))
                            }

                        </Tbody>

                    </Table>
                </TableContainer>
            </Box>

            {
                typeOpen && <ModalRegister type={typeOpen.type} isOpenModal={isOpen} onCloseModal={onClose} id={typeOpen.id} />
            }
        </VStack>
    )
}