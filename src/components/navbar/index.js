import { useState } from "react";
import { Center, Tooltip, UnstyledButton, Stack, rem } from "@mantine/core";
import {
  IconHome2,
  IconFlask2,
  IconLogout,
  IconBrandCashapp,
  IconArrowsTransferDown,
} from "@tabler/icons-react";
//local imports
import classes from "./navbar.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { logoutService } from "@/services/auth";

function NavbarLink({ icon: Icon, label, active, onClick }) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const menus = [
  { icon: IconHome2, label: "App", destination: "/" },
  { icon: IconFlask2, label: "Lab", destination: "/lab" },
  { icon: IconBrandCashapp, label: "Payments", destination: "/payments" },
  {
    icon: IconArrowsTransferDown,
    label: "Transfer",
    destination: "/transfer",
  },
];

export default function Navbar() {
  const router = useRouter();
  const [active, setActive] = useState(router.pathname);

  const logout = async () => {
    await logoutService();
    router.push("/auth/login");
  };

  const links = menus.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={link.destination === active}
      onClick={() => {
        router.push(link.destination);
        setActive(link.destination);
      }}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
        <Image
          src="/logo.png"
          alt="logo"
          width={40}
          height={40}
          className="mb-10 w-8 sm:w-16 object-cover"
        />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconLogout} label="Logout" onClick={logout} />
      </Stack>
    </nav>
  );
}
