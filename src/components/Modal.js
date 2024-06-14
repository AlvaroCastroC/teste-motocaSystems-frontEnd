import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, FormLabel, Heading, Icon, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Text, VStack } from "@chakra-ui/react";
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

    // Array de opções para o Select.
    const status = ['Em estoque', 'Sem estoque', 'Em trânsito']

    // Pegará todos os valores dos inpus.
    const [input, setInput] = useState(initialValue)

    // Caso ocorra algum erro especifico, o error será chamado.
    const [error, setError] = useState(errorValue)


    // Função para criar o item.
    const handleSubmitCreate = async () => {

        // Buscará todos os itens do Mock.
        const DadosExistentesResponse = await fetch(url);
        const DadosExistentes = await DadosExistentesResponse.json();

        // Irá verificar se existe o código digitado no Mock.
        const existeCodigo = DadosExistentes.some(item => item.codigo === `#${input.codigo}`);

        // Se sim ocorreará um error.
        if (existeCodigo) return setError(prev => ({ ...prev, type: 'UNAUTHORIZED', message: 'Aparentemente já existe este código.' }));

        //Verifica se algum campo do input está vazia.
        const estaVazia = Object.values(initialValue).some(value => typeof value === 'string' && value.trim() === '');

        // Se sim ocorreará um error.
        if (estaVazia) return setError(prev => ({ ...prev, type: 'VOID', message: 'Todos os campos precisam ser preenchidos!' }));

        try {
            const response = await fetch(url, {
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

            // Caso a requisição dê tudo certo fechará o modal, e esvaziará os inputs, retirando também a messagem de error. 
            if (response.ok) {
                onCloseModal()
                setTimeout(() => setInput(initialValue), 1000)
                setError('')
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Função para atualizar os dados do Mock.
    const handleSubmitUpdate = async () => {

        //Verificará se o codigo digitado e maior que 4 digitos.
        if (input.codigo.length > 4) return setError(prev => ({ ...prev, type: 'UNAUTHORIZED', message: 'O código excedeu o limite de caracter!' }))

        let temVazio = true;

        // Verificará se nenhum campo foi preenchido.
        Object.entries(input).forEach(([key, value]) => {
            if (typeof value === 'string' && value.trim() !== '') {
                temVazio = false;
            }
        });

        // Se sim emitirá um error.
        if (temVazio) return setError(prev => ({ ...prev, type: 'VOID', message: 'Preencha pelo menos um dos campos para atualizar!' }))


        else
            try {

                // Buscará os dados salvos no Mock pelo id.
                const existingDataResponse = await fetch(url + "/" + id);
                const existingData = await existingDataResponse.json();

                //Caso o campo não for preenchido pelo usuário, o valor ja existente no Mock, permanecerá.
                const updatedData = {
                    ...existingData,
                    codigo: `#${input.codigo}` || existingData.codigo,
                    modelo: input.modelo || existingData.modelo,
                    valor: input.valor || existingData.valor,
                    cor: input.cor || existingData.cor,
                    status: input.status || existingData.status
                };

                // Envie apenas os campos que foram alterados
                const response = await fetch(url + "/" + id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });

                if (response.ok) {
                    onCloseModal()
                    setTimeout(() => setInput(initialValue), 1000)
                    setError('')
                }

            } catch (error) {
                console.log(error);
            }

    }


    // Pegará todos os valores ods inputs
    const handleTextChange = (e) => {
        const { name, value } = e.target
        setInput((prev) => ({ ...prev, [name]: value }))
    }


    // Modal de registrar o item
    if (type === 'create') {
        return (
            <Modal isOpen={isOpenModal} onClose={onCloseModal} size={'2xl'} closeOnOverlayClick={false}>
                <ModalOverlay />
                <ModalContent py={7} px={4} background={'#2a233c'}>

                    {/*

                    Titulo do modal. 

                    */}

                    <ModalHeader borderBottom={'1px '} borderColor='#e6eaeb'>
                        <ModalHeader color={'#e6eaeb'}>Registro de motos</ModalHeader>
                    </ModalHeader>


                    {/* 

                    Caso o usuário clicar em fechar, resetará todos os campos. 

                    */}
                    <ModalCloseButton color={'#fff'} onClick={() => {
                        setInput(initialValue)
                        setError('')
                    }} />
                    <ModalBody>
                        <Heading my={10} as='h4' size={'sm'} color={'#e6eaeb'} textAlign={'center'}>Preencha as informações a baixo para registrar uma moto <Icon as={RiMotorbikeFill} />.</Heading>

                        <Box w={'500px'} m={'auto'}  >
                            <VStack spacing={7}>
                                <Box position={'relative'} w={'100%'}>
                                    {/* 

                                    Campo em que guardará o valor do código

                                    */}
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

                                    {/*  Caso ocorra exista um código parecido, emitirá esse erro.  */}


                                    {error.type === "UNAUTHORIZED" && <Text color={'red.500'} mt={2}>{error.message} </Text>}

                                </Box>

                                <Box position={'relative'} w={'100%'}>

                                    {/* 

                                    Campo em que guardará o valor do modelo

                                    */}

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

                                    {/* 

                                    Campo em que guardará o valor da cor

                                    */}

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

                                    {/* 

                                    Campo em que guardará o valor do modelo

                                    */}

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


                                    {/* 

                                    Campo em que guardará o status do modelo.

                                    */}

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

                            {/* 

                            Botâo que irá registrar o item.
                            
                            */}
                            <Button leftIcon={<AddIcon />} colorScheme='blue' mr={3} type="submit" width={'100%'} onClick={() => {
                                handleSubmitCreate()

                            }
                            } mt={10} textTransform={'uppercase'}>
                                Registrar
                            </Button>

                            {/* Caso não seja preenchido nenhum campo, irá emitir este error. */}

                            {error.type === "VOID" && <Text color={'red.500'} mt={2}>{error.message} </Text>}
                        </Box>
                    </ModalBody>


                </ModalContent>
            </Modal>)

    }


    //Modal para atualizar o item
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

                                {/* 

                                    Campo em que atualizará o código.

                                    */}


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

                                {/* 

                                    Campo em que atualizará o modelo.

                                */}


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

                                {/* 

                                    Campo em que atualizará a Cor.

                                */}


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

                                {/* 

                                    Campo em que atualizará o valor.

                                */}

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

                                {/* 

                                    Campo em que atualizará o status do modelo.

                                */}

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


                        {/* 

                        Botâo para atualizar o item.

                        */}

                        <Button leftIcon={<AddIcon />} colorScheme='blue' mr={3} type="submit" width={'100%'} onClick={() => {
                            handleSubmitUpdate()

                        }
                        } mt={10} textTransform={'uppercase'}>
                            Atualizar
                        </Button>

                        {/* Caso não tenha pelo menos um campo preenchido, emitirá esse erro */}
                        {error.type === "VOID" && <Text color={'red.500'} mt={2}>{error.message} </Text>}
                    </Box>
                </ModalBody>


            </ModalContent>
        </Modal>)

    }
}

export default ModalType;