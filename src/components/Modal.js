import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Flex, FormControl, FormLabel, Heading, Icon, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, VStack, useDisclosure } from "@chakra-ui/react"
import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { RiMotorbikeFill } from "react-icons/ri";
import { url } from "../constants/constant";


const initialValue = {
    codigo: '',
    modelo: '',
    valor: '',
    cor: '',
    status: ''
}
const errorValue = {
    type: '',
    message: ''
}


function ModalType({ type, isOpenModal, onCloseModal, id }) {

    const status = ['Em estoque', 'Sem estoque', 'Em trânsito']

    const [input, setInput] = useState(initialValue)

    const [error, setError] = useState(errorValue)

    const handleSubmitCreate = async () => {
        const existingDataResponse = await fetch(url);
        const existingData = await existingDataResponse.json();

        const existeCodigo = existingData.some(item => item.codigo === `#${input.codigo}`);
        if (existeCodigo) return setError(prev => ({ ...prev, type: 'UNAUTHORIZED', message: 'Aparentemente já existe este código.' }));


        const estaVazia = Object.values(initialValue).some(value => typeof value === 'string' && value.trim() === '');

        if (estaVazia) return setError(prev => ({ ...prev, type: 'VOID', message: 'Todos os campos precisam ser preenchidos!' }));

        try {
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    codigo: `#${input.codigo}`,
                    modelo: input.modelo,
                    valor: input.valor,
                    cor: input.cor,
                    status: input.status
                })



            })

            onCloseModal()
            setTimeout(() => setInput(initialValue), 1000)
            setError('')
        } catch (error) {

        }
    }


    const handleSubmitUpdate = async () => {

        if (input.codigo.length > 4) return setError(prev => ({ ...prev, type: 'UNAUTHORIZED', message: 'O código excedeu o limite de caracter!' }))

        let temVazio = true;

        Object.entries(input).forEach(([key, value]) => {
            if (typeof value === 'string' && value.trim() !== '') {
                temVazio = false;
            }
        });

        if (temVazio) return setError(prev => ({ ...prev, type: 'VOID', message: 'Preencha pelo menos um dos campos para atualizar!' }))


        else
            try {

                const existingDataResponse = await fetch(url + "/" + id);
                const existingData = await existingDataResponse.json();


                const updatedData = {
                    ...existingData,
                    codigo: `#${input.codigo}` || existingData.codigo,
                    modelo: input.modelo || existingData.modelo,
                    valor: input.valor || existingData.valor,
                    cor: input.cor || existingData.cor,
                    status: input.status || existingData.status
                };

                // Envie apenas os campos que foram alterados
                await fetch(url + "/" + id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });

                onCloseModal()
                setTimeout(() => setInput(initialValue), 1000)
                setError('')

            } catch (error) {
                console.log(error);
            }

    }

    const handleTextChange = (e) => {
        const { name, value } = e.target
        setInput((prev) => ({ ...prev, [name]: value }))
    }
    if (type === 'create') {
        return (<Modal isOpen={isOpenModal} onClose={onCloseModal} size={'2xl'} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent py={7} px={4} background={'#2a233c'}>
                <ModalHeader borderBottom={'1px '} borderColor='#e6eaeb'>
                    <ModalHeader color={'#e6eaeb'}>Registro de motos</ModalHeader>
                </ModalHeader>

                <ModalCloseButton color={'#fff'} onClick={() => {
                    setInput(initialValue)
                    setError('')
                }} />
                <ModalBody>
                    <Heading my={10} as='h4' size={'sm'} color={'#e6eaeb'} textAlign={'center'}>Preencha as informações a baixo para registrar uma moto <Icon as={RiMotorbikeFill} />.</Heading>

                    <Box w={'500px'} m={'auto'}  >
                        <VStack spacing={7}>
                            <Box position={'relative'} w={'100%'}>

                                <InputGroup>
                                    <FormLabel htmlFor="codigo" style={{
                                        position: 'absolute',
                                        top: -15,
                                        left: 10
                                    }} color={'#e6eaeb'} background={'#2a233c'} zIndex={2} px={2} fontSize={'1rem.7rem'}>Códiogo</FormLabel>
                                    <InputLeftElement pointerEvents='none' color='gray.300' fontSize='1.2em'>
                                        #
                                    </InputLeftElement>
                                    <Input id="codigo" name="codigo"
                                        color={'#fff'} type="number"
                                        onChange={handleTextChange}
                                        value={input.codigo}

                                    />

                                </InputGroup>
                                {error.type === "UNAUTHORIZED" && <Text color={'red.500'} mt={2}>{error.message} </Text>}

                            </Box>

                            <Box position={'relative'} w={'100%'}>
                                <FormLabel htmlFor="modelo" style={{
                                    position: 'absolute',
                                    top: -15,
                                    left: 10
                                }} color={'#e6eaeb'} background={'#2a233c'} zIndex={2} px={2} fontSize={'1rem.7rem'}>Modelo da Moto</FormLabel>
                                <Input id="modelo" name="modelo" color={'#fff'}
                                    onChange={handleTextChange}
                                    value={input.modelo}
                                />
                            </Box>

                            <Box position={'relative'} w={'100%'}>
                                <FormLabel htmlFor="cor" style={{
                                    position: 'absolute',
                                    top: -15,
                                    left: 10
                                }} color={'#e6eaeb'} background={'#2a233c'} zIndex={2} px={2} fontSize={'1rem.7rem'}>Cor</FormLabel>
                                <Input id="cor" name="cor" color={'#fff'} type="text"
                                    onChange={handleTextChange}
                                    value={input.cor}
                                />
                            </Box>
                            <Box position={'relative'} w={'100%'}>
                                <FormLabel htmlFor="valor" style={{
                                    position: 'absolute',
                                    top: -15,
                                    left: 10
                                }} color={'#e6eaeb'} background={'#2a233c'} zIndex={2} px={2} fontSize={'1rem.7rem'}>Valor</FormLabel>
                                <Input id="valor" name="valor" color={'#fff'} type="text"
                                    onChange={handleTextChange}
                                    value={input.valor}
                                />
                            </Box>
                            <Box position={'relative'} w={'100%'}>
                                <FormLabel htmlFor="status" style={{
                                    position: 'absolute',
                                    top: -15,
                                    left: 10
                                }} color={'#e6eaeb'} background={'#2a233c'} zIndex={2} px={2} fontSize={'1rem.7rem'}>Status</FormLabel>
                                <Select id="status" name="status" color={'white'} variant='outline' icon={<MdArrowDropDown />}
                                    onChange={handleTextChange}
                                    value={input.status}
                                >
                                    <option label="" hidden />
                                    {
                                        status.map((item, index) => (

                                            <option key={index} value={item} style={{ color: 'black' }}>{item}</option>
                                        ))
                                    }
                                </Select>
                            </Box>
                        </VStack>
                        <Button leftIcon={<AddIcon />} colorScheme='blue' mr={3} type="submit" width={'100%'} onClick={() => {
                            handleSubmitCreate()

                        }
                        } mt={10} textTransform={'uppercase'}>
                            Registrar
                        </Button>

                        {error.type === "VOID" && <Text color={'red.500'} mt={2}>{error.message} </Text>}
                    </Box>
                </ModalBody>


            </ModalContent>
        </Modal>)

    }

    if (type === 'edit') {
        return (<Modal isOpen={isOpenModal} onClose={onCloseModal} size={'3xl'} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent p={7} background={'#2a233c'}>
                <ModalHeader borderBottom={'1px '} borderColor='#e6eaeb'>
                    <ModalHeader color={'#e6eaeb'}>Editar</ModalHeader>
                </ModalHeader>

                <ModalCloseButton color={'#fff'} onClick={() => {
                    setInput(initialValue)
                    setError('')
                }} />
                <ModalBody>
                    <Heading my={10} as='h4' size={'md'} color={'#e6eaeb'} textAlign={'center'}>Edite as informações que prefirir! <Icon as={EditIcon} /> .</Heading>

                    <Box w={'500px'} m={'auto'}  >
                        <VStack spacing={7}>
                            <Box position={'relative'} w={'100%'}>

                                <InputGroup>
                                    <FormLabel htmlFor="codigo" style={{
                                        position: 'absolute',
                                        top: -15,
                                        left: 10
                                    }} color={'#e6eaeb'} background={'#2a233c'} zIndex={2} px={2} fontSize={'1rem'}>Códiogo</FormLabel>
                                    <InputLeftElement pointerEvents='none' color='gray.300' fontSize='1.2em'>
                                        #
                                    </InputLeftElement>
                                    <Input id="codigo" name="codigo"
                                        color={'#fff'} type="number"
                                        onChange={handleTextChange}
                                        value={input.codigo}
                                        min="1" max="9999"
                                    />
                                </InputGroup>
                                {error.type === "UNAUTHORIZED" && <Text color={'red.500'} mt={2}>{error.message} </Text>}
                            </Box>

                            <Box position={'relative'} w={'100%'}>
                                <FormLabel htmlFor="modelo" style={{
                                    position: 'absolute',
                                    top: -15,
                                    left: 10
                                }} color={'#e6eaeb'} background={'#2a233c'} zIndex={2} px={2} fontSize={'1rem.7rem'}>Modelo da Moto</FormLabel>
                                <Input id="modelo" name="modelo" color={'#fff'}
                                    onChange={handleTextChange}
                                    value={input.modelo}
                                />
                            </Box>

                            <Box position={'relative'} w={'100%'}>
                                <FormLabel htmlFor="cor" style={{
                                    position: 'absolute',
                                    top: -15,
                                    left: 10
                                }} color={'#e6eaeb'} background={'#2a233c'} zIndex={2} px={2} fontSize={'1rem.7rem'}>Cor</FormLabel>
                                <Input id="cor" name="cor" color={'#fff'} type="text"
                                    onChange={handleTextChange}
                                    value={input.cor}
                                />
                            </Box>
                            <Box position={'relative'} w={'100%'}>
                                <FormLabel htmlFor="valor" style={{
                                    position: 'absolute',
                                    top: -15,
                                    left: 10
                                }} color={'#e6eaeb'} background={'#2a233c'} zIndex={2} px={2} fontSize={'1rem.7rem'}>Valor</FormLabel>
                                <Input id="valor" name="valor" color={'#fff'} type="text"
                                    onChange={handleTextChange}
                                    value={input.valor}
                                />
                            </Box>
                            <Box position={'relative'} w={'100%'}>
                                <FormLabel htmlFor="status" style={{
                                    position: 'absolute',
                                    top: -15,
                                    left: 10
                                }} color={'#e6eaeb'} background={'#2a233c'} zIndex={2} px={2} fontSize={'1rem.7rem'}>Status</FormLabel>
                                <Select id="status" name="status" color={'white'} variant='outline' icon={<MdArrowDropDown />}
                                    onChange={handleTextChange}
                                    value={input.status}
                                >
                                    <option label="" hidden />
                                    {
                                        status.map((item, index) => (

                                            <option key={index} value={item} style={{ color: 'black' }}>{item}</option>
                                        ))
                                    }
                                </Select>
                            </Box>
                        </VStack>

                        <Button leftIcon={<AddIcon />} colorScheme='blue' mr={3} type="submit" width={'100%'} onClick={() => {
                            handleSubmitUpdate()

                        }
                        } mt={10} textTransform={'uppercase'}>
                            Atualizar
                        </Button>
                        {error.type === "VOID" && <Text color={'red.500'} mt={2}>{error.message} </Text>}
                    </Box>
                </ModalBody>


            </ModalContent>
        </Modal>)

    }
}

export default ModalType;