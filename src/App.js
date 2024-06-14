import { Box } from '@chakra-ui/react';
import './App.css';
import Header from './components/Header';
import Table from './components/Table';

function App() {
  return (
    <Box className="App" padding={10}>
      <Header />
      <Table />
    </Box>
  );
}

export default App;
