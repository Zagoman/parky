import styles from "./Footer.module.scss";
import Link from "next/link";
import parkyLogoImport from "../../../public/parky-logo-blue.svg";
import Image from "next/image";

import { SignInButton, SignUpButton } from "@clerk/nextjs";

export const Footer = () => {
  const parkyLogo = parkyLogoImport as string;

  return (
    <div className={styles.footer}>
      <Image src={parkyLogo} alt="parky logo" className={styles.footerLogo} />
      <section>
        <div className={styles.footerContents}>
          <h4>Parky A/S</h4>
          <p>
            Parky is a application allowing users to rent and book private
            parking spaces earning benefits.
          </p>
        </div>
      </section>
      <section>
        <div className={styles.footerContents}>
          <h4>About</h4>
          <Link href="/home">Home</Link>
          <Link href="/map">Book a parking spot</Link>
          <Link href="/contact">Contact us</Link>
        </div>
      </section>
      <section>
        <h4>Help</h4>
        <SignUpButton />
        <SignInButton />
        <Link href="/account">Account</Link>
      </section>
      <section>&copy; 2023 The Nerd Herd</section>
    </div>
  );
};
