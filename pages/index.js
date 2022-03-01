import { useDisclosure } from "@chakra-ui/hooks";
import { Box, HStack, SimpleGrid, Tag } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ManageTodo from "../components/ManageNotas";
import Navbar from "../components/Navbar";
import SingleTodo from "../components/SingleNotas";
import { supabaseClient } from "../lib/supabaseClient";
import en from "../translations/en.json"
import es from "../translations/es.json"

const Home = () => {
  const initialRef = useRef();
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const {router, asPath, locale, locales} = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = supabaseClient.auth.user();

  useEffect(() => {
   // if (!user) {
     // router.push("/signin");
    //}
  }, [user, router]);

  useEffect(() => {
    if (user) {
      supabaseClient
        .from("reminder")
        .select("*")
        .eq("user_id", user?.id)
        .order("id", { ascending: false })
        .then(({ data, error }) => {
          if (!error) {
            setTodos(data);
          }
        });
    }
  }, [user]);

  useEffect(() => {
    const todoListener = supabaseClient
      .from("reminder")
      .on("*", (payload) => {
        if (payload.eventType !== "DELETE") {
          const newTodo = payload.new;
          setTodos((oldTodos) => {
            const exists = oldTodos.find((todo) => todo.id === newTodo.id);
            let newTodos;
            if (exists) {
              const oldTodoIndex = oldTodos.findIndex(
                (obj) => obj.id === newTodo.id
              );
              oldTodos[oldTodoIndex] = newTodo;
              newTodos = oldTodos;
            } else {
              newTodos = [...oldTodos, newTodo];
            }
            newTodos.sort((a, b) => b.id - a.id);
            return newTodos;
          });
        }
      })
      .subscribe();

    return () => {
      todoListener.unsubscribe();
    };
  }, []);

  const openHandler = (clickedTodo) => {
    setTodo(clickedTodo);
    onOpen();
  };

  const deleteHandler = async (todoId) => {
    setIsDeleteLoading(true);
    const { error } = await supabaseClient
      .from("reminder")
      .delete()
      .eq("id", todoId);
    if (!error) {
      setTodos(todos.filter((todo) => todo.id !== todoId));
    }
    setIsDeleteLoading(false);
  };
  // aqui mero en la linea 99 en adelante :3  
  //ademas de que debes de ir al apartado de ManageNotas.js para tomar unas lineas de codigo y colocarle la imagen ademas de un 
  //buscador de imagen así bien mamalon 
  const t = locale === "en" ? en : es;
  return (
    <div>

    
      <Head>
        <title>{t.index.title}</title>
        <meta
          name="description"
          content="Awesome todoapp to store your awesome todos"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar onOpen={onOpen} />
        <ManageTodo
          isOpen={isOpen}
          onClose={onClose}
          initialRef={initialRef}
          todo={todo}
          setTodo={setTodo}
        />
        <HStack m="10" spacing="4" justify="center">
          <Box>
            <Tag bg="green.500" borderRadius="3xl" size="sm" mt="1" /> 
            {t.index.CatCo}
          </Box>
          <Box>
            <Tag bg="yellow.400" borderRadius="3xl" size="sm" mt="1" />{" "}
            {t.index.CatIn}
          </Box>
         
        </HStack>
        <SimpleGrid
          columns={{ base: 2, md: 3, lg: 4 }}
          gap={{ base: "4", md: "6", lg: "8" }}
          m="10"
        >
          {todos.map((todo, index) => (
            <SingleTodo
              todo={todo}
              key={index}
              openHandler={openHandler}
              deleteHandler={deleteHandler}
              isDeleteLoading={isDeleteLoading}
            />
          ))}
        </SimpleGrid>
      </main>
    </div>
  );
};

export default Home;