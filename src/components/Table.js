import React from 'react';

// icones do chakra sendo importados.
import { AddIcon, DeleteIcon, Search2Icon, } from '@chakra-ui/icons';

// Componentes do chakra sendo importados.
import { TableContainer, Thead, Tr, Th, Tbody, Td, Box, Text, Table, Divider, VStack, Flex, Input, Button, HStack, InputGroup, InputLeftElement, IconButton, Tag, useDisclosure, Spacer, Spinner } from '@chakra-ui/react';

import { useEffect, useState } from 'react';

//Icone do react-icons sendo importado.
import { IoEyeSharp } from "react-icons/io5";

// Componente criado neste diretorio.
import ModalRegister from './Modal';

//url do Mock db.json.
import { url } from '../constants/constant';



export default function table() {


    // Os dados obtidos seão guardados aqui.
    const [data, setData] = useState([])

    // Função de estado do chakra para controlar o modal. 
    const { isOpen, onOpen, onClose } = useDisclosure()

    // Tipo de abertura, ou create ou edit, em que será aberto o modal.
    const [typeOpen, setTypeOpen] = useState({
        type: '',
        id: '',

    })

    // Usado para busca de items, tais como código, modelo. cor.
    const [Search, setSearch] = useState('')

    // Função usada para a requisição htpp delete, caso true criará um loading no icone delete.
    const [isDeleting, setIsDeleting] = useState(false);
    // Evitará o bug que ocorre quando um botão é clicado, todso irão efetuar a função. Com isto será evitado. 
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
            // pegará o id, para identificar a linha em que está sendo deletada.
            setcurrentlyDeletingItemId(id)

            // Mostrará o spinner
            setIsDeleting(true);

            //Após 2s voltará ao padrao, fazendo assim, o spinner sumirá
            setTimeout(() => {

                setIsDeleting(false);
            }, 2000)


            //Requisição htpp delete
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

                    {/* Centralizará horizontalmente. */}
                    <HStack spacing={4}>


                        <InputGroup >
                            <InputLeftElement pointerEvents='none' background={'transparent'}>
                                <Search2Icon color={'#e6eaeb'} />
                            </InputLeftElement>

                            {/* Input para fazer ascbuscas; */}
                            <Input py={2} px={8} type='text' color={'#e6eaeb'} placeholder='Buscar por código, nome e cor' onChange={(prev) => setSearch(prev.target.value)} borderColor={'#e6eaeb'} />
                        </InputGroup>

                        {/* Habilitará o modal, para fazer os registros. */}
                        <Button as={'button'} colorScheme='blue' leftIcon={< AddIcon />} py={2} px={8} fontSize={'0.8rem'} textTransform={'uppercase'}
                            onClick={() => {

                                setTypeOpen(prev => ({ ...prev, type: 'create', id: '' }))
                                onOpen()
                            }}
                        >Novo registro</Button>
                    </HStack>
                </Flex>


                <Divider />

                {/* Tabela que será mostrada os itens salvos no MOck. */}
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
                                // Função que filtrará caso o cliente digite: o código, o modelo ou a cor do item 
                                data.filter(f => { return Search.toLowerCase() === "" ? f : f.modelo.toLowerCase().includes(Search) || f.codigo.toLowerCase().includes(Search) || f.cor.toLowerCase().includes(Search) }).map((item, index) => (
                                    <>
                                        <Tr key={index} color={'#fff'} bg={'#312d4b'} boxShadow={'lg'} >
                                            <Td maxW={'50px'} color={'#5e42a5'} textAlign={'center'}>{item.codigo}</Td>
                                            <Td maxW={'100%'}>
                                                <div>
                                                    <HStack>
                                                        <p>{item.modelo}</p>

                                                        {/* 

                                                        Caso o Status do item for ** Em estoque ** sera igual ** verde **
                                                        Caso o Status do item for ** Sem estoque ** sera igual ** vermelho **
                                                        Caso o Status do item for ** Em trânsito ** sera igual ** amarelo **

                                                        */}

                                                        <Tag rounded={50} px={3} fontSize={12} color={item.status === 'Em estoque' ? '#52b909' : item.status === 'Sem estoque' ? '#df4650' : item.status === 'Em trânsito' ? "#bf891a" : ''} background={item.status === 'Em estoque' ? '#354546' : item.status === 'Sem estoque' ? '#55304c' : item.status === 'Em trânsito' ? "#544146" : ""}>{item.status}</Tag>
                                                    </HStack>
                                                    <p>Valor: R$ {item.valor}</p>
                                                    <p>Cor: {item.cor}</p>

                                                </div>
                                            </Td>
                                            <Td maxW={'50px'} >
                                                <HStack align={'center'} justify={'center'}>
                                                    {

                                                        // verificando se o item foi deletado. Caso sim, aparecerá o spinner.
                                                        isDeleting && item.id === currentlyDeletingItemId ? (
                                                            <Spinner color='red.500' key={index} size='md'
                                                                speed='0.75s' />
                                                        ) :
                                                            (
                                                                <IconButton _hover={{ opacity: 1 }} opacity={0.5} color={'red.500'} variant={'unstyled'} icon={<DeleteIcon fontSize={20} key={index} />}
                                                                    onClick={() => handleDelete(item.id)} />
                                                            )
                                                    }


                                                    {/* Caso seja clicado, abrirá o modal para atualizar os items no Mock.  */}


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