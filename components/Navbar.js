import { Box, Button, ButtonGroup, Flex, Heading } from "@chakra-ui/react";
import NavLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { supabaseClient } from "../lib/supabaseClient";

import en from "../translations/en.json"
import es from "../translations/es.json"
import Selector from "./Selector";

const Navbar = ({ onOpen }) => {
  const {router, asPath, locale, locales} = useRouter();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const t = locale === "en" ? en : es;
  const logoutHandler = async () => {
    try {
      setIsLogoutLoading(true);
      await supabaseClient.auth.signOut();
      locale.push("/signin");
    } catch (error) {
      locale.push("/signin");
    } finally {
      setIsLogoutLoading(false);
    }
  };

  return (
    <Box height="100%" p="5" bg="gray.100">
      <Box maxW="6xl" mx="auto">
        <Flex
          as="nav"
          aria-label="Site navigation"
          align="center"
          justify="space-between"
        >
          <NavLink href="/">
            <Heading mr="4" as="button">
              {t.navbar.Heading}
            </Heading>
          </NavLink>
          <Selector/>
          <Box>
            <NavLink href="/profile">{t.navbar.ButtonP}</NavLink>
            <ButtonGroup spacing="4" ml="6">
              {asPath === "/" && (
                <Button colorScheme="blue" onClick={onOpen}>
                  {t.navbar.ButtonAdd}
                </Button>
              )}
              <Button
                colorScheme="red"
                onClick={logoutHandler}
                isLoading={isLogoutLoading}
              >
                {t.navbar.ButtonLO}
              </Button>
            </ButtonGroup>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Navbar;