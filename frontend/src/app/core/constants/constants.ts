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
    getAllTodo: `${apiurl}/todo`,    //Correct route          
    addTodo: `${apiurl}/todo`,   //Correct route              
    updateTodo: `${apiurl}/todo/:id`, //Correct route
    deleteTodo: `${apiurl}/todo/:id`,  //Correct route       
  },
};