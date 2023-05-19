import styles from "./Footer.module.scss";

export const Footer = () => {
  return (
    <div className={styles.footer}>
      <section>Section1</section>
      <section>Section2</section>
      <section>Section3</section>
      <section>&copy; 2023 The Nerd Herd</section>
    </div>
  );
};
