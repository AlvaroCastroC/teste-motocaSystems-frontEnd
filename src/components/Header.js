import { Avatar, AvatarBadge, Box, Flex, HStack, Icon, VStack } from "@chakra-ui/react";
import { IoHomeSharp } from "react-icons/io5";




export default function Header() {
    return (
        <HStack direction={'row'} align={'center'} justify={'flex-end'} gap={6} mb={10}>
            <IoHomeSharp size={30} color="#cac9cd" />
            <Avatar size={'sm'} src="https://image.freepik.com/vetores-gratis/perfil-de-avatar-de-homem-no-icone-redondo_24640-14046.jpg" >
                <AvatarBadge inset={'20px 15px'} boxSize='0.6rem' border={'none'} bg='green.500' />
            </Avatar>
        </HStack>
    )
}