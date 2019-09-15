import axios from 'axios';

const url = `http://localhost:3003`;
const headers = { 'Content-Type': 'application/json' };

const getFromDatabase = async (query) => {
    try {
        const response = await axios.get(`${url}${query}`, { headers });
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

const patchToDatabase = async (tableName, id, data) => {
    try {
        await axios.patch(`${url}${tableName}/${id}`, data, { headers });
    } catch (error) {
        console.log(error);
    }
};

export {getFromDatabase, patchToDatabase};