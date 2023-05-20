import styles from "./Footer.module.scss";
import Link from "next/link";
import parkyLogoImport from "../../../public/parky-logo-blue.svg";
import Image from "next/image";

export const Footer = () => {
  const parkyLogo = parkyLogoImport as string;

  return (
    <div className={styles.footer}>
      <Image src={parkyLogo} alt="parky logo" className={styles.footerLogo} />
      <section>
        <div className={styles.footerContents}>
          <h4>Parky A/S</h4>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
            accusamus illo facilis laudantium ex? Laborum ipsa ipsum illum
            accusantium magnam.
          </p>
        </div>
      </section>
      <section>
        <div className={styles.footerContents}>
          <h4>About</h4>
          <Link href="/map">Book a parking spot</Link>
          <Link href="/howitworks">How it works</Link>
        </div>
      </section>
      <section>
        <h4>Help</h4>
        <Link href="/contact">Contact us</Link>
        <Link href="/register">Register account</Link>
        <Link href="/signin">Sign in</Link>
        <Link href="/account">My account</Link>
      </section>
      <section>&copy; 2023 The Nerd Herd</section>
    </div>
  );
};
