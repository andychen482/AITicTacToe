import axios from "axios";

const requestHandler = async (gameState) => {
  try {
    const response = await axios.post("https://aitictactoebackend.onrender.com/api", {
      gameState: gameState,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default requestHandler;
