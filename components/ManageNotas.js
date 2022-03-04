import {
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  Textarea,
} from "@chakra-ui/react";

import { useEffect, useState } from "react"
import { supabaseClient } from "../lib/supabaseClient"
import { useRouter } from "next/router"
import en from "../translations/en.json"
import es from "../translations/es.json"




const ManageTodo = ({ isOpen, onClose, initialRef, todo, setTodo }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  ///////////////////////////////////////
  const [imagen, setImg] = useState("");
  ///////////////////////////////////////
  const [errorMessage, setErrorMessage] = useState("");
  const {locale, locales} = useRouter();
  const t = locale === "en" ? en : es;



  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      setIsComplete(todo.isComplete);
      setImg(todo.imagen);  // coloque este mero :v 
    }
  }, [todo]);

  const submitHandler = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    if (description.length <= 10) {
      setErrorMessage("Description must have more than 10 characters");
      return;
    }
    /////
    setIsLoading(true);
    const user = supabaseClient.auth.user();
    let supabaseError;

    if (todo) {
      const { error } = await supabaseClient
        .from("reminder")

        .update({ title, description, isComplete,imagen, user_id: user.id })
        .eq("id", todo.id);
      supabaseError = error;
    } else {
      const { error } = await supabaseClient
        .from("reminder")
        .insert([{ title, description, isComplete,imagen, user_id: user.id }]);
      supabaseError = error;
    }

    setIsLoading(false);
    if (supabaseError) {
      setErrorMessage(supabaseError.message);
    } else {
      closeHandler();
    }
  };

  //imagen
  const handleChange = async (event) => {

    let file = event.target.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
      setImg(reader.result);
    };
    reader.onerror = function (error) {

      console.log("Error: ", error);
    };
  };
//imagen 

  const closeHandler = () => {
    setTitle("");
    setDescription("");
    setIsComplete(false);
    setTodo(null);
    onClose();
  };

 
  return (

    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={submitHandler}>
          <ModalHeader>{todo ? t.Manage.Update : t.Manage.New}</ModalHeader>
          <ModalCloseButton onClick={closeHandler} />
          <ModalBody pb={6}>
            {errorMessage && (
              <Alert status="error" borderRadius="lg" mb="6">
                <AlertIcon />
                <Text textAlign="center">{errorMessage}</Text>
              </Alert>
            )}

            <FormControl isRequired={true}>
              <FormLabel>{t.Manage.titleNota}</FormLabel>
              <Input
                ref={initialRef}
                placeholder={t.Manage.Addt}
                onChange={(event) => setTitle(event.target.value)}
                value={title}
              />
            </FormControl>

            <FormControl mt={4} isRequired={true}>
              <FormLabel>{t.Manage.Description}</FormLabel>
              <Textarea
                placeholder={t.Manage.AddD}
                onChange={(event) => setDescription(event.target.value)}
                value={description}
              />
              <FormHelperText>
                {t.Manage.DescriptionN}

              </FormHelperText>
            </FormControl>
{/* ///formcontrol de imagen */}
            <FormControl>
             
             <input type="file" onChange={handleChange} /> 
         
             <img src={imagen} alt="imagen" handleChange={(event) => setImg(event.target.value)} />
             
             </FormControl>

{/* //termino de formcontrol de imagen */}
            <FormControl mt={4}>
              <FormLabel>{t.Manage.Question}</FormLabel>
              <Switch
                isChecked={isComplete}
                id="is-completed"
                onChange={(event) => setIsComplete(!isComplete)}
              />
            </FormControl>
          </ModalBody>
       
          <ModalFooter>
            <ButtonGroup spacing="3">
              <Button onClick={closeHandler} colorScheme="red" type="reset" isDisabled={isLoading}>Cancel  </Button>

             <Button colorScheme="blue" type="submit" isLoading={isLoading}> {todo ? "Update" : "Save"} </Button>
              
            </ButtonGroup>


            

          
                  
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ManageTodo;