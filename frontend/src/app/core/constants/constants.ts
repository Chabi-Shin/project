export const constants = {
  CURRENT_TOKEN: 'CURRENT_TOKEN',
};

const apiurl = 'http://localhost:8000/api';

export const apiEndpoint = {
  AuthEndpoint: {
    register: `${apiurl}/register`,
    login: `${apiurl}/login`,
    logout: `${apiurl}/logout`,
    loggedUser: `${apiurl}/user`,
  },
  TodoEndpoint: {
    getAllTodo: `${apiurl}/todo`,              
    addTodo: `${apiurl}/todo`,                 
    updateTodo: `${apiurl}/todo/:id`,          
  },
};